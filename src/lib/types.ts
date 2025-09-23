export interface Practice {
  title: string
  slug: string
  intro: string
  benefits: string[]
  faqs: { q: string; a: string }[]
  relatedServices: string[]
}

export interface Service {
  title: string
  slug: string
  summary: string
  steps: string[]
  priceNote?: string
  faqs: { q: string; a: string }[]
  practice: string
}

export interface Post {
  title: string
  slug: string
  excerpt: string
  body: string
  publishedAt: string
  author?: string
}

export interface ContactFormData {
  name: string
  phone: string
  message?: string
}

export interface LeadFormData extends ContactFormData {
  service?: string
  practice?: string
}

export interface SeoData {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
}