// email/components.ts
import { colors, layout } from "./styles"

export function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export function Container(content: string) {
  return `
    <div style="background:#f9fafb;padding:30px 10px;">
      <div style="${layout.container}">
        ${content}
      </div>
    </div>
  `
}

export function Header(title: string) {
  return `
    <div style="
      text-align:center;
      padding:30px 20px;
      background:${colors.primary};
      color:white;
    ">
      <h1 style="margin:0;font-size:22px;">
        ${title}
      </h1>
      <p style="margin:5px 0 0;font-size:13px;opacity:0.9;">
        Church Membership System
      </p>
    </div>
  `
}

export function Hero(title: string, subtitle: string) {
  return `
    <div style="padding:25px 25px 10px;">
      <h2 style="
        margin:0;
        font-size:18px;
        color:${colors.primary};
      ">
        ${title}
      </h2>
      <p style="
        margin:10px 0 0;
        font-size:15px;
        line-height:1.6;
        color:${colors.text};
      ">
        ${subtitle}
      </p>
    </div>
  `
}

export function Section(content: string) {
  return `
    <div style="padding:15px 25px;">
      ${content}
    </div>
  `
}

export function Card(content: string) {
  return `
    <div style="
      background:${colors.warningBg};
      border:1px solid ${colors.warningBorder};
      padding:18px;
      border-radius:10px;
      margin:15px 25px;
    ">
      ${content}
    </div>
  `
}

export function Divider() {
  return `
    <div style="height:1px;background:${colors.border};margin:20px 25px;"></div>
  `
}

export function Footer(year: number) {
  return `
    <div style="
      padding:25px;
      text-align:center;
      font-size:12px;
      color:${colors.muted};
    ">
      <p style="margin:0;font-weight:600;">
        ECWA Goodnews 1 Masaka
      </p>
      <p style="margin:5px 0;">JESUS IS LORD!</p>
      <p style="margin:10px 0 0;">
        © ${year} All rights reserved
      </p>
    </div>
  `
}

export function Button(label: string, href: string) {
  return `
    <div style="margin:25px 0;">
      <a href="${href}"
        style="
          background:${colors.primary};
          color:#ffffff;
          padding:12px 18px;
          text-decoration:none;
          border-radius:8px;
          display:inline-block;
          font-weight:600;
          font-size:14px;
        "
      >
        ${label}
      </a>
    </div>
  `
}
