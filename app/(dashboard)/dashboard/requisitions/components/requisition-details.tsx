import {
  CalendarDays,
  CircleDollarSign,
  Hash,
  Receipt,
  UserRound,
  LucideIcon,
} from "lucide-react"
import { RequisitionItem } from "../types"

type InfoItemProps = {
  icon: LucideIcon
  label: string
  children: React.ReactNode
}

const InfoItem = ({ icon: Icon, label, children }: InfoItemProps) => (
  <div className="flex flex-col rounded-lg bg-muted/60 px-3 py-2 text-sm">
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-muted-foreground" />
      <p className="text-muted-foreground">{label}</p>
    </div>
    <div className="mt-1 pl-6 font-medium text-foreground">{children}</div>
  </div>
)
export default function RequisitionDetails({
  requisition,
}: {
  requisition: RequisitionItem
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">
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
        {requisition.neededBy && (
          <InfoItem icon={CalendarDays} label="Needed By">
            {new Date(requisition.neededBy).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </InfoItem>
        )}
        {requisition.receiptUrl && (
          <InfoItem icon={Receipt} label="Receipt">
            <a
              href={requisition.receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              View attached file
            </a>
          </InfoItem>
        )}
      </div>
    </div>
  )
}
