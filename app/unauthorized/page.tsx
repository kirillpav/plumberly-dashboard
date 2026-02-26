import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-4 text-center">
        <ShieldX className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">
          Not Authorized
        </h1>
        <p className="max-w-sm text-muted-foreground">
          You don&apos;t have admin access to this dashboard. Please contact an
          administrator if you believe this is an error.
        </p>
        <Link href="/login">
          <Button variant="outline">Back to Login</Button>
        </Link>
      </div>
    </div>
  );
}
