"use client"

import React, { useState } from "react"
import Navbar from "@/components/Navbar"

interface SearchResult {
  id: string
  title: string
  subtitle: string
  image: string
  type: "product" | "category"
  categoryName?: string
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [mobileSearchActive, setMobileSearchActive] = useState(false)

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        showSearchResults={showSearchResults}
        onSearchResultsChange={setShowSearchResults}
        mobileSearchActive={mobileSearchActive}
        onMobileSearchToggle={setMobileSearchActive}
      />
      {children}
    </>
  )
}
