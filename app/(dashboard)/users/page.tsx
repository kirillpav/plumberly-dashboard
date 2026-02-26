import { createClient } from "@/lib/supabase/server";
import { UserTable } from "./user-table";
import { Profile } from "@/lib/types/database";

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="text-destructive">
        Error loading users: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">
          Users
        </h1>
        <p className="text-muted-foreground">
          View all registered users on the platform.
        </p>
      </div>
      <UserTable users={(users as Profile[]) ?? []} />
    </div>
  );
}
