import { createClient } from "@/lib/supabase/server";
import { ReviewTable } from "./review-table";
import { ReviewWithProfiles } from "@/lib/types/database";

export default async function ReviewsPage() {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(
      "*, customer:profiles!reviews_customer_id_fkey(*), plumber:profiles!reviews_plumber_id_fkey(*)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="text-destructive">
        Error loading reviews: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">
          Reviews
        </h1>
        <p className="text-muted-foreground">
          Monitor and moderate customer reviews. Flag or remove inappropriate
          content.
        </p>
      </div>
      <ReviewTable reviews={(reviews as unknown as ReviewWithProfiles[]) ?? []} />
    </div>
  );
}
