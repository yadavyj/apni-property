"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const PublicAuthContext = createContext(null);

export default function PublicAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    let active = true;
    let subscription = null;

    async function initializeAuth() {
      const { createClient } = await import("@/lib/supabase/client");
      if (!active) return;

      const supabase = createClient();
      if (!supabase) {
        return;
      }

      clientRef.current = supabase;

      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setUser(data?.session?.user || null);

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active) setUser(session?.user || null);
      });
      subscription = authListener?.subscription || null;
    }

    initializeAuth();

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function signOut() {
    let supabase = clientRef.current;
    if (!supabase) {
      const { createClient } = await import("@/lib/supabase/client");
      supabase = createClient();
      clientRef.current = supabase;
    }

    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    setUser(null);
  }

  return (
    <PublicAuthContext.Provider value={{ user, signOut }}>
      {children}
    </PublicAuthContext.Provider>
  );
}

export function usePublicAuth() {
  const context = useContext(PublicAuthContext);
  if (!context) {
    throw new Error("usePublicAuth must be used within PublicAuthProvider.");
  }
  return context;
}
