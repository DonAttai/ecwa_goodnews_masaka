"use client"

import React, { useState } from "react"
import { useMemberForm } from "../MemberFormProvider"
import { useFormContext } from "react-hook-form"

const CloudinaryUploader: React.FC<{ onUploaded: (url: string) => void }> = ({
  onUploaded,
}) => {
  const [uploading, setUploading] = useState(false)

  const handle = async (f: File | null) => {
    if (!f) return
    setUploading(true)
    try {
      const timestamp = Math.floor(Date.now() / 1000)
      const paramsToSign = { timestamp }
      const sigResp = await fetch("/api/cloudinary-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paramsToSign }),
      }).then((r) => r.json())

      const signature = sigResp.signature
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const fd = new FormData()
      fd.append("file", f)
      fd.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "")
      fd.append("timestamp", String(timestamp))
      if (signature) fd.append("signature", signature)
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      const res = await fetch(url, { method: "POST", body: fd })
      const data = await res.json()
      if (data && data.secure_url) onUploaded(data.secure_url)
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handle(e.target.files?.[0] ?? null)}
      />
      {uploading && <div>Uploading...</div>}
    </div>
  )
}

export const PassportPhotoStep: React.FC = () => {
  const { form } = useMemberForm()
  const { setValue, watch } = form
  const passportUrl = watch("passportUrl")

  return (
    <div>
      <div className="mb-4">
        <CloudinaryUploader
          onUploaded={(url) => setValue("passportUrl", url)}
        />
      </div>
      {passportUrl && (
        <div>
          <img src={passportUrl} alt="passport" className="max-w-xs rounded" />
        </div>
      )}
    </div>
  )
}

export default PassportPhotoStep
