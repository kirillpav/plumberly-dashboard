import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "muted";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-zinc-100 text-zinc-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  destructive: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
  muted: "bg-zinc-50 text-zinc-500",
};

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function StatusBadge({
  children,
  variant = "default",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function getPlumberStatusVariant(
  status: string
): BadgeVariant {
  switch (status) {
    case "active":
      return "success";
    case "provisional":
      return "warning";
    case "frozen":
      return "info";
    case "suspended":
      return "destructive";
    default:
      return "default";
  }
}

export function getJobStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "info";
    case "accepted":
    case "quoted":
      return "warning";
    case "cancelled":
      return "destructive";
    case "pending":
      return "muted";
    default:
      return "default";
  }
}

export function getEnquiryStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "info";
    case "accepted":
      return "warning";
    case "cancelled":
      return "destructive";
    case "new":
      return "muted";
    default:
      return "default";
  }
}
