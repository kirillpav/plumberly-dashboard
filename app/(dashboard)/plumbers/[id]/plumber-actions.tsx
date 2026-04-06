"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { PlumberWithProfile } from "@/lib/types/database";
import { verifyPlumber, rejectPlumber } from "../actions";
import { CheckCircle, XCircle } from "lucide-react";

interface PlumberActionsProps {
  plumber: PlumberWithProfile;
}

export function PlumberActions({ plumber }: PlumberActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async () => {
    setLoading(true);
    const result = await verifyPlumber(plumber.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Plumber approved successfully");
      router.refresh();
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setLoading(true);
    const result = await rejectPlumber(plumber.id, rejectReason);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Plumber application rejected");
      setRejectModal(false);
      setRejectReason("");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          onClick={handleApprove}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <CheckCircle className="h-4 w-4" />
          {loading ? "Approving..." : "Approve"}
        </Button>
        <Button
          variant="destructive"
          onClick={() => setRejectModal(true)}
          disabled={loading}
        >
          <XCircle className="h-4 w-4" />
          Reject
        </Button>
      </div>

      <Modal
        open={rejectModal}
        onClose={() => {
          setRejectModal(false);
          setRejectReason("");
        }}
        title="Reject Plumber Application"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setRejectModal(false);
                setRejectReason("");
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={loading || !rejectReason.trim()}
            >
              {loading ? "Rejecting..." : "Reject Application"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This will reject the application for{" "}
            <strong>{plumber.profiles.full_name}</strong>. They will not be able
            to use the platform.
          </p>
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Reason <span className="text-destructive">*</span>
            </label>
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
