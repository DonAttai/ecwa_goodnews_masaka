import { resend } from "./resend"
import {
  escapeHtml,
  Container,
  Header,
  Hero,
  Section,
  Card,
  Divider,
  Footer,
  Button,
} from "./components"
import { colors } from "./styles"

const FROM = `ECWA Goodnews 1 Masaka <no-reply@ecwagoodnews1masaka.com.ng>`
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? ""

function shell(title: string, subtitle: string, body: string) {
  return Container(`
    ${Header("ECWA Goodnews 1 Masaka")}
    ${Hero(title, subtitle)}
    ${body}
    ${Divider()}
    ${Footer(new Date().getFullYear())}
  `)
}

function detailRow(label: string, value: string) {
  return `
    <p style="font-size:14px;line-height:1.7;color:${colors.text};margin:0;">
      <strong>${label}:</strong> ${value}
    </p>`
}

export async function sendNewRequisitionEmail({
  email,
  name,
  requesterName,
  title,
  amount,
  department,
}: {
  email: string
  name: string
  requesterName: string
  title: string
  amount?: string
  department?: string
}) {
  const html = shell(
    "New Requisition Submitted",
    `Hello ${escapeHtml(name)}, ${escapeHtml(requesterName)} submitted a request needing review.`,
    `
    ${Section(`
      ${detailRow("Title", escapeHtml(title))}
      ${amount ? detailRow("Amount", escapeHtml(amount)) : ""}
      ${department ? detailRow("Department", escapeHtml(department)) : ""}
    `)}
    ${Button("Review Requisition", `${APP_URL}/dashboard/requisitions`)}
    `
  )

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `New requisition: ${title} - ECWA Goodnews 1 Masaka`,
    html,
  })
}

export async function sendRequisitionStatusEmail({
  email,
  name,
  title,
  status,
  actorName,
  rejectionReason,
  amount,
}: {
  email: string
  name: string
  title: string
  status: "APPROVED" | "REJECTED" | "PAID" | "COMPLETED"
  actorName?: string
  rejectionReason?: string
  amount?: string
}) {
  const headline: Record<string, string> = {
    APPROVED: "Requisition Approved",
    REJECTED: "Requisition Rejected",
    PAID: "Requisition Paid",
    COMPLETED: "Requisition Completed",
  }

  const intro: Record<string, string> = {
    APPROVED: `Good news ${escapeHtml(name)} — your request has been approved${actorName ? ` by ${escapeHtml(actorName)}` : ""}.`,
    REJECTED: `Hello ${escapeHtml(name)} — your request was not approved. See the reason below and resubmit if needed.`,
    PAID: `Hello ${escapeHtml(name)} — payment has been released for your request${actorName ? ` by ${escapeHtml(actorName)}` : ""}.`,
    COMPLETED: `Hello ${escapeHtml(name)} — your request is now complete. Thank you.`,
  }

  const reasonCard =
    status === "REJECTED" && rejectionReason
      ? Card(`
        <strong style="color:#92400e;">Reason given</strong>
        <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:#78350f;">
          ${escapeHtml(rejectionReason)}
        </p>
      `)
      : ""

  const html = shell(
    headline[status],
    intro[status],
    `
    ${Section(`
      ${detailRow("Title", escapeHtml(title))}
      ${amount ? detailRow("Amount", escapeHtml(amount)) : ""}
      ${detailRow("Status", status)}
    `)}
    ${reasonCard}
    ${Button("View Requisition", `${APP_URL}/dashboard/requisitions`)}
    `
  )

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${headline[status]}: ${title} - ECWA Goodnews 1 Masaka`,
    html,
  })
}
