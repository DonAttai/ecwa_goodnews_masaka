"use client"

import { useEffect, useState } from "react"

type Fellowship = { id: string; name: string }

export const useFellowships = () => {
  const [items, setItems] = useState<Fellowship[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch("/api/fellowships")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setItems((data && data.items) || data || [])
      })
      .catch(() => {
        if (!mounted) return
        setItems([])
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  return { items, loading }
}

export default useFellowships
