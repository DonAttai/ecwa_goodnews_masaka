"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

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
  const widgetRef = useRef<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isReady, setIsReady] = useState(false)

  /**
   * 1. Initialize widget ONCE on mount
   */
  useEffect(() => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    if (!cloudName) {
      toast.error("Cloudinary is not configured")
      return
    }

    // Ensure Cloudinary script exists
    if (!(window as any).cloudinary) {
      toast.error("Cloudinary SDK not loaded")
      return
    }

    widgetRef.current = (window as any).cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        maxFiles: 1,
        maxFileSize: 5_242_880,
        sources: ["local", "camera", "url"],
        cropping: true,
        croppingAspectRatio: 1,
        folder: "members",
      },
      (error: any, result: any) => {
        if (error) {
          setIsUploading(false)
          console.error(error)
          toast.error("Upload failed")
          return
        }

        if (result?.event === "upload-added") {
          setIsUploading(true)
        }

        if (result?.event === "success") {
          setIsUploading(false)

          const url = result?.info?.secure_url

          if (!url) {
            toast.error("No image URL returned")
            return
          }

          onUpload(url)
          toast.success("Upload successful")
        }
      }
    )

    setIsReady(true)

    // cleanup (optional but good practice)
    return () => {
      widgetRef.current = null
    }
  }, [onUpload])

  /**
   * 2. Safe open handler
   */
  const handleOpen = () => {
    if (!widgetRef.current) {
      toast.error("Upload widget is not ready yet")
      return
    }

    try {
      widgetRef.current.open()
    } catch (err) {
      console.error("Widget open error:", err)
      toast.error("Could not open upload widget")
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <Upload className="mx-auto h-8 w-8 text-primary/60" />
        <h4 className="mt-2 font-semibold">Passport Photograph</h4>
        <p className="text-sm text-muted-foreground">
          Upload a recent passport photograph (Max 5MB)
        </p>
      </div>

      {/* Preview */}
      {currentImage ? (
        <div className="relative">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary/20">
            <Image
              src={currentImage}
              alt="Passport"
              fill
              className="object-cover"
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
        <Button
          type="button"
          variant="outline"
          className="min-w-[160px]"
          disabled={!isReady || isUploading}
          onClick={handleOpen}
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
    </div>
  )
}
