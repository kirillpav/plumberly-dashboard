import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PlumberWithProfile } from "@/lib/types/database";
import { StatusBadge, getPlumberStatusVariant } from "@/components/ui/status-badge";
import { StarRating } from "@/components/ui/star-rating";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ArrowLeft, Mail, Phone, MapPin, Clock } from "lucide-react";
import { PlumberActions } from "./plumber-actions";

export default async function PlumberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: plumber, error } = await supabase
    .from("plumber_details")
    .select("*, profiles!plumber_details_user_id_fkey(*)")
    .eq("id", id)
    .single();

  if (error || !plumber) {
    notFound();
  }

  const p = plumber as unknown as PlumberWithProfile;
  const needsReview = !p.verified && (p.status === "provisional" || p.status === "suspended");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/plumbers"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold font-[family-name:var(--font-heading)]">
              {p.profiles.full_name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge variant={getPlumberStatusVariant(p.status)}>
                {p.status}
              </StatusBadge>
              {p.verified ? (
                <StatusBadge variant="success">Verified</StatusBadge>
              ) : (
                <StatusBadge variant="muted">Unverified</StatusBadge>
              )}
            </div>
          </div>
        </div>

        {needsReview && <PlumberActions plumber={p} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <Section title="Personal Information">
          <Field label="Full Name" value={p.profiles.full_name} />
          <Field
            label="Email"
            value={
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                {p.profiles.email}
              </span>
            }
          />
          <Field
            label="Phone"
            value={
              p.profiles.phone ? (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {p.profiles.phone}
                </span>
              ) : (
                <span className="text-muted-foreground">Not provided</span>
              )
            }
          />
          <Field
            label="Registered"
            value={
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {formatDate(p.profiles.created_at)}
              </span>
            }
          />
        </Section>

        {/* Business Details */}
        <Section title="Business Details">
          <Field label="Business Name" value={p.business_name || "Not provided"} />
          <Field
            label="Business Type"
            value={
              p.business_type
                ? p.business_type === "sole_trader"
                  ? "Sole Trader"
                  : "Limited Company"
                : "Not specified"
            }
          />
          <Field
            label="Services"
            value={
              <StatusBadge variant={p.services_type === "gas" ? "warning" : "default"}>
                {p.services_type === "gas" ? "Gas & General" : "General (No Gas)"}
              </StatusBadge>
            }
          />
          <Field
            label="Hourly Rate"
            value={formatCurrency(Number(p.hourly_rate))}
          />
          <Field
            label="Regions"
            value={
              p.regions && p.regions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {p.regions.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                    >
                      <MapPin className="h-3 w-3" />
                      {r}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">No regions set</span>
              )
            }
          />
          {p.bio && <Field label="Bio" value={p.bio} />}
        </Section>

        {/* Gas Safety */}
        {p.services_type === "gas" && (
          <Section title="Gas Safety">
            <Field
              label="Gas Safe Number"
              value={p.gas_safe_number || "Not provided"}
            />
            <Field
              label="Gas Safe Verified"
              value={
                p.gas_safe_verified ? (
                  <StatusBadge variant="success">Verified</StatusBadge>
                ) : (
                  <StatusBadge variant="destructive">Not Verified</StatusBadge>
                )
              }
            />
          </Section>
        )}

        {/* Vetting & Compliance */}
        <Section title="Vetting & Compliance">
          <Field
            label="Consent to Checks"
            value={
              p.consent_to_checks ? (
                <StatusBadge variant="success">Yes</StatusBadge>
              ) : (
                <StatusBadge variant="destructive">No</StatusBadge>
              )
            }
          />
          <Field
            label="Right to Work"
            value={p.right_to_work || "Not provided"}
          />
          {p.vetting_metadata &&
            Object.keys(p.vetting_metadata).length > 0 && (
              <>
                <div className="border-t border-border pt-3 mt-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Additional Vetting Data
                  </p>
                </div>
                {Object.entries(p.vetting_metadata).map(([key, value]) => (
                  <Field
                    key={key}
                    label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    value={String(value)}
                  />
                ))}
              </>
            )}
        </Section>

        {/* Account Status */}
        <Section title="Account Status">
          <Field
            label="Status"
            value={
              <StatusBadge variant={getPlumberStatusVariant(p.status)}>
                {p.status}
              </StatusBadge>
            }
          />
          <Field
            label="Verified"
            value={
              p.verified ? (
                <StatusBadge variant="success">Yes</StatusBadge>
              ) : (
                <StatusBadge variant="muted">No</StatusBadge>
              )
            }
          />
          <Field
            label="Provisional Jobs Remaining"
            value={p.provisional_jobs_remaining}
          />
          <Field
            label="Payouts Enabled"
            value={
              p.payouts_enabled ? (
                <StatusBadge variant="success">Yes</StatusBadge>
              ) : (
                <StatusBadge variant="muted">No</StatusBadge>
              )
            }
          />
          {p.frozen_reason && (
            <Field
              label="Frozen / Rejection Reason"
              value={
                <span className="text-destructive">{p.frozen_reason}</span>
              }
            />
          )}
        </Section>

        {/* Performance */}
        <Section title="Performance">
          <Field
            label="Rating"
            value={
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(Number(p.rating))} />
                <span className="text-sm text-muted-foreground">
                  {Number(p.rating).toFixed(1)} / 5.0
                </span>
              </div>
            }
          />
          <Field label="Jobs Completed" value={p.jobs_completed} />
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <h2 className="text-sm font-semibold font-[family-name:var(--font-heading)] uppercase tracking-wide text-muted-foreground mb-4">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}
