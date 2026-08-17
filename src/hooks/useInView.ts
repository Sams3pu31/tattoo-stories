import {
  useEffect,
  useRef,
  useState,
} from 'react'


export function useInView<
  T extends HTMLElement,
>(
  threshold = 0.25,
) {
  const ref = useRef<T>(null)

  const [
    isInView,
    setIsInView,
  ] = useState(false)


  useEffect(() => {
    const element = ref.current

    if (!element) {
      return
    }


    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      )


    // ====================================
    // REDUCED MOTION
    // ====================================

    if (reducedMotion.matches) {
      setIsInView(true)

      return
    }


    // ====================================
    // OBSERVER
    // ====================================

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          /*
           * Секция появилась
           * в рабочей области экрана —
           * включаем анимацию.
           */
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >=
              threshold
          ) {
            setIsInView(true)

            return
          }


          /*
           * Когда секция полностью ушла
           * за пределы viewport,
           * возвращаем её в начальное
           * состояние.
           *
           * Поэтому при следующем входе
           * анимация запустится заново.
           */
          if (!entry.isIntersecting) {
            setIsInView(false)
          }
        },
        {
          threshold: [
            0,
            threshold,
          ],

          /*
           * Анимация начинается не тогда,
           * когда показался один пиксель
           * секции, а чуть глубже внутри
           * viewport.
           */
          rootMargin:
            '0px 0px -10% 0px',
        },
      )


    observer.observe(element)


    // ====================================
    // CLEANUP
    // ====================================

    return () => {
      observer.disconnect()
    }
  }, [threshold])


  return {
    ref,
    isInView,
  }
}