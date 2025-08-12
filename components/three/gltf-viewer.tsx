"use client"

import React, { Suspense, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, useGLTF, Bounds, useBounds } from "@react-three/drei"

function FitToView() {
  const api = useBounds()
  React.useEffect(() => {
    api.refresh().fit()
  }, [api])
  return null
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url, true, true)
  const cloned = useMemo(() => scene.clone(), [scene])
  return <primitive object={cloned} />
}

export default function GLTFViewer({
  url,
  className = "",
  background = "#f8fafc",
}: {
  url: string
  className?: string
  background?: string
}) {
  if (!url) {
    return (
      <div
        className={`flex items-center justify-center bg-muted/30 text-muted-foreground ${className}`}
      >
        No 3D model
      </div>
    )
  }
  return (
    <div className={className} style={{ background }}>
      <Canvas dpr={[1, 2]}>
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#e5e7eb" />
            </mesh>
          }
        >
          <Bounds clip observe margin={1.2}>
            <Model url={url} />
            <FitToView />
          </Bounds>
          <Environment preset="city" />
          <OrbitControls enableDamping />
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 2]} intensity={0.6} />
        </Suspense>
      </Canvas>
    </div>
  )
}
