"use client"

import { CldUploadWidget } from "next-cloudinary"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"

interface SiteImageFieldProps {
  name: string
  label: string
  value: string
  onChange: (url: string) => void
  folder: string
  hint?: string
  /** Use circular preview (e.g. pastor portrait). Defaults to 16:9 banner. */
  circle?: boolean
  /** Enable Cloudinary cropping UI. */
  cropping?: boolean
  croppingAspectRatio?: number
}

export default function SiteImageField({
  name,
  label,
  value,
  onChange,
  folder,
  hint,
  circle = false,
  cropping = false,
  croppingAspectRatio,
}: SiteImageFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {/* Hidden input keeps existing FormData server actions working. */}
      <input type="hidden" name={name} value={value} />
      {value ? (
        <div className="flex items-center gap-3">
          <img
            src={value}
            alt={label}
            className={
              circle
                ? "h-20 w-20 rounded-full border border-border object-cover"
                : "h-20 w-32 rounded-xl border border-border object-cover"
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => onChange("")}
          >
            <X className="mr-1 h-4 w-4" /> Remove
          </Button>
        </div>
      ) : (
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary-sign"
          options={{
            maxFiles: 1,
            maxFileSize: 5242880, // 5MB, matches lib/cloudinary.ts
            sources: ["local", "camera", "url"],
            folder,
            cropping,
            ...(croppingAspectRatio
              ? { croppingAspectRatio }
              : {}),
          }}
          onSuccess={({ info }) => {
            const url =
              typeof info === "string" ? undefined : info?.secure_url
            if (url) {
              onChange(url)
              toast.success("Photo uploaded")
            } else {
              toast.error("No image URL returned")
            }
          }}
          onError={() => toast.error("Upload failed. Please try again.")}
        >
          {({ open, isLoading }) => (
            <Button
              type="button"
              variant="outline"
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
                  <Upload className="mr-2 h-4 w-4" /> Upload photo
                </>
              )}
            </Button>
          )}
        </CldUploadWidget>
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Or paste a URL manually
        </summary>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/..."
          className="mt-1"
        />
      </details>
    </div>
  )
}
