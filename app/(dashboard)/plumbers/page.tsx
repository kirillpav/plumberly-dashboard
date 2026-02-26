import { createClient } from "@/lib/supabase/server";
import { PlumberTable } from "./plumber-table";
import { PlumberWithProfile } from "@/lib/types/database";

export default async function PlumbersPage() {
  const supabase = await createClient();

  const { data: plumbers, error } = await supabase
    .from("plumber_details")
    .select("*, profiles!plumber_details_user_id_fkey(*)")
    .order("created_at", { ascending: false, referencedTable: "profiles" });

  if (error) {
    return (
      <div className="text-destructive">
        Error loading plumbers: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">
          Plumber Verification
        </h1>
        <p className="text-muted-foreground">
          Manage plumber accounts, verification status, and account freezing.
        </p>
      </div>
      <PlumberTable plumbers={(plumbers as unknown as PlumberWithProfile[]) ?? []} />
    </div>
  );
}
