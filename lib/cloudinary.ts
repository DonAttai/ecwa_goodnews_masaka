import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  // NOTE: cloud_name/api_key use NEXT_PUBLIC_ vars to match
  // app/api/cloudinary-sign/route.ts + .env.example. Secret stays server-only.
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ?? process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const ALLOWED_UPLOAD_FOLDERS = [
  "members",
  "events",
  "sermons",
  "gallery",
  "receipts",
  "requisitions",
] as const

export type AllowedUploadFolder = (typeof ALLOWED_UPLOAD_FOLDERS)[number]

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
])

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export function isAllowedUploadFolder(folder: string): boolean {
  const topLevel = folder.split("/")[0]
  return (ALLOWED_UPLOAD_FOLDERS as readonly string[]).includes(topLevel)
}

export function validateUploadFile(file: File, folder: string): string | null {
  if (!isAllowedUploadFolder(folder)) return "Folder not allowed"
  if (
    file.type &&
    file.size > 0 &&
    !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())
  ) {
    return "Unsupported file type. Use JPG, PNG, WEBP, or PDF."
  }
  if (file.size > MAX_UPLOAD_BYTES) return "File too large. Max 5MB."
  return null
}

export async function uploadToCloudinary(
  file: File,
  folder: string = "members"
): Promise<string> {
  const validationError = validateUploadFile(file, folder)
  if (validationError) throw new Error(validationError)

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"))
          return
        }
        resolve(result.secure_url)
      })
      .end(buffer)
  })
}
