import { CalendarDays, CircleDollarSign, Hash, UserRound } from "lucide-react"
import { RequisitionItem } from "../types"

const InfoItem = ({ icon: Icon, label, children }: any) => (
  <div className="flex flex-col rounded-lg bg-slate-50 px-3 py-2 text-sm">
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-slate-500" />
      <p className="text-slate-600">{label}</p>
    </div>
    <div className="mt-1 pl-6 font-medium text-slate-900">{children}</div>
  </div>
)
export default function RequisitionDetails({
  requisition,
}: {
  requisition: RequisitionItem
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-500">
        Requisition Details
      </h4>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <InfoItem icon={UserRound} label="Requested by">
          {requisition.requestedBy.name}
        </InfoItem>
        <InfoItem icon={Hash} label="Category">
          {requisition.category}
        </InfoItem>
        {requisition.amount && (
          <InfoItem icon={CircleDollarSign} label="Amount">
            {requisition.currency} {requisition.amount.toLocaleString()}
          </InfoItem>
        )}
        {requisition.dueDate && (
          <InfoItem icon={CalendarDays} label="Due date">
            {new Date(requisition.dueDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </InfoItem>
        )}
      </div>
    </div>
  )
}
