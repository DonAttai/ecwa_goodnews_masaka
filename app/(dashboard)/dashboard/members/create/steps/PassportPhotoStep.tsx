"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CloudinaryUploader } from "../components/cloudinary-uploader"

interface PassportPhotoStepProps {
  passportUrl: string | null
  onUpload: (url: string) => void
  onRemove: () => void
  isOptional?: boolean
}

export default function PassportPhotoStep({
  passportUrl,
  onUpload,
  onRemove,
  isOptional = false,
}: PassportPhotoStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">Passport Photograph</p>
            <p className="text-sm text-slate-600">
              {isOptional
                ? "Upload a recent passport photograph for the membership record (Optional)."
                : "Upload a recent passport photograph for the membership record."}
            </p>
          </div>
          {passportUrl ? (
            <Badge variant="secondary">Uploaded</Badge>
          ) : (
            <Badge variant={isOptional ? "outline" : "default"}>
              {isOptional ? "Optional" : "Required"}
            </Badge>
          )}
        </div>

        <div className="mt-5">
          <CloudinaryUploader onUpload={onUpload} onRemove={onRemove} />
        </div>

        {passportUrl && (
          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-slate-200 p-4">
            <img
              src={passportUrl}
              alt="Passport upload preview"
              className="max-h-48 w-full rounded object-cover"
            />
            <Button type="button" variant="destructive" onClick={onRemove}>
              Remove Photo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
