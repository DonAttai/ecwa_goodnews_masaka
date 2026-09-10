import * as bcrypt from "bcrypt"

// Local-only helper: hash a password for seeding an admin user.
// Usage: pnpm hash "your-password"
// Never commit real passwords or hashes. $0, no services required.
async function main() {
  const password = process.argv[2]
  if (!password) {
    console.error('Usage: pnpm hash "your-password"')
    process.exit(1)
  }
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  console.log(hash)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
