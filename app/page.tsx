"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import WhatsAppFloat from "@/components/WhatsAppFloat"
import Footer from "@/components/Footer"
import VideoShowcase from "@/components/VideoShowcase"
import { getLogos, getProducts, getCategories } from "@/lib/database"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [logos, setLogos] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    const loadedLogos = getLogos()
    const loadedProducts = getProducts()
    const loadedCategories = getCategories()

    setLogos(loadedLogos)
    setProducts(loadedProducts)
    setCategories(loadedCategories)

    return () => clearTimeout(timer)
  }, [])

  // Helper function to get products for a category
  const getProductsForCategory = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName)
    if (!category) return []
    return products.filter((product) => product.category_id === category.id)
  }

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <style jsx>{`
          .loader-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
          .loader {
            width: 50px;
            height: 50px;
            border: 5px solid #e0e0e0;
            border-top: 5px solid #6B46C1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="homepage">
      {/* Reception Robot Hero Section */}
      <section className="reception-robot-hero">
        <div className="reception-hero-container">
          <div className="reception-hero-content">
            <h1 className="reception-title">Reception Robot</h1>
            <h2 className="reception-subtitle">Customer Service Robots</h2>
            <div className="reception-robot-image-container">
              <Image
                src="/placeholder.svg?height=450&width=300&text=Reception+Robot"
                alt="Reception Robot"
                width={300}
                height={450}
                className="reception-robot-image"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* STEM Lab Section */}
      <section className="stem-lab-section">
        <div className="stem-lab-container">
          <Image
            src="/placeholder.svg?height=600&width=1200&text=STEM+Lab"
            alt="STEM Lab"
            width={1200}
            height={600}
            className="stem-lab-image"
          />
        </div>
      </section>

      {/* Humanoid Robot Section */}
      <section className="humanoid-robot-section">
        <div className="humanoid-container">
          <div className="humanoid-content">
            <h1 className="humanoid-title">Humanoid</h1>
            <h2 className="humanoid-subtitle">Robot</h2>
            <div className="humanoid-robot-image-container">
              <Image
                src="/placeholder.svg?height=700&width=500&text=Humanoid+Robot"
                alt="Humanoid Robot"
                width={500}
                height={700}
                className="humanoid-robot-image"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Video Section */}
      <section className="manufacturing-section">
        <div className="manufacturing-container">
          <div className="manufacturing-content">
            <div className="video-wrapper">
              <video className="manufacturing-video" autoPlay loop muted playsInline preload="auto">
                <source src="/o6qmdckizgluuk4s9hyq.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="manufacturing-label">
                <span>OUR MANUFACTURING</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Layout - Now Dynamic */}
      <section className="main-grid-section">
        <div className="main-grid">
          {/* Delivery Robots Card */}
          <Link href="/category?name=Delivery Robots" className="grid-card-link">
            <div className="grid-card delivery-card">
              <div className="card-content">
                {(() => {
                  const deliveryProducts = getProductsForCategory("Delivery Robots")
                  const firstProduct = deliveryProducts[0]
                  return firstProduct ? (
                    <div className="delivery-robot-image">
                      <Image
                        src={firstProduct.main_image || "/placeholder.svg?height=150&width=150&text=Delivery+Robot"}
                        alt={firstProduct.title}
                        width={150}
                        height={150}
                        className="robot-image"
                      />
                    </div>
                  ) : (
                    <div className="delivery-robot-image">
                      <Image
                        src="/placeholder.svg?height=150&width=150&text=Delivery+Robot"
                        alt="Delivery Robot"
                        width={150}
                        height={150}
                        className="robot-image"
                      />
                    </div>
                  )
                })()}
                <div className="card-text">
                  <h3 className="card-title-delivery">Delivery</h3>
                  {(() => {
                    const deliveryProducts = getProductsForCategory("Delivery Robots")
                    return (
                      deliveryProducts.length > 0 && (
                        <p className="card-product-count">
                          {deliveryProducts.length} Product{deliveryProducts.length !== 1 ? "s" : ""}
                        </p>
                      )
                    )
                  })()}
                </div>
              </div>
            </div>
          </Link>

          {/* Drones Card */}
          <Link href="/category?name=Drones" className="grid-card-link">
            <div className="grid-card drones-card">
              <div className="card-content">
                <h3 className="card-title-drones">Drones</h3>
                {(() => {
                  const droneProducts = getProductsForCategory("Drones")
                  return (
                    droneProducts.length > 0 && (
                      <p className="card-product-count-drones">
                        {droneProducts.length} Product{droneProducts.length !== 1 ? "s" : ""}
                      </p>
                    )
                  )
                })()}
              </div>
              <div className="drones-background"></div>
            </div>
          </Link>

          {/* 3D Printed Parts Card */}
          <Link href="/category?name=3D Printed Parts" className="grid-card-link">
            <div className="grid-card printing-card">
              <div className="card-content">
                <h3 className="card-title-3d">3D Printed Parts</h3>
                {(() => {
                  const printingProducts = getProductsForCategory("3D Printed Parts")
                  return (
                    printingProducts.length > 0 && (
                      <p className="card-product-count-3d">
                        {printingProducts.length} Product{printingProducts.length !== 1 ? "s" : ""}
                      </p>
                    )
                  )
                })()}
              </div>
              <div className="printing-background"></div>
            </div>
          </Link>

          {/* Arm Robots Card */}
          <Link href="/category?name=Arm Robots" className="grid-card-link">
            <div className="grid-card arm-card">
              <div className="card-content">
                {(() => {
                  const armProducts = getProductsForCategory("Arm Robots")
                  const firstProduct = armProducts[0]
                  return firstProduct ? (
                    <div className="arm-robot-image">
                      <Image
                        src={firstProduct.main_image || "/placeholder.svg?height=120&width=120&text=Arm+Robot"}
                        alt={firstProduct.title}
                        width={120}
                        height={120}
                        className="robot-image-arm"
                      />
                    </div>
                  ) : (
                    <div className="arm-robot-image">
                      <Image
                        src="/placeholder.svg?height=120&width=120&text=Arm+Robot"
                        alt="Arm Robot"
                        width={120}
                        height={120}
                        className="robot-image-arm"
                      />
                    </div>
                  )
                })()}
                <div className="card-text">
                  <h3 className="card-title-arm">Arm Robots</h3>
                  {(() => {
                    const armProducts = getProductsForCategory("Arm Robots")
                    return (
                      armProducts.length > 0 && (
                        <p className="card-product-count-arm">
                          {armProducts.length} Product{armProducts.length !== 1 ? "s" : ""}
                        </p>
                      )
                    )
                  })()}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section className="youtube-section">
        <div className="youtube-container">
          <VideoShowcase />
        </div>
      </section>

      {/* Logo Slider Section */}
      <section className="logo-slider-section">
        <div className="container">
          <div className="logo-slider-container">
            <div className="logo-slider">
              {[...logos, ...logos].map((logo, index) => (
                <div key={`${logo.id}-${index}`} className="logo-slide">
                  <Image
                    src={logo.url || "/placeholder.svg?height=80&width=200&text=Client+Logo"}
                    alt={logo.name}
                    width={200}
                    height={80}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      filter: "grayscale(100%)",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />

      <style jsx>{`
        .homepage {
          min-height: 100vh;
          background: #f5f5f5;
        }

        /* Reception Robot Hero Section */
        .reception-robot-hero {
          width: 100%;
          min-height: 70vh;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
        }

        .reception-hero-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .reception-hero-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .reception-title {
          font-family: var(--font-oswald), sans-serif;
          font-size: 4rem;
          font-weight: 700;
          color: #8e44ad;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -1px;
        }

        .reception-subtitle {
          font-family: var(--font-oswald), sans-serif;
          font-size: 5rem;
          font-weight: 900;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.1;
          text-transform: uppercase;
          letter-spacing: -2px;
        }

        .reception-robot-image-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .reception-robot-image {
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }

        /* STEM Lab Section */
        .stem-lab-section {
          width: 100%;
          background: #f5f5f5;
          padding: 0;
        }

        .stem-lab-container {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .stem-lab-image {
          width: 100%;
          height: auto;
          max-width: 100%;
          object-fit: cover;
          display: block;
        }

        /* Humanoid Robot Section */
        .humanoid-robot-section {
          width: 100%;
          min-height: 100vh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          position: relative;
          overflow: hidden;
        }

        .humanoid-container {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem;
        }

        .humanoid-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
          z-index: 2;
        }

        .humanoid-title {
          font-family: var(--font-oswald), sans-serif;
          font-size: 5rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -2px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .humanoid-subtitle {
          font-family: var(--font-oswald), sans-serif;
          font-size: 6rem;
          font-weight: 900;
          color: #fff;
          margin: 0;
          line-height: 1.1;
          text-transform: uppercase;
          letter-spacing: -3px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .humanoid-robot-image-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .humanoid-robot-image {
          max-width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 10px 30px rgba(255,255,255,0.1));
        }

        /* Manufacturing Section */
        .manufacturing-section {
          width: 100%;
          background: #f5f5f5;
          padding: 3rem 0;
        }

        .manufacturing-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .manufacturing-content {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          max-width: 800px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          background: #000;
        }

        .manufacturing-video {
          width: 100%;
          height: auto;
          min-height: 400px;
          object-fit: cover;
          display: block;
        }

        .manufacturing-label {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          backdrop-filter: blur(10px);
        }

        /* Main Grid Section */
        .main-grid-section {
          width: 100%;
          background: #f5f5f5;
          padding: 2rem 0;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 300px 300px;
          gap: 1rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .grid-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .grid-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 12px;
          height: 100%;
        }

        .grid-card:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .card-content {
          position: relative;
          z-index: 2;
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        /* Delivery Card */
        .delivery-card {
          background: #fff;
        }

        .delivery-robot-image {
          margin-bottom: 1rem;
        }

        .robot-image {
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }

        .card-title-delivery {
          font-family: var(--font-oswald), sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #6B46C1;
          margin: 0;
          text-transform: uppercase;
        }

        .card-product-count {
          font-size: 0.9rem;
          color: #666;
          margin: 0.5rem 0 0 0;
          font-weight: 500;
        }

        /* Drones Card */
        .drones-card {
          position: relative;
          background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
        }

        .drones-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/placeholder.svg?height=300&width=300&text=Drones+BG');
          background-size: cover;
          background-position: center;
          opacity: 0.8;
        }

        .card-title-drones {
          font-family: var(--font-oswald), sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          text-transform: uppercase;
          position: relative;
          z-index: 3;
        }

        .card-product-count-drones {
          font-size: 0.9rem;
          color: #1a1a1a;
          margin: 0.5rem 0 0 0;
          font-weight: 600;
          position: relative;
          z-index: 3;
        }

        /* 3D Printing Card */
        .printing-card {
          position: relative;
          background: linear-gradient(45deg, #FF6B35 0%, #F7931E 100%);
        }

        .printing-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/placeholder.svg?height=300&width=300&text=3D+Printing+BG');
          background-size: cover;
          background-position: center;
          opacity: 0.8;
        }

        .card-title-3d {
          font-family: var(--font-oswald), sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin: 0;
          text-transform: uppercase;
          position: relative;
          z-index: 3;
        }

        .card-product-count-3d {
          font-size: 0.9rem;
          color: white;
          margin: 0.5rem 0 0 0;
          font-weight: 600;
          position: relative;
          z-index: 3;
        }

        /* Arm Robots Card */
        .arm-card {
          background: #1a1a1a;
        }

        .arm-robot-image {
          margin-bottom: 1rem;
        }

        .robot-image-arm {
          max-width: 100%;
          height: auto;
          object-fit: contain;
          filter: brightness(1.1);
        }

        .card-title-arm {
          font-family: var(--font-oswald), sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin: 0;
          text-transform: uppercase;
        }

        .card-product-count-arm {
          font-size: 0.9rem;
          color: #ccc;
          margin: 0.5rem 0 0 0;
          font-weight: 500;
        }

        /* YouTube Section */
        .youtube-section {
          padding: 3rem 0;
          background: #f5f5f5;
        }

        .youtube-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Logo Slider */
        .logo-slider-section {
          padding: 2rem 0;
          background: #f5f5f5;
          position: relative;
        }

        .logo-slider-section::before,
        .logo-slider-section::after {
          content: '';
          position: absolute;
          top: 0;
          width: 200px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .logo-slider-section::before {
          left: 0;
          background: linear-gradient(to right, #f5f5f5, transparent);
        }

        .logo-slider-section::after {
          right: 0;
          background: linear-gradient(to left, #f5f5f5, transparent);
        }

        .logo-slider-container {
          position: relative;
          overflow: hidden;
          padding: 1rem 0;
        }

        .logo-slider {
          display: flex;
          gap: 2rem;
          animation: slide 30s linear infinite;
          width: max-content;
        }

        .logo-slider:hover {
          animation-play-state: paused;
        }

        .logo-slide {
          flex: 0 0 auto;
          width: 200px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .logo-slide:hover {
          transform: translateY(-5px);
        }

        .logo-slide:hover img {
          filter: grayscale(0%) !important;
          transform: scale(1.05);
        }

        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .reception-title {
            font-size: 3rem;
          }
          .reception-subtitle {
            font-size: 4rem;
          }
          .humanoid-title {
            font-size: 4rem;
          }
          .humanoid-subtitle {
            font-size: 5rem;
          }
          .main-grid {
            grid-template-rows: 250px 250px;
          }
        }

        @media (max-width: 768px) {
          .reception-title {
            font-size: 2.5rem;
          }
          .reception-subtitle {
            font-size: 3rem;
          }
          .humanoid-title {
            font-size: 3rem;
          }
          .humanoid-subtitle {
            font-size: 4rem;
          }
          .main-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, 200px);
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .reception-title {
            font-size: 2rem;
          }
          .reception-subtitle {
            font-size: 2.5rem;
          }
          .humanoid-title {
            font-size: 2.5rem;
          }
          .humanoid-subtitle {
            font-size: 3rem;
          }
          .card-title-delivery,
          .card-title-drones,
          .card-title-3d,
          .card-title-arm {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
