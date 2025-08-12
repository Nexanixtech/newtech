"use client"

import type React from "react"
import { useRef, useEffect, useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import AnimatedCategoryIcon from "./AnimatedCategoryIcon"
import { getCategories, getProducts } from "@/lib/database"

interface SearchResult {
  id: string
  title: string
  subtitle: string
  image: string
  type: "product" | "category"
  categoryName?: string
}

interface NavbarProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  searchResults?: SearchResult[]
  showSearchResults?: boolean
  onSearchResultsChange?: (show: boolean) => void
  mobileSearchActive?: boolean
  onMobileSearchToggle?: (active: boolean) => void
}

export default function Navbar({
  searchQuery = "",
  onSearchChange = () => {},
  searchResults = [],
  showSearchResults = false,
  onSearchResultsChange = () => {},
  mobileSearchActive = false,
  onMobileSearchToggle = () => {},
}: NavbarProps) {
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery)
  const [internalSearchResults, setInternalSearchResults] = useState<SearchResult[]>([])
  const [internalShowResults, setInternalShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    setCategories(getCategories())
    setProducts(getProducts())
  }, [])

  const categoryIcons = useMemo(() => ([
    { id: "delivery", name: "DELIVERY", type: "delivery" as const, categoryName: "Delivery Robots" },
    { id: "drones", name: "DRONES", type: "drones" as const, categoryName: "Drones" },
    { id: "3d-printing", name: "3D PRINTED PARTS", type: "3d-printing" as const, categoryName: "3D Printed Parts" },
    { id: "reception", name: "RECEPTION ROBOT", type: "reception" as const, categoryName: "Reception Robots" },
    { id: "stem-lab", name: "STEM LAB", type: "stem-lab" as const, categoryName: "STEM Lab" },
    { id: "humanoid", name: "HUMANOID", type: "humanoid" as const, categoryName: "Humanoid Robots" },
    { id: "arm-robots", name: "ARM ROBOTS", type: "arm-robots" as const, categoryName: "Arm Robots" },
  ]), [])

  // Enhanced search function using dynamic data
  const performSearch = (query: string): SearchResult[] => {
    if (!query || query.length < 2) return []

    const searchTerm = query.toLowerCase().trim()
    const results: SearchResult[] = []

    // Products
    products.forEach((product) => {
      const titleMatch = product.title?.toLowerCase().includes(searchTerm)
      const subtitleMatch = product.subtitle?.toLowerCase().includes(searchTerm)
      const cat = categories.find((c) => c.id === product.category_id)
      const categoryMatch = cat?.name?.toLowerCase().includes(searchTerm)
      if (titleMatch || subtitleMatch || categoryMatch) {
        results.push({
          id: product.id.toString(),
          title: product.title,
          subtitle: product.subtitle || "",
          image: product.main_image || "/placeholder.svg",
          type: "product",
          categoryName: cat?.name,
        })
      }
    })

    // Categories
    categories.forEach((category) => {
      const nameMatch = category.name?.toLowerCase().includes(searchTerm)
      const descMatch = category.description?.toLowerCase().includes(searchTerm)
      if (nameMatch || descMatch) {
        results.push({
          id: `category-${category.id}`,
          title: category.name,
          subtitle: category.description || "",
          image: category.main_image_url || category.image_url || "/placeholder.svg",
          type: "category",
        })
      }
    })

    // Sort results by relevance then alphabetically
    return results
      .sort((a, b) => {
        const aExact = a.title.toLowerCase() === searchTerm
        const bExact = b.title.toLowerCase() === searchTerm
        const aStarts = a.title.toLowerCase().startsWith(searchTerm)
        const bStarts = b.title.toLowerCase().startsWith(searchTerm)
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        if (aStarts && !bStarts) return -1
        if (!aStarts && bStarts) return 1
        return a.title.localeCompare(b.title)
      })
      .slice(0, 8)
  }

  const handleSearchChange = (query: string) => {
    setInternalSearchQuery(query)
    onSearchChange(query)
    setIsSearching(true)

    if (query.length >= 2) {
      const results = performSearch(query)
      setInternalSearchResults(results)
      setInternalShowResults(true)
      onSearchResultsChange(true)
    } else {
      setInternalSearchResults([])
      setInternalShowResults(false)
      onSearchResultsChange(false)
    }

    setIsSearching(false)
  }

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.type === "product") {
      // go to slug by title
      router.push(`/product?id=${result.title.toLowerCase().replace(/\s/g, "-")}`)
    } else if (result.type === "category") {
      router.push(`/category?name=${encodeURIComponent(result.title)}`)
    }
    setInternalSearchQuery("")
    onSearchChange("")
    setInternalSearchResults([])
    setInternalShowResults(false)
    onSearchResultsChange(false)
    onMobileSearchToggle(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setInternalShowResults(false)
        onSearchResultsChange(false)
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setInternalShowResults(false)
        onSearchResultsChange(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("click", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [onSearchResultsChange])

  const displayResults = internalSearchResults.length > 0 ? internalSearchResults : searchResults
  const currentShowResults = internalShowResults || showSearchResults

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <Link href="/">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/techno%20black%20logo-Photoroom-kXINbEXn7mF0yTZwRpjSz4yZbf6pWN.png"
                alt="Technovation"
                width={200}
                height={40}
              />
            </Link>
          </div>

          <div className="search-container" ref={searchRef}>
            <form onSubmit={(e) => { e.preventDefault(); if (displayResults[0]) handleSearchResultClick(displayResults[0]) }} className="search-form">
              <input
                className="search-input"
                maxLength={256}
                name="query"
                placeholder="Search..."
                type="search"
                value={internalSearchQuery || searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="search-button">
                {isSearching ? (
                  <div className="search-spinner"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                )}
              </button>

              {currentShowResults && displayResults.length > 0 && (
                <div className="search-results">
                  {displayResults.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="search-result-item"
                      onClick={() => handleSearchResultClick(result)}
                    >
                      <div className="search-result-image">
                        <Image src={result.image || "/placeholder.svg"} alt={result.title} width={50} height={50} />
                      </div>
                      <div className="search-result-info">
                        <h4 className="search-result-title">
                          {result.title}
                          {result.type === "category" && <span className="result-type-badge">Category</span>}
                        </h4>
                        <p className="search-result-subtitle">
                          {result.subtitle}
                          {result.categoryName && <span className="result-category"> • {result.categoryName}</span>}
                        </p>
                      </div>
                      <div className="search-result-arrow">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          <div className="search-icon-mobile" onClick={() => onMobileSearchToggle(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </div>
        </div>
      </nav>

      {/* Category Icons Navigation */}
      <section className="category-icons-section">
        <div className="category-icons-container">
          {categoryIcons.map((category) => {
            const matchingCategory = categories.find((cat) => cat.name === category.categoryName)
            return (
              <Link
                key={category.id}
                href={matchingCategory ? `/category?name=${encodeURIComponent(matchingCategory.name)}` : "#"}
                className="category-icon-link"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="category-icon-item">
                  <div className="category-icon-wrapper">
                    <AnimatedCategoryIcon type={category.type} isHovered={hoveredCategory === category.id} />
                  </div>
                  <span className="category-icon-label">{category.name}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Mobile Search Form */}
      <div className={`mobile-search-container ${mobileSearchActive ? "active" : ""}`} ref={mobileSearchRef}>
        <form
          onSubmit={(e) => { e.preventDefault(); if (displayResults[0]) handleSearchResultClick(displayResults[0]) }}
          className="mobile-search-form"
        >
          <input
            className="mobile-search-input"
            maxLength={256}
            name="query"
            placeholder="Search robots, categories..."
            type="search"
            value={internalSearchQuery || searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="mobile-search-button">
            {isSearching ? (
              <div className="search-spinner mobile"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            )}
          </button>
          <div className="close-search-button" onClick={() => onMobileSearchToggle(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
        </form>
      </div>
    </>
  )
}
