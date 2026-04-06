"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge, getPlumberStatusVariant } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PlumberWithProfile } from "@/lib/types/database";
import { verifyPlumber, freezePlumber, updatePlumberStatus } from "./actions";
import { CheckCircle, Snowflake, RotateCcw } from "lucide-react";
import Link from "next/link";

interface PlumberTableProps {
  plumbers: PlumberWithProfile[];
}

export function PlumberTable({ plumbers }: PlumberTableProps) {
  const [statusFilter, setStatusFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [freezeModal, setFreezeModal] = useState<PlumberWithProfile | null>(null);
  const [freezeReason, setFreezeReason] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = plumbers.filter((p) => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (verifiedFilter === "verified" && !p.verified) return false;
    if (verifiedFilter === "unverified" && p.verified) return false;
    return true;
  });

  const handleVerify = async (plumberId: string) => {
    setLoading(true);
    const result = await verifyPlumber(plumberId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Plumber verified successfully");
    }
    setLoading(false);
  };

  const handleFreeze = async () => {
    if (!freezeModal) return;
    setLoading(true);
    const result = await freezePlumber(freezeModal.user_id, freezeReason);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Plumber account frozen");
    }
    setFreezeModal(null);
    setFreezeReason("");
    setLoading(false);
  };

  const handleUnfreeze = async (plumberId: string) => {
    setLoading(true);
    const result = await updatePlumberStatus(plumberId, "active");
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Plumber account unfrozen");
    }
    setLoading(false);
  };

  const columns: Column<PlumberWithProfile>[] = [
    {
      key: "profiles.full_name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <Link
          href={`/plumbers/${row.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.profiles.full_name}
        </Link>
      ),
      getValue: (row) => row.profiles.full_name,
    },
    {
      key: "profiles.email",
      label: "Email",
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">{row.profiles.email}</span>
      ),
      getValue: (row) => row.profiles.email,
    },
    {
      key: "business_name",
      label: "Business",
      sortable: true,
      render: (row) => row.business_name || "-",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge variant={getPlumberStatusVariant(row.status)}>
          {row.status}
        </StatusBadge>
      ),
    },
    {
      key: "verified",
      label: "Verified",
      sortable: true,
      render: (row) =>
        row.verified ? (
          <StatusBadge variant="success">Verified</StatusBadge>
        ) : (
          <StatusBadge variant="muted">Unverified</StatusBadge>
        ),
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (row) => (
        <span>{Number(row.rating).toFixed(1)}</span>
      ),
    },
    {
      key: "jobs_completed",
      label: "Jobs",
      sortable: true,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          {!row.verified && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVerify(row.id)}
              disabled={loading}
              title="Verify plumber"
            >
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </Button>
          )}
          {row.status !== "frozen" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFreezeModal(row)}
              disabled={loading}
              title="Freeze account"
            >
              <Snowflake className="h-4 w-4 text-blue-600" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUnfreeze(row.id)}
              disabled={loading}
              title="Unfreeze account"
            >
              <RotateCcw className="h-4 w-4 text-amber-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search plumbers..."
        searchKeys={["profiles.full_name", "profiles.email", "business_name"]}
        filters={
          <>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="provisional">Provisional</option>
              <option value="active">Active</option>
              <option value="frozen">Frozen</option>
              <option value="suspended">Suspended</option>
            </Select>
            <Select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
            >
              <option value="">All Verification</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </Select>
          </>
        }
      />

      <Modal
        open={!!freezeModal}
        onClose={() => {
          setFreezeModal(null);
          setFreezeReason("");
        }}
        title="Freeze Plumber Account"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setFreezeModal(null);
                setFreezeReason("");
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleFreeze}
              disabled={loading}
            >
              {loading ? "Freezing..." : "Freeze Account"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This will freeze the account of{" "}
            <strong>{freezeModal?.profiles.full_name}</strong>. They will not be
            able to accept new jobs.
          </p>
          <div className="space-y-1">
            <label className="text-sm font-medium">Reason (optional)</label>
            <Input
              value={freezeReason}
              onChange={(e) => setFreezeReason(e.target.value)}
              placeholder="Enter reason for freezing..."
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
