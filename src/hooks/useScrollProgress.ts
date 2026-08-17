import {
  useEffect,
  useRef,
} from 'react'


export function useScrollProgress<
  T extends HTMLElement,
>() {
  const elementRef = useRef<T>(null)


  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    let frameId: number | null = null


    const updateProgress = () => {
      const rect =
        element.getBoundingClientRect()

      const viewportHeight =
        window.innerHeight

      const documentHeight =
        document.documentElement.scrollHeight

      const maxScroll =
        Math.max(
          0,
          documentHeight - viewportHeight,
        )


      // ------------------------------------
      // Точка начала анимации
      // ------------------------------------

      const start =
        viewportHeight * 0.8


      // ------------------------------------
      // Желаемая точка завершения
      //
      // В обычной ситуации хотим закончить,
      // когда низ timeline окажется примерно
      // на 20% высоты viewport.
      // ------------------------------------

      const desiredEnd =
        viewportHeight * 0.2 - rect.height


      // ------------------------------------
      // Минимальная позиция top,
      // которую элемент вообще способен
      // достичь при текущей длине страницы.
      //
      // Это важно, если timeline находится
      // в самом конце документа.
      // ------------------------------------

      const elementDocumentTop =
        rect.top + window.scrollY

      const reachableEnd =
        elementDocumentTop - maxScroll


      // ------------------------------------
      // Если страница слишком короткая,
      // используем реально достижимый конец.
      // ------------------------------------

      const end =
        Math.max(
          desiredEnd,
          reachableEnd,
        )


      const distance =
        start - end

      const travelled =
        start - rect.top


      const rawProgress =
        distance > 0
          ? travelled / distance
          : 1


      const progress =
        Math.min(
          1,
          Math.max(0, rawProgress),
        )


      element.style.setProperty(
        '--scroll-progress',
        String(progress),
      )
    }


    const scheduleUpdate = () => {
      if (frameId !== null) {
        return
      }

      frameId = window.requestAnimationFrame(
        () => {
          frameId = null
          updateProgress()
        },
      )
    }


    // ------------------------------------
    // REDUCED MOTION
    // ------------------------------------

    if (reducedMotion.matches) {
      element.style.setProperty(
        '--scroll-progress',
        '1',
      )

      return
    }


    // ------------------------------------
    // INITIAL CALCULATION
    // ------------------------------------

    updateProgress()


    // ------------------------------------
    // EVENTS
    // ------------------------------------

    window.addEventListener(
      'scroll',
      scheduleUpdate,
      {
        passive: true,
      },
    )

    window.addEventListener(
      'resize',
      scheduleUpdate,
    )


    // ------------------------------------
    // CLEANUP
    // ------------------------------------

    return () => {
      window.removeEventListener(
        'scroll',
        scheduleUpdate,
      )

      window.removeEventListener(
        'resize',
        scheduleUpdate,
      )

      if (frameId !== null) {
        window.cancelAnimationFrame(
          frameId,
        )
      }
    }
  }, [])


  return elementRef
}