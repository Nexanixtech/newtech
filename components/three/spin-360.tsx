"use client"

import React from "react"

type Props = {
  images: string[]
  className?: string
  alt?: string
  autoplay?: boolean
  intervalMs?: number
}

export default function Spin360({
  images,
  className = "",
  alt = "360 product",
  autoplay = false,
  intervalMs = 80,
}: Props) {
  const [idx, setIdx] = React.useState(0)
  const dragging = React.useRef(false)
  const lastX = React.useRef(0)
  const imgCount = images?.length || 0

  React.useEffect(() => {
    if (!autoplay || imgCount === 0) return
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % imgCount)
    }, intervalMs)
    return () => clearInterval(id)
  }, [autoplay, intervalMs, imgCount])

  if (!images || images.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 ${className}`}>
        <span className="text-sm text-muted-foreground">No 360° images</span>
      </div>
    )
  }

  const onDown = (x: number) => {
    dragging.current = true
    lastX.current = x
  }
  const onMove = (x: number) => {
    if (!dragging.current) return
    const delta = x - lastX.current
    lastX.current = x
    const step = Math.sign(delta)
    if (step !== 0) {
      setIdx((i) => {
        const next = i + step
        if (next < 0) return imgCount - 1
        if (next >= imgCount) return 0
        return next
      })
    }
  }
  const onUp = () => {
    dragging.current = false
  }

  return (
    <div
      className={`select-none touch-none ${className}`}
      onMouseDown={(e) => onDown(e.clientX)}
      onMouseMove={(e) => onMove(e.clientX)}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={(e) => onDown(e.touches[0].clientX)}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
      onTouchEnd={onUp}
      role="img"
      aria-label={alt}
    >
      <img
        src={images[idx] || "/placeholder.svg"}
        alt={alt}
        className="h-full w-full object-contain bg-white"
        crossOrigin="anonymous"
      />
    </div>
  )
}
