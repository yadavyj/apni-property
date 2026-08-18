"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { leadSchema } from "@/lib/validations/lead.schema";

export async function createLead(rawData) {
  const data = leadSchema.parse(rawData);
  const supabase = await createClient();

  const referralCode = data.referral_code ? data.referral_code.trim().toUpperCase() : null;
  // Generate the id ourselves so we don't need to read the row back after
  // inserting — the public "leads" table has no public SELECT policy (by
  // design, only admins can read leads), and Supabase's insert-then-select
  // (triggered by .select()) fails RLS on that read-back with a misleading
  // "row-level security policy" error.
  const leadId = randomUUID();

  const { error } = await supabase.from("leads").insert({
    id: leadId,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email ? data.email.trim() : null,
    message: data.message ? data.message.trim() : null,
    property_id: data.property_id || null,
    referral_code: referralCode,
  });

  if (error) throw new Error(error.message);

  if (referralCode) {
    await recordReferral({
      referralCode,
      leadId,
      propertyId: data.property_id || null,
      referredName: data.name.trim(),
      referredPhone: data.phone.trim(),
    });
  }

  revalidatePath("/admin/leads");

  return { success: true };
}

async function recordReferral({ referralCode, leadId, propertyId, referredName, referredPhone }) {
  const admin = createAdminClient();

  const { data: referrer } = await admin
    .from("profiles")
    .select("id")
    .eq("referral_code", referralCode)
    .maybeSingle();

  if (!referrer) return;

  await admin.from("referrals").insert({
    referrer_id: referrer.id,
    lead_id: leadId,
    property_id: propertyId,
    referred_name: referredName,
    referred_phone: referredPhone,
    status: "pending",
  });
}

export async function updateLeadStatus(id, status) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/leads");
}

export async function deleteLead(id) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/leads");
}
