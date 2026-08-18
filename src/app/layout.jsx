import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Apni Property | Verified Plots & Land in Gorakhpur",
    template: "%s | Apni Property",
  },
  description:
    "Apni Property helps you find verified, registry-ready plots and land across Gorakhpur. Browse listings with photos, videos and transparent pricing.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
        <Toaster
          position="top-center"
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              color: "#ffffff",
              borderRadius: "1rem",
              backdropFilter: "blur(16px)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
            },
          }}
        />
      </body>
    </html>
  );
}
