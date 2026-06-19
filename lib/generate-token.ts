import crypto from "crypto"

export function generateUserToken() {
  return crypto.randomBytes(32).toString("hex")
}
