import { useEffect, useRef } from 'react'

type ScrollProgressCallback = (progress: number) => void

export function useScrollProgress<T extends HTMLElement>(
  onProgress?: ScrollProgressCallback,
) {
  const elementRef = useRef<T>(null)
  const onProgressRef = useRef(onProgress)

  onProgressRef.current = onProgress

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    let frameId: number | null = null

    const applyProgress = (progress: number) => {
      const safeProgress = Math.min(1, Math.max(0, progress))

      element.style.setProperty(
        '--scroll-progress',
        String(safeProgress),
      )

      onProgressRef.current?.(safeProgress)
    }

    const updateProgress = () => {
      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const maxScroll = Math.max(0, documentHeight - viewportHeight)

      const start = viewportHeight * 0.8
      const desiredEnd = viewportHeight * 0.2 - rect.height
      const elementDocumentTop = rect.top + window.scrollY
      const reachableEnd = elementDocumentTop - maxScroll
      const end = Math.max(desiredEnd, reachableEnd)

      const distance = start - end
      const travelled = start - rect.top
      const rawProgress = distance > 0 ? travelled / distance : 1

      applyProgress(rawProgress)
    }

    const scheduleUpdate = () => {
      if (frameId !== null) return

      frameId = window.requestAnimationFrame(() => {
        frameId = null
        updateProgress()
      })
    }

    if (reducedMotion.matches) {
      applyProgress(1)
      return
    }

    updateProgress()

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return elementRef
}