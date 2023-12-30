import { type ClassValue, clsx } from 'clsx'
import { Metadata } from 'next'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//here changing VERCEL_URL to LIVE_URL
export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path  

  if (process.env.LIVE_URL) {
    return `${process.env.LIVE_URL}${path}`
  } else {
    return `http://localhost:${process.env.PORT ?? 3000}${path}`
  }
}

export function constructMetadata({
  title = "Abhi-saas : the SaaS for students",
  description = "Abhi-saas is an open-source software to make chatting to your PDF files easy.",
  image = "/public/thumbnail.png",
  icons = "/public/favicon.ico",
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@nishchal27dev"
    },
    icons,
    metadataBase: new URL('https://aipowersaas-production.up.railway.app'),
    themeColor: '#FFF',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}