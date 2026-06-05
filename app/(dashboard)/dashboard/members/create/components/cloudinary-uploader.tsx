"use client"

import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useState, useEffect } from "react"

interface CloudinaryUploaderProps {
  onUpload: (url: string) => void
  onRemove: () => void
  currentImage?: string | null
}

export function CloudinaryUploader({
  onUpload,
  onRemove,
  currentImage,
}: CloudinaryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isCloudinaryReady, setIsCloudinaryReady] = useState(true)

  useEffect(() => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    if (!cloudName) {
      console.error("Cloudinary cloud name is not configured")
      setIsCloudinaryReady(false)

      toast.error(
        "Upload service is not configured. Please contact administrator."
      )
    }
  }, [])

  if (!isCloudinaryReady) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border p-6">
        <Upload className="mx-auto h-8 w-8 text-destructive/60" />
        <h4 className="font-semibold">Upload Service Unavailable</h4>
        <p className="text-center text-sm text-muted-foreground">
          Please contact the administrator to configure the upload service.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="text-center">
        <Upload className="mx-auto h-8 w-8 text-primary/60" />
        <h4 className="mt-2 font-semibold">Passport Photograph</h4>
        <p className="text-sm text-muted-foreground">
          Upload a recent passport photograph (Max 5MB)
        </p>
      </div>

      {currentImage ? (
        <div className="relative">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary/20">
            <Image
              src={currentImage}
              alt="Passport preview"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary-sign"
          options={{
            maxFiles: 1,
            maxFileSize: 5_242_880, // 5MB
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
            sources: ["local", "camera", "url"],
            cropping: true,
            croppingAspectRatio: 1,
            folder: "members",
          }}
          onUploadAdded={() => {
            setIsUploading(true)
          }}
          onSuccess={(result: any) => {
            setIsUploading(false)

            const url = result?.info?.secure_url

            if (!url) {
              toast.error("Upload completed but no image URL was returned.")
              return
            }

            onUpload(url)
            toast.success("Passport uploaded successfully!")
          }}
          onError={(error) => {
            setIsUploading(false)

            console.error("Cloudinary upload error:", error)

            toast.error("Failed to upload image. Please try again.")
          }}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              className="min-w-[160px]"
              disabled={isUploading}
              onClick={() => {
                if (typeof open !== "function") {
                  toast.error(
                    "Upload widget is not ready yet. Please try again."
                  )
                  return
                }

                try {
                  open()
                } catch (error) {
                  console.error("Error opening upload widget:", error)

                  toast.error("Failed to open upload widget. Please try again.")
                }
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Photo
                </>
              )}
            </Button>
          )}
        </CldUploadWidget>
      )}
    </div>
  )
}
