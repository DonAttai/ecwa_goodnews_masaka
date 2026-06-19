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
} from "./components"
import { colors } from "./styles"

interface MemberCreationProps {
  email: string
  name: string
}

export async function sendMemberCreationEmail({
  email,
  name,
}: MemberCreationProps) {
  const safeName = escapeHtml(name)

  const html = Container(`
    ${Header("ECWA Goodnews 1 Masaka")}

    ${Hero(
      "Membership Successfully Created 🎉",
      `Dear ${safeName}, your membership record has been successfully added to our church database.`
    )}

    ${Divider()}

    ${Card(`
      <strong style="color:#92400e;">📋 Important Information</strong>
      <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:#78350f;">
        If any of your details (phone, address, etc.) need correction,
        kindly contact the church secretariat for updates.
      </p>
    `)}

    ${Section(`
      <h3 style="margin:0 0 10px;color:${colors.primary};font-size:16px;">
        Contact Person
      </h3>
      <p style="margin:0;font-size:14px;">
        <strong>Elder Jonathan Bulus:</strong> 08036274863
      </p>
    `)}

    ${Divider()}

    ${Footer(new Date().getFullYear())}
  `)

  await resend.emails.send({
    from: `ECWA Goodnews 1 Masaka <no-reply@ecwagoodnews1masaka.com.ng>`,
    to: email,
    subject: "Membership Confirmation - ECWA Goodnews 1 Masaka",
    html,
  })
}
