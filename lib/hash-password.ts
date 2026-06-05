import * as bcrypt from "bcrypt"

async function getHashedPassword(password: string): Promise<string> {
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

getHashedPassword("attai123")
  .then((hash) => {
    console.log("Hashed password:", hash)
  })
  .catch((error) => {
    console.error("Error hashing password:", error)
  })
