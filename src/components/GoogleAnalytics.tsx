import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function ensureGtag() {
  window.dataLayer = window.dataLayer ?? []
  if (window.gtag) return

  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args)
  }
}

export function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    if (!GA_ID) return

    ensureGtag()
    window.gtag!('js', new Date())

    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`)) return

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!GA_ID) return
    ensureGtag()
    window.gtag!('config', GA_ID, {
      page_path: location.pathname + location.search,
    })
  }, [location.pathname, location.search])

  return null
}
