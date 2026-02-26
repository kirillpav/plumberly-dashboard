import { createClient } from "@/lib/supabase/server";
import { JobTable } from "./job-table";
import { JobWithRelations } from "@/lib/types/database";

export default async function JobsPage() {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select(
      "*, customer:profiles!jobs_customer_id_fkey(*), plumber:profiles!jobs_plumber_id_fkey(*), enquiries!jobs_enquiry_id_fkey(*)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="text-destructive">
        Error loading jobs: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">
          Jobs
        </h1>
        <p className="text-muted-foreground">
          View all jobs on the platform with their current status.
        </p>
      </div>
      <JobTable jobs={(jobs as unknown as JobWithRelations[]) ?? []} />
    </div>
  );
}
