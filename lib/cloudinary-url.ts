const FACE_THUMB_BASE = "c_thumb,g_face,z_0.8"

/**
 * Re-frames a Cloudinary delivery URL as a face-aware square thumbnail.
 *
 * `g_face` centers on the detected face and `z_0.8` zooms out slightly, so
 * tight crops gain headroom instead of gluing the head to the frame edge.
 * Non-Cloudinary URLs (and anything unexpected) pass through untouched;
 * if no face is detected Cloudinary falls back to a center crop.
 * Stored URLs are never mutated — the transform applies at delivery time.
 */
export function toFaceThumb(
  url: string | null | undefined,
  size = 256
): string | null | undefined {
  if (!url) return url
  if (!url.includes("res.cloudinary.com")) return url
  const marker = "/image/upload/"
  if (!url.includes(marker)) return url
  const [head, ...rest] = url.split(marker)
  const tail = rest.join(marker)
  if (tail.startsWith("c_thumb,g_face")) return url
  return `${head}${marker}${FACE_THUMB_BASE},w_${size},h_${size}/${tail}`
}
