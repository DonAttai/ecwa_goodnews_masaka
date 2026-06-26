"use client"

import { CldUploadWidget } from "next-cloudinary"
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
  return (
    <div className="flex flex-col items-center gap-4">
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
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary-sign"
          options={{
            maxFiles: 1,
            maxFileSize: 5242880, // 5MB
            sources: ["local", "camera", "url"],
            cropping: true,
            croppingAspectRatio: 1,
            folder: "members",
          }}
          onSuccess={(result: any) => {
            const url = result?.info?.secure_url
            if (url) {
              onUpload(url)
              toast.success("Upload successful")
            } else {
              toast.error("No image URL returned")
            }
          }}
          onError={(error: any) => {
            console.error("Upload error:", error)
            toast.error("Upload failed. Please try again.")
          }}
        >
          {({ open, isLoading }) => (
            <Button
              type="button"
              variant="outline"
              className="min-w-40"
              disabled={isLoading}
              onClick={() => open()}
            >
              {isLoading ? (
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
