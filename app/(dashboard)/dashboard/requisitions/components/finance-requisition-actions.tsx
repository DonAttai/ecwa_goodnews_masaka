import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RequisitionItem, Status } from "../types"
import { RequisitionStatus } from "@/generated/prisma/enums"
import { Banknote, CircleCheck, X } from "lucide-react"

export default function FinanceRequisitionActions({
  loadingAction,
  handleStatusChange,
  requisition,
  rejectionReasons,
  setRejectionReasons,
}: {
  loadingAction: Status | null
  handleStatusChange: (id: string, status: Status) => Promise<void>
  requisition: RequisitionItem
  rejectionReasons: Record<string, string>
  setRejectionReasons: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >
}) {
  const { COMPLETED, REJECTED, PAID } = RequisitionStatus
  const isPaying = loadingAction === PAID
  const isRejecting = loadingAction === REJECTED
  const isCompleting = loadingAction === COMPLETED

  // Check if requisition is completed
  const isCompleted = requisition.status === COMPLETED
  const isRejected = requisition.status === REJECTED
  const isPaid = requisition.status === PAID

  // Also consider disabling for rejected items
  const isLocked = isCompleted || isRejected

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-500">Finance Actions</h4>

        {isLocked && (
          <Badge variant="outline" className="text-xs">
            Locked
          </Badge>
        )}
      </div>

      {/* Show lock message if completed */}
      {isCompleted && (
        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
          This requisition has been completed and cannot be modified.
        </div>
      )}

      {isRejected && (
        <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-700">
          This requisition has been rejected and cannot be modified.
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          size="sm"
          variant="info"
          onClick={() => handleStatusChange(requisition.id, PAID)}
          disabled={loadingAction !== null || isLocked || isPaid}
          className="min-w-32"
        >
          <Banknote className="h-4 w-4" />
          {isPaying ? "Processing..." : "Paid"}
        </Button>
        <Button
          size="sm"
          variant="success"
          onClick={() => handleStatusChange(requisition.id, COMPLETED)}
          disabled={loadingAction !== null || isLocked}
          className="min-w-32"
        >
          <CircleCheck className="h-4 w-4" />
          {isCompleting ? "completing..." : "Mark Complete"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleStatusChange(requisition.id, REJECTED)}
          disabled={loadingAction !== null || isLocked || isPaid}
          className="min-w-32"
        >
          <X className="h-4 w-4" />
          {isRejecting ? "Rejecting..." : "Reject"}
        </Button>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-500">
          Rejection note
        </label>
        <Input
          placeholder="Provide reason for rejection if applicable..."
          value={rejectionReasons[requisition.id] ?? ""}
          onChange={(event) =>
            setRejectionReasons((current) => ({
              ...current,
              [requisition.id]: event.target.value,
            }))
          }
          disabled={isLocked}
          className="text-sm"
        />
      </div>
    </div>
  )
}
