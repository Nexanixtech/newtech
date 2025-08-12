"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getHomeContent, updateHomeContent } from "@/lib/database"
import type { HomeContent } from "@/lib/database"

export default function ManageHomePage() {
  const router = useRouter()
  const [content, setContent] = useState<HomeContent>({
    featuredVideo: {
      title: "",
      description: "",
      videoUrl: "",
    },
    youtubeVideos: [],
    aboutUs: {
      title: "",
      content: "",
    },
  })
  const [loading, setLoading] = useState(false)
  const [newVideoInputs, setNewVideoInputs] = useState({
    title: "",
    url: "",
    displayOrder: 1,
  })

  useEffect(() => {
    const session = localStorage.getItem("adminSession")
    if (!session) {
      router.push("/admin/login")
      return
    }

    const loadedContent = getHomeContent()
    setContent(loadedContent)
  }, [router])

  const handleFeaturedVideoChange = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      featuredVideo: {
        ...prev.featuredVideo,
        [field]: value,
      },
    }))
  }

  const handleAboutUsChange = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      aboutUs: {
        ...prev.aboutUs,
        [field]: value,
      },
    }))
  }

  const addYouTubeVideo = () => {
    if (newVideoInputs.title && newVideoInputs.url) {
      const newVideo = {
        id: Date.now().toString(),
        title: newVideoInputs.title,
        url: newVideoInputs.url,
        thumbnail: `/placeholder.svg?height=120&width=200&text=${encodeURIComponent(newVideoInputs.title)}`,
        displayOrder: newVideoInputs.displayOrder,
      }

      setContent((prev) => ({
        ...prev,
        youtubeVideos: [...prev.youtubeVideos, newVideo],
      }))

      setNewVideoInputs({
        title: "",
        url: "",
        displayOrder: content.youtubeVideos.length + 2,
      })
    }
  }

  const removeYouTubeVideo = (id: string) => {
    if (confirm("Are you sure you want to remove this video?")) {
      setContent((prev) => ({
        ...prev,
        youtubeVideos: prev.youtubeVideos.filter((video) => video.id !== id),
      }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      updateHomeContent(content)
      alert("Home content updated successfully!")
    } catch (error) {
      console.error("Error updating home content:", error)
      alert("Error updating home content. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gray-700 text-white py-8 px-6 rounded-t-lg">
        <h1 className="text-3xl font-bold text-center">Content Management System</h1>
      </div>

      <div className="bg-white rounded-b-lg shadow-sm border border-gray-200">
        {/* Featured Video Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Featured Video</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={content.featuredVideo.title}
                onChange={(e) => handleFeaturedVideoChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={content.featuredVideo.description}
                onChange={(e) => handleFeaturedVideoChange("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
              <input
                type="url"
                value={content.featuredVideo.videoUrl}
                onChange={(e) => handleFeaturedVideoChange("videoUrl", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Video Preview */}
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-6 mt-6">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">{content.featuredVideo.title || "Featured Video Title"}</h3>
              <p className="text-gray-300">{content.featuredVideo.description}</p>
            </div>
          </div>
        </div>

        {/* YouTube Videos Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">YouTube Videos</h2>
          </div>

          {/* Add New Video Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Video</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newVideoInputs.title}
                  onChange={(e) => setNewVideoInputs((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                <input
                  type="url"
                  value={newVideoInputs.url}
                  onChange={(e) => setNewVideoInputs((prev) => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                <input
                  type="number"
                  value={newVideoInputs.displayOrder}
                  onChange={(e) =>
                    setNewVideoInputs((prev) => ({ ...prev, displayOrder: Number.parseInt(e.target.value) }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={addYouTubeVideo}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
            >
              + Add Video
            </button>
          </div>

          <div className="space-y-4">
            {content.youtubeVideos.map((video) => (
              <div key={video.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-20 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{video.title}</h3>
                  <p className="text-sm text-gray-600">{video.url}</p>
                  <p className="text-sm text-gray-500">Order: {video.displayOrder}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => removeYouTubeVideo(video.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Us Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">About Us Content</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={content.aboutUs.title}
                onChange={(e) => handleAboutUsChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={content.aboutUs.content}
                onChange={(e) => handleAboutUsChange("content", e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 font-medium text-lg"
          >
            {loading ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
