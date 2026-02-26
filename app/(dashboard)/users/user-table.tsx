"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select } from "@/components/ui/select";
import { Profile } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";

interface UserTableProps {
  users: Profile[];
}

export function UserTable({ users }: UserTableProps) {
  const [roleFilter, setRoleFilter] = useState("");

  const filtered = users.filter((u) => {
    if (roleFilter && u.role !== roleFilter) return false;
    return true;
  });

  const columns: Column<Profile>[] = [
    {
      key: "full_name",
      label: "Name",
      sortable: true,
      render: (row) => <span className="font-medium">{row.full_name}</span>,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">{row.email}</span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => (
        <span className="text-muted-foreground">{row.phone || "-"}</span>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (row) => (
        <StatusBadge variant={row.role === "plumber" ? "info" : "default"}>
          {row.role}
        </StatusBadge>
      ),
    },
    {
      key: "is_admin",
      label: "Admin",
      sortable: true,
      render: (row) =>
        row.is_admin ? (
          <StatusBadge variant="warning">Admin</StatusBadge>
        ) : null,
    },
    {
      key: "created_at",
      label: "Created At",
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
      searchPlaceholder="Search users..."
      searchKeys={["full_name", "email", "phone"]}
      filters={
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="plumber">Plumber</option>
        </Select>
      }
    />
  );
}
