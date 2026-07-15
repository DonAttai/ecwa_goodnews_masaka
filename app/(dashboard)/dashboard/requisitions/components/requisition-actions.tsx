import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RequisitionItem, Status } from "../types"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { updateRequisitionStatus } from "../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PRIORITY_CLASSES, STATUS_CLASSES } from "../constants/badge-classes"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, FileText, AlertCircle, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import AdminRequisitionActions from "./admin-requisition-actions"
import RequisitionDetails from "./requisition-details"

export default function RequisitionActions({
  requisition,
  isAdmin,
}: {
  requisition: RequisitionItem
  isAdmin: boolean
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleStatusChange = async (id: string, status: Status) => {
    try {
      setIsLoading(true)
      const rejectionReason = rejectionReasons[id] ?? undefined
      const result = await updateRequisitionStatus(id, status, rejectionReason)

      if (result.success) {
        toast.success(result.message)
        setIsDialogOpen(false)

        setTimeout(() => {
          router.refresh()
        }, 200)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 size-4" />
          Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] w-[95vw] max-w-[95vw] overflow-hidden border p-0 shadow-2xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl 2xl:max-w-5xl">
        {/* Header */}
        <DialogHeader className="border-b bg-white px-8 py-6">
          <div className="flex flex-col gap-4">
            {/* Title - Top */}
            <DialogTitle className="text-2xl leading-tight font-semibold tracking-tight text-slate-900">
              {requisition.title}
            </DialogTitle>

            {/* Status & Priority - Bottom */}
            <div className="flex gap-6">
              {/* Status */}
              <div>
                <p className="mb-1.5 text-[10px] font-medium tracking-widest text-slate-500 uppercase">
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
                <p className="mb-1.5 text-[10px] font-medium tracking-widest text-slate-500 uppercase">
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
        <ScrollArea className="max-h-[calc(92vh-220px)]">
          <div className="space-y-8 p-8">
            {/* Core Details */}
            <RequisitionDetails requisition={requisition} />

            <Separator />

            {/* Description */}
            {requisition.description && (
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FileText className="size-4" />
                  DESCRIPTION
                </h4>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 text-[15px] leading-relaxed text-slate-700">
                  {requisition.description}
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {requisition.rejectionReason && (
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-rose-600">
                  <AlertCircle className="size-4" />
                  REJECTION REASON
                </h4>
                <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-6 text-[15px] leading-relaxed text-rose-700">
                  {requisition.rejectionReason}
                </div>
              </div>
            )}

            {/* Approval Info */}
            {requisition.approvedBy && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="rounded-full bg-emerald-100 p-2">
                  <ShieldCheck className="size-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-emerald-700">
                    Approved by{" "}
                    <span className="font-semibold text-emerald-800">
                      {requisition.approvedBy.name}
                    </span>
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* Admin Actions */}

            {isAdmin && (
              <AdminRequisitionActions
                isLoading={isLoading}
                handleStatusChange={handleStatusChange}
                requisition={requisition}
                rejectionReasons={rejectionReasons}
                setRejectionReasons={setRejectionReasons}
              />
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
      </DialogContent>
    </Dialog>
  )
}
