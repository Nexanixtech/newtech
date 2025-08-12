"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader" // Import GLTFLoader

interface Dynamic3DViewerProps {
  modelUrl?: string
  images?: string[]
  alt: string
  width?: number
  height?: number
  autoRotate?: boolean
  className?: string
}

export default function Dynamic3DViewer({
  modelUrl,
  images = [],
  alt,
  width = 400,
  height = 400,
  autoRotate = false,
  className = "",
}: Dynamic3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const controlsRef = useRef<OrbitControls>()
  const modelRef = useRef<THREE.Mesh | THREE.Group>() // Model can be Mesh or Group for GLTF
  const animationIdRef = useRef<number>()

  const [isLoading, setIsLoading] = useState(true) // True initially for model loading
  const [progress, setProgress] = useState(0) // New state for loading progress
  const [error, setError] = useState<string | null>(null)
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate)
  const [viewMode, setViewMode] = useState<"perspective" | "top" | "bottom" | "front" | "back" | "left" | "right">(
    "perspective",
  )

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!mountRef.current) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf8f9fa)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(5, 5, 5)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const pointLight1 = new THREE.PointLight(0xffffff, 0.4, 100)
    pointLight1.position.set(-10, 10, -10)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xffffff, 0.4, 100)
    pointLight2.position.set(10, -10, 10)
    scene.add(pointLight2)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.enablePan = true
    controls.enableRotate = true
    controls.autoRotate = isAutoRotating
    controls.autoRotateSpeed = 2.0
    controls.minDistance = 2
    controls.maxDistance = 50
    controlsRef.current = controls

    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xcccccc)
    gridHelper.material.opacity = 0.3
    gridHelper.material.transparent = true
    scene.add(gridHelper)

    // Axes helper
    const axesHelper = new THREE.AxesHelper(2)
    scene.add(axesHelper)

    // Clear existing canvas if any
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild)
    }
    mountRef.current.appendChild(renderer.domElement)
  }, [width, height, isAutoRotating])

  // Load 3D model or create from images
  const loadModel = useCallback(async () => {
    if (!sceneRef.current) return

    setIsLoading(true) // Start loading indicator for model
    setProgress(0) // Reset progress
    setError(null)

    // Function to remove previous model
    const removeCurrentModel = () => {
      if (modelRef.current) {
        sceneRef.current?.remove(modelRef.current)
        modelRef.current.traverse((object: any) => {
          if (object.isMesh) {
            object.geometry.dispose()
            if (Array.isArray(object.material)) {
              object.material.forEach((material: any) => material.dispose())
            } else if (object.material) {
              object.material.dispose()
            }
          }
        })
        modelRef.current = undefined
      }
    }

    const createModelFromImages = () => {
      try {
        // Create a cube with image textures
        const geometry = new THREE.BoxGeometry(2, 2, 2)
        const materials: THREE.MeshPhongMaterial[] = []

        // Load textures from images
        const textureLoader = new THREE.TextureLoader()

        for (let i = 0; i < 6; i++) {
          const imageUrl = images[i % images.length] || "/placeholder.svg?height=256&width=256&text=Robot+View"
          const texture = textureLoader.load(imageUrl)
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping

          const material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 30,
          })
          materials.push(material)
        }

        const mesh = new THREE.Mesh(geometry, materials)
        mesh.castShadow = true
        mesh.receiveShadow = true

        removeCurrentModel() // Remove previous model
        sceneRef.current?.add(mesh)
        modelRef.current = mesh

        setIsLoading(false) // Model loaded
        setProgress(100) // Set progress to 100%
      } catch (err) {
        console.error("Error creating model from images:", err)
        setError("Failed to create 3D model from images. Check image URLs.")
        setIsLoading(false) // Stop loading indicator on error
        setProgress(0) // Reset progress on error
      }
    }

    if (modelUrl) {
      const extension = modelUrl.split(".").pop()?.toLowerCase()

      if (extension === "stl") {
        const loader = new STLLoader()
        loader.load(
          modelUrl,
          (geometry: THREE.BufferGeometry) => {
            const material = new THREE.MeshPhongMaterial({
              color: 0x4285f4,
              shininess: 100,
              specular: 0x222222,
            })

            const mesh = new THREE.Mesh(geometry, material)
            mesh.castShadow = true
            mesh.receiveShadow = true

            // Center and scale the model
            const box = new THREE.Box3().setFromObject(mesh)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 3 / maxDim

            mesh.position.sub(center)
            mesh.scale.setScalar(scale)

            removeCurrentModel() // Remove previous model
            sceneRef.current?.add(mesh)
            modelRef.current = mesh
            setIsLoading(false) // Model loaded
            setProgress(100) // Set progress to 100%
          },
          (xhr) => {
            // onProgress callback
            if (xhr.lengthComputable) {
              const currentProgress = (xhr.loaded / xhr.total) * 100
              setProgress(Math.round(currentProgress))
            }
          },
          (error: any) => {
            console.error("Error loading STL:", error)
            setError(`Failed to load STL model from ${modelUrl}. Falling back to image-based model.`)
            createModelFromImages() // Fallback
          },
        )
      } else if (extension === "glb" || extension === "gltf") {
        const loader = new GLTFLoader()
        loader.load(
          modelUrl,
          (gltf) => {
            const model = gltf.scene
            model.traverse((object: any) => {
              if (object.isMesh) {
                object.castShadow = true
                object.receiveShadow = true
              }
            })

            // Center and scale the model
            const box = new THREE.Box3().setFromObject(model)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 3 / maxDim

            model.position.sub(center)
            model.scale.setScalar(scale)

            removeCurrentModel() // Remove previous model
            sceneRef.current?.add(model)
            modelRef.current = model
            setIsLoading(false) // Model loaded
            setProgress(100) // Set progress to 100%
          },
          (xhr) => {
            // onProgress callback
            if (xhr.lengthComputable) {
              const currentProgress = (xhr.loaded / xhr.total) * 100
              setProgress(Math.round(currentProgress))
            }
          },
          (error: any) => {
            console.error("Error loading GLTF/GLB:", error)
            setError(`Failed to load GLTF/GLB model from ${modelUrl}. Falling back to image-based model.`)
            createModelFromImages() // Fallback
          },
        )
      } else {
        setError(`Unsupported 3D model format: .${extension}. Falling back to image-based model.`)
        createModelFromImages() // Fallback for unsupported format
      }
    } else {
      createModelFromImages() // If no modelUrl provided
    }
  }, [modelUrl, images])

  // Animation loop
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return

    if (controlsRef.current) {
      controlsRef.current.update()
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current)
    animationIdRef.current = requestAnimationFrame(animate)
  }, [])

  // Set camera view
  const setCameraView = useCallback((view: typeof viewMode) => {
    if (!cameraRef.current || !controlsRef.current) return

    const distance = 8
    const positions = {
      perspective: { x: 5, y: 5, z: 5 },
      top: { x: 0, y: distance, z: 0 },
      bottom: { x: 0, y: -distance, z: 0 },
      front: { x: 0, y: 0, z: distance },
      back: { x: 0, y: 0, z: -distance },
      left: { x: -distance, y: 0, z: 0 },
      right: { x: distance, y: 0, z: 0 },
    }

    const pos = positions[view]
    cameraRef.current.position.set(pos.x, pos.y, pos.z)
    controlsRef.current.target.set(0, 0, 0)
    controlsRef.current.update()
    setViewMode(view)
  }, [])

  // Toggle auto rotation
  const toggleAutoRotate = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !isAutoRotating
      setIsAutoRotating(!isAutoRotating)
    }
  }, [isAutoRotating])

  // Reset view
  const resetView = useCallback(() => {
    setCameraView("perspective")
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [setCameraView])

  // Flip model
  const flipModel = useCallback((axis: "x" | "y" | "z") => {
    if (!modelRef.current) return

    switch (axis) {
      case "x":
        modelRef.current.rotation.x += Math.PI
        break
      case "y":
        modelRef.current.rotation.y += Math.PI
        break
      case "z":
        modelRef.current.rotation.z += Math.PI
        break
    }
  }, [])

  // Change model color
  const changeModelColor = useCallback((color: string) => {
    if (!modelRef.current) return

    modelRef.current.traverse((object: any) => {
      if (object.isMesh) {
        const material = object.material
        if (Array.isArray(material)) {
          material.forEach((mat: THREE.Material) => {
            if (mat instanceof THREE.MeshPhongMaterial) {
              mat.color.setHex(Number.parseInt(color.replace("#", "0x")))
            }
          })
        } else if (material instanceof THREE.MeshPhongMaterial) {
          material.color.setHex(Number.parseInt(color.replace("#", "0x")))
        }
      }
    })
  }, [])

  // Initialize scene and start animation loop on component mount
  useEffect(() => {
    initScene()
    animate()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (rendererRef.current && mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [initScene, animate])

  // Load model when component mounts or modelUrl/images change
  useEffect(() => {
    loadModel()
  }, [modelUrl, images, loadModel])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [width, height])

  // Display error state
  if (error) {
    return (
      <div className={`dynamic-3d-viewer ${className}`} style={{ width, height }}>
        <div className="error-container">
          <p>⚠️ {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
        <style jsx>{`
          .error-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            border-radius: 12px;
            border: 2px solid #e1e5e9;
            color: #666;
            text-align: center;
          }
          .error-container button {
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }

  // Display loading state for model
  if (isLoading) {
    return (
      <div className={`dynamic-3d-viewer ${className}`} style={{ width, height }}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading 3D model... {progress > 0 ? `${progress}%` : ""}</p>
          {progress === 0 && (
            <p className="loading-subtext">This may take a moment depending on model size and network speed.</p>
          )}
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <style jsx>{`
          .dynamic-3d-viewer {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .loading-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            border-radius: 12px;
            border: 2px solid #e1e5e9;
            gap: 1rem; /* Increased gap for better spacing */
          }
          .loading-spinner {
            width: 60px; /* Larger spinner */
            height: 60px; /* Larger spinner */
            border: 6px solid #e1e5e9; /* Thicker border */
            border-top: 6px solid #4285f4; /* Thicker border */
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          .loading-text {
            font-size: 1.2rem; /* Larger text */
            font-weight: 600;
            color: #333;
          }
          .loading-subtext {
            font-size: 0.9rem;
            color: #666;
            text-align: center;
            max-width: 80%;
          }
          .progress-bar-container {
            width: 80%;
            height: 8px;
            background-color: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 1rem;
          }
          .progress-bar {
            height: 100%;
            background-color: #4285f4;
            transition: width 0.1s ease-out;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className={`dynamic-3d-viewer ${className}`} style={{ width, height }}>
      <div className="viewer-container" style={{ width: "100%", height: "100%", position: "relative" }}>
        <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

        {/* Advanced Controls */}
        <div className="controls-panel">
          {/* View Controls */}
          <div className="control-group">
            <label>Views:</label>
            <div className="view-buttons">
              <button
                className={viewMode === "perspective" ? "active" : ""}
                onClick={() => setCameraView("perspective")}
                title="Perspective View"
              >
                3D
              </button>
              <button
                className={viewMode === "top" ? "active" : ""}
                onClick={() => setCameraView("top")}
                title="Top View"
              >
                Top
              </button>
              <button
                className={viewMode === "bottom" ? "active" : ""}
                onClick={() => setCameraView("bottom")}
                title="Bottom View"
              >
                Bot
              </button>
              <button
                className={viewMode === "front" ? "active" : ""}
                onClick={() => setCameraView("front")}
                title="Front View"
              >
                Front
              </button>
              <button
                className={viewMode === "back" ? "active" : ""}
                onClick={() => setCameraView("back")}
                title="Back View"
              >
                Back
              </button>
              <button
                className={viewMode === "left" ? "active" : ""}
                onClick={() => setCameraView("left")}
                title="Left View"
              >
                Left
              </button>
              <button
                className={viewMode === "right" ? "active" : ""}
                onClick={() => setCameraView("right")}
                title="Right View"
              >
                Right
              </button>
            </div>
          </div>

          {/* Flip Controls */}
          <div className="control-group">
            <label>Flip:</label>
            <div className="flip-buttons">
              <button onClick={() => flipModel("x")} title="Flip X-axis">
                ↕️ X
              </button>
              <button onClick={() => flipModel("y")} title="Flip Y-axis">
                ↔️ Y
              </button>
              <button onClick={() => flipModel("z")} title="Flip Z-axis">
                🔄 Z
              </button>
            </div>
          </div>

          {/* Color Controls */}
          <div className="control-group">
            <label>Color:</label>
            <div className="color-buttons">
              <button className="color-btn blue" onClick={() => changeModelColor("#4285f4")} title="Blue"></button>
              <button className="color-btn red" onClick={() => changeModelColor("#ea4335")} title="Red"></button>
              <button className="color-btn green" onClick={() => changeModelColor("#34a853")} title="Green"></button>
              <button className="color-btn orange" onClick={() => changeModelColor("#fbbc04")} title="Orange"></button>
              <button className="color-btn purple" onClick={() => changeModelColor("#9c27b0")} title="Purple"></button>
            </div>
          </div>

          {/* Action Controls */}
          <div className="control-group">
            <label>Actions:</label>
            <div className="action-buttons">
              <button
                className={isAutoRotating ? "active" : ""}
                onClick={toggleAutoRotate}
                title="Toggle Auto Rotation"
              >
                🔄 Auto
              </button>
              <button onClick={resetView} title="Reset View">
                🏠 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions-overlay">
          <div className="instruction-item">
            <strong>Rotate:</strong> Left click + drag
          </div>
          <div className="instruction-item">
            <strong>Zoom:</strong> Mouse wheel
          </div>
          <div className="instruction-item">
            <strong>Pan:</strong> Right click + drag
          </div>
        </div>
      </div>

      <style jsx>{`
        .dynamic-3d-viewer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          border: 2px solid #e1e5e9;
        }

        .viewer-container {
          position: relative;
          background: #f8f9fa;
        }

        .controls-panel {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
          font-size: 12px;
          z-index: 10;
          max-width: 200px;
        }

        .control-group {
          margin-bottom: 12px;
        }

        .control-group:last-child {
          margin-bottom: 0;
        }

        .control-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
          color: #fff;
        }

        .view-buttons,
        .flip-buttons,
        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .view-buttons button,
        .flip-buttons button,
        .action-buttons button {
          background: rgba(255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
          transition: all 0.2s ease;
        }

        .view-buttons button:hover,
        .flip-buttons button:hover,
        .action-buttons button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .view-buttons button.active,
        .action-buttons button.active {
          background: #4285f4;
          border-color: #4285f4;
        }

        .color-buttons {
          display: flex;
          gap: 4px;
        }

        .color-btn {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .color-btn:hover {
          transform: scale(1.1);
          border-color: white;
        }

        .color-btn.blue {
          background: #4285f4;
        }
        .color-btn.red {
          background: #ea4335;
        }
        .color-btn.green {
          background: #34a853;
        }
        .color-btn.orange {
          background: #fbbc04;
        }
        .color-btn.purple {
          background: #9c27b0;
        }

        .instructions-overlay {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
          font-size: 11px;
          z-index: 10;
        }

        .instruction-item {
          margin-bottom: 4px;
        }

        .instruction-item:last-child {
          margin-bottom: 0;
        }

        .instruction-item strong {
          color: #4285f4;
        }

        @media (max-width: 768px) {
          .controls-panel {
            position: relative;
            top: 0;
            left: 0;
            margin-bottom: 1rem;
            max-width: 100%;
          }

          .instructions-overlay {
            position: relative;
            bottom: 0;
            right: 0;
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
