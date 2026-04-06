"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function verifyPlumber(plumberId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("plumber_details")
    .update({ verified: true, status: "active" })
    .eq("id", plumberId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/plumbers");
  return { success: true };
}

export async function freezePlumber(userId: string, reason: string) {
  const adminClient = createAdminClient();

  const { error } = await adminClient.rpc("freeze_plumber", {
    p_user_id: userId,
    p_reason: reason || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/plumbers");
  return { success: true };
}

export async function rejectPlumber(plumberId: string, reason: string) {
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("plumber_details")
    .update({ status: "suspended", verified: false, frozen_reason: reason })
    .eq("id", plumberId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/plumbers");
  return { success: true };
}

export async function updatePlumberStatus(
  plumberId: string,
  status: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("plumber_details")
    .update({ status, frozen_reason: null })
    .eq("id", plumberId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/plumbers");
  return { success: true };
}
