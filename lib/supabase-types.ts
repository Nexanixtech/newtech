// Supabase database types and interfaces
export interface Category {
  id: number
  name: string
  description: string
  image_url?: string
  main_image_url?: string
  bg_image_url?: string
  color: string
  name_color: string
  description_color: string
  is_main: boolean
  is_new: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  title: string
  subtitle: string
  category_id: number
  main_image: string
  images_360: string[]
  banner_image?: string
  description: string
  right_desc_image?: string
  left_spec_image?: string
  specifications: Record<string, string>
  technical_specifications: TechnicalSpec[]
  product_video?: string
  model_3d?: string
  price?: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TechnicalSpec {
  spec: string
  subspec: string
  image?: string
}

export interface HomeContent {
  id: number
  featured_video: {
    title: string
    description: string
    video_url: string
  }
  youtube_videos: YouTubeVideo[]
  about_us: {
    title: string
    content: string
  }
  created_at: string
  updated_at: string
}

export interface YouTubeVideo {
  id: string
  title: string
  url: string
  description: string
  display_order: number
}

export interface Logo {
  id: number
  url: string
  name: string
  display_order: number
  is_active: boolean
  created_at: string
}
