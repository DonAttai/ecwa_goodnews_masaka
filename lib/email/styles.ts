// email/styles.ts

export const colors = {
  primary: "#2563eb",
  text: "#1f2937",
  muted: "#6b7280",
  border: "#e5e7eb",
  warningBg: "#fff9e6",
  warningBorder: "#facc15",
  bg: "#f9fafb",
}

export const layout = {
  container: `
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 10px;
    overflow: hidden;
  `,
}

export const text = {
  base: `
    font-size: 16px;
    line-height: 1.7;
    color: ${colors.text};
  `,
  small: `
    font-size: 13px;
    color: ${colors.muted};
  `,
  heading: `
    font-size: 20px;
    font-weight: 600;
    color: ${colors.primary};
  `,
}
