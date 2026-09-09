import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RequisitionItem, roles, Status } from "../types"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { updateRequisitionStatus } from "../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PRIORITY_CLASSES, STATUS_CLASSES } from "../constants/badge-classes"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, FileText, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import AdminRequisitionActions from "./admin-requisition-actions"
import RequisitionDetails from "./requisition-details"
import RequisitionTimeline from "./requisition-timeline"
import FinanceRequisitionActions from "./finance-requisition-actions"
import { RequisitionDetailsSkeleton } from "./requisition-details-skeleton"
import { useDialogFormReady } from "@/hooks/use-dialog-form-ready"

export default function RequisitionActions({
  requisition,
  role,
}: {
  requisition: RequisitionItem
  role: roles
}) {
  const router = useRouter()
  const { open, contentReady, handleOpenChange, handleClose } =
    useDialogFormReady()
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({})
  const [loadingAction, setLoadingAction] = useState<Status | null>(null)

  const handleStatusChange = async (id: string, status: Status) => {
    try {
      setLoadingAction(status)
      const rejectionReason = rejectionReasons[id] ?? undefined
      const result = await updateRequisitionStatus(id, status, rejectionReason)

      if (result.success) {
        toast.success(result.message)
        handleClose()

        setTimeout(() => {
          router.refresh()
        }, 200)
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 size-4" />
          Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] w-[95vw] max-w-[95vw] overflow-hidden border p-0 shadow-2xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl 2xl:max-w-5xl">
        {/* Header */}
        <DialogHeader className="border-b bg-card px-8 py-6">
          <div className="flex flex-col gap-4">
            {/* Title - Top */}
            <DialogTitle className="text-2xl leading-tight font-semibold tracking-tight text-foreground">
              {requisition.title}
            </DialogTitle>

            {/* Status & Priority - Bottom */}
            <div className="flex gap-6">
              {/* Status */}
              <div>
                <p className="mb-1.5 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                  STATUS
                </p>
                <Badge
                  className={`font-medium ${STATUS_CLASSES[requisition.status]}`}
                >
                  {requisition.status}
                </Badge>
              </div>

              {/* Priority */}
              <div>
                <p className="mb-1.5 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                  PRIORITY
                </p>
                <Badge
                  variant="outline"
                  className={`font-medium ${PRIORITY_CLASSES[requisition.priority]}`}
                >
                  {requisition.priority}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        {contentReady ? (
          <div className="animate-in fade-in-0">
            <div className="max-h-[calc(92dvh-220px)] overflow-y-auto overscroll-contain">
              <div className="space-y-8 p-8 pb-12">
                {/* Core Details */}
                <RequisitionDetails requisition={requisition} />

                <Separator />

                {/* Status journey */}
                <RequisitionTimeline requisition={requisition} />

                <Separator />

                {/* Description */}
                {requisition.description && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <FileText className="size-4" />
                      DESCRIPTION
                    </h4>
                    <div className="rounded-xl border border-border bg-muted/40 p-6 text-[15px] leading-relaxed text-foreground">
                      {requisition.description}
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {requisition.rejectionReason && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400">
                      <AlertCircle className="size-4" />
                      REJECTION REASON
                    </h4>
                    <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-6 text-[15px] leading-relaxed text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                      {requisition.rejectionReason}
                    </div>
                  </div>
                )}

                {/* Approval Info */}
                {requisition.approvedBy && (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
                    <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/60">
                      <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        Approved by{" "}
                        <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                          {requisition.approvedBy.name}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Admin Actions */}
                {role === "ADMIN" && (
                  <AdminRequisitionActions
                    loadingAction={loadingAction}
                    handleStatusChange={handleStatusChange}
                    requisition={requisition}
                    rejectionReasons={rejectionReasons}
                    setRejectionReasons={setRejectionReasons}
                  />
                )}

                {/* Finance actions */}
                {role === "FINANCE" && (
                  <FinanceRequisitionActions
                    loadingAction={loadingAction}
                    handleStatusChange={handleStatusChange}
                    requisition={requisition}
                    rejectionReasons={rejectionReasons}
                    setRejectionReasons={setRejectionReasons}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <RequisitionDetailsSkeleton />
        )}

        {/* Footer */}
      </DialogContent>
    </Dialog>
  )
}
