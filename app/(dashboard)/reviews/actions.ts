"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function flagReview(reviewId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reviews")
    .update({ flagged: true })
    .eq("id", reviewId);

  if (error) return { error: error.message };

  revalidatePath("/reviews");
  return { success: true };
}

export async function unflagReview(reviewId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reviews")
    .update({ flagged: false })
    .eq("id", reviewId);

  if (error) return { error: error.message };

  revalidatePath("/reviews");
  return { success: true };
}

export async function removeReview(reviewId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) return { error: error.message };

  revalidatePath("/reviews");
  return { success: true };
}
