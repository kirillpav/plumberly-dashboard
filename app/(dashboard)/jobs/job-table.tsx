"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge, getJobStatusVariant } from "@/components/ui/status-badge";
import { Select } from "@/components/ui/select";
import { JobWithRelations } from "@/lib/types/database";
import { formatDate, formatCurrency } from "@/lib/utils";

interface JobTableProps {
  jobs: JobWithRelations[];
}

export function JobTable({ jobs }: JobTableProps) {
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = jobs.filter((j) => {
    if (statusFilter && j.status !== statusFilter) return false;
    return true;
  });

  const columns: Column<JobWithRelations>[] = [
    {
      key: "enquiries.title",
      label: "Enquiry",
      sortable: true,
      render: (row) => (
        <span className="font-medium">
          {row.enquiries?.title ?? "-"}
        </span>
      ),
      getValue: (row) => row.enquiries?.title ?? "",
    },
    {
      key: "customer.full_name",
      label: "Customer",
      sortable: true,
      render: (row) => row.customer.full_name,
      getValue: (row) => row.customer.full_name,
    },
    {
      key: "plumber.full_name",
      label: "Plumber",
      sortable: true,
      render: (row) => row.plumber.full_name,
      getValue: (row) => row.plumber.full_name,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge variant={getJobStatusVariant(row.status)}>
          {row.status.replace("_", " ")}
        </StatusBadge>
      ),
    },
    {
      key: "quote_amount",
      label: "Quote",
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">
          {row.quote_amount ? formatCurrency(Number(row.quote_amount)) : "-"}
        </span>
      ),
      getValue: (row) => Number(row.quote_amount) || 0,
    },
    {
      key: "scheduled_date",
      label: "Scheduled",
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">
          {row.scheduled_date ? formatDate(row.scheduled_date) : "-"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">
          {formatDate(row.created_at)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={filtered}
      columns={columns}
      searchPlaceholder="Search jobs..."
      searchKeys={[
        "customer.full_name",
        "plumber.full_name",
        "enquiries.title",
      ]}
      filters={
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="quoted">Quoted</option>
          <option value="accepted">Accepted</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      }
    />
  );
}
