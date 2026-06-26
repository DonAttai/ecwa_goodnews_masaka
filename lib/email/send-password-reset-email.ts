// lib/email.ts

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

interface SendPasswordResetEmailProps {
  email: string
  name: string
  token: string
}

export async function sendPasswordResetEmail({
  email,
  name,
  token,
}: SendPasswordResetEmailProps) {
  const safeName = escapeHtml(name)
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  const html = Container(`
    ${Header("ECWA Goodnews 1 Masaka")}

    ${Hero(
      "Reset Your Password 🔒",
      `Hello ${safeName}, we received a request to reset your password.`
    )}

    ${Section(`
      <p style="
        font-size:15px;
        line-height:1.7;
        color:${colors.text};
        margin:0;
      ">
        You can create a new password for your account by clicking the button below.
        For security reasons, this link will expire in <strong>1 hour</strong>.
      </p>
    `)}

    ${Button("Reset Password", resetLink)}

    ${Card(`
      <strong style="color:#92400e;">⚠️ Security Notice</strong>
      <p style="
        margin:10px 0 0;
        font-size:14px;
        line-height:1.6;
        color:#78350f;
      ">
        If you didn't request this password reset, please ignore this email.
        Your account remains secure and no changes have been made.
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
        For security reasons, this link will expire in 1 hour.
        If you need to reset your password after this time, please request a new reset link.
      </p>
    `)}

    ${Footer(new Date().getFullYear())}
  `)

  await resend.emails.send({
    from: `ECWA Goodnews 1 Masaka <no-reply@ecwagoodnews1masaka.com.ng>`,
    to: email,
    subject: "Password Reset Request - ECWA Goodnews 1 Masaka",
    html,
  })
}
