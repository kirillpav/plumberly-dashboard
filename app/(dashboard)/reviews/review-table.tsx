"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DataTable, Column } from "@/components/ui/data-table";
import { StarRating } from "@/components/ui/star-rating";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ConfirmModal } from "@/components/ui/modal";
import { ReviewWithProfiles } from "@/lib/types/database";
import { flagReview, unflagReview, removeReview } from "./actions";
import { formatDate } from "@/lib/utils";
import { Flag, Trash2 } from "lucide-react";

interface ReviewTableProps {
  reviews: ReviewWithProfiles[];
}

export function ReviewTable({ reviews }: ReviewTableProps) {
  const [ratingFilter, setRatingFilter] = useState("");
  const [flaggedFilter, setFlaggedFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState<ReviewWithProfiles | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = reviews.filter((r) => {
    if (ratingFilter && r.rating !== Number(ratingFilter)) return false;
    if (flaggedFilter === "flagged" && !r.flagged) return false;
    if (flaggedFilter === "unflagged" && r.flagged) return false;
    return true;
  });

  const handleToggleFlag = async (review: ReviewWithProfiles) => {
    setLoading(true);
    const result = review.flagged
      ? await unflagReview(review.id)
      : await flagReview(review.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(review.flagged ? "Review unflagged" : "Review flagged");
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    if (!deleteModal) return;
    setLoading(true);
    const result = await removeReview(deleteModal.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Review removed");
    }
    setDeleteModal(null);
    setLoading(false);
  };

  const columns: Column<ReviewWithProfiles>[] = [
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (row) => <StarRating rating={row.rating} />,
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
      key: "comment",
      label: "Comment",
      render: (row) => (
        <span
          className="block max-w-[300px] truncate text-muted-foreground"
          title={row.comment ?? ""}
        >
          {row.comment || "-"}
        </span>
      ),
    },
    {
      key: "flagged",
      label: "Flagged",
      sortable: true,
      render: (row) =>
        row.flagged ? (
          <StatusBadge variant="destructive">Flagged</StatusBadge>
        ) : (
          <StatusBadge variant="muted">OK</StatusBadge>
        ),
    },
    {
      key: "created_at",
      label: "Date",
      sortable: true,
      render: (row) => (
        <span className="text-muted-foreground">{formatDate(row.created_at)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleFlag(row)}
            disabled={loading}
            title={row.flagged ? "Unflag review" : "Flag review"}
          >
            <Flag
              className={`h-4 w-4 ${
                row.flagged ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteModal(row)}
            disabled={loading}
            title="Remove review"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search reviews..."
        searchKeys={["customer.full_name", "plumber.full_name", "comment"]}
        filters={
          <>
            <Select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">All Ratings</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r !== 1 ? "s" : ""}
                </option>
              ))}
            </Select>
            <Select
              value={flaggedFilter}
              onChange={(e) => setFlaggedFilter(e.target.value)}
            >
              <option value="">All Reviews</option>
              <option value="flagged">Flagged</option>
              <option value="unflagged">Not Flagged</option>
            </Select>
          </>
        }
      />

      <ConfirmModal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleRemove}
        title="Remove Review"
        description="Are you sure you want to permanently remove this review? This action cannot be undone."
        confirmLabel="Remove"
        loading={loading}
        destructive
      />
    </>
  );
}
