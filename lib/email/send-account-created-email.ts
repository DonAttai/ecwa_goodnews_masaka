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

interface Props {
  email: string
  name: string
  setupLink: string
}

export async function sendAccountCreatedEmail({
  email,
  name,
  setupLink,
}: Props) {
  const safeName = escapeHtml(name)

  const html = Container(`
    ${Header("ECWA Goodnews 1 Masaka")}

    ${Hero(
      "Your Account is Ready 🎉",
      `Hello ${safeName}, an account has been created for you in our system.`
    )}

    ${Section(`
      <p style="
        font-size:15px;
        line-height:1.7;
        color:${colors.text};
        margin:0;
      ">
        To complete your setup, you need to create a secure password for your account.
        This ensures your information remains safe and accessible only to you.
      </p>
    `)}

    ${Button("Create Password", setupLink)}

    ${Card(`
      <strong style="color:#92400e;">⏳ Important Notice</strong>
      <p style="
        margin:10px 0 0;
        font-size:14px;
        line-height:1.6;
        color:#78350f;
      ">
        This setup link will expire in <strong>24 hours</strong>.
        If it expires, you will need to request a new one from the church admin.
      </p>
    `)}

    ${Divider()}

    ${Section(`
      <p style="
        font-size:13px;
        color:${colors.muted};
        margin:0;
        line-height:1.6;
      ">
        If you did not expect this email, please ignore it or contact the church administration.
      </p>
    `)}

    ${Footer(new Date().getFullYear())}
  `)

  await resend.emails.send({
    from: `ECWA Goodnews 1 Masaka <no-reply@ecwagoodnews1masaka.com.ng>`,
    to: email,
    subject: "Complete Your Account Setup - ECWA Goodnews 1 Masaka",
    html,
  })
}
