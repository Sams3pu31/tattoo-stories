import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import { stories } from '../../data/stories'
import { useLanguage } from '../../hooks/useLanguage'
import StoryCard from './StoryCard'
import styles from './Stories.module.scss'

function Stories() {
  const { t } = useLanguage()
  const trackRef = useRef<HTMLDivElement>(null)
  const settleTimerRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [ready, setReady] = useState(false)

  const loopedStories =
    stories.length > 1
      ? [stories[stories.length - 1], ...stories, stories[0]]
      : stories

  const getCards = useCallback(() => {
    return trackRef.current?.querySelectorAll<HTMLElement>('[data-story-card]')
  }, [])

  const jumpToRendered = useCallback(
    (index: number) => {
      const track = trackRef.current
      const cards = getCards()
      const target = cards?.[index]
      if (!track || !target) return

      const previousBehavior = track.style.scrollBehavior
      track.style.scrollBehavior = 'auto'
      track.scrollLeft = target.offsetLeft

      requestAnimationFrame(() => {
        track.style.scrollBehavior = previousBehavior
      })
    },
    [getCards],
  )

  const scrollToRendered = useCallback(
    (index: number) => {
      const track = trackRef.current
      const cards = getCards()
      const target = cards?.[index]
      if (!track || !target) return

      track.scrollTo({
        left: target.offsetLeft,
        behavior: 'smooth',
      })
    },
    [getCards],
  )

  useLayoutEffect(() => {
    if (!stories.length) return

    const frame = requestAnimationFrame(() => {
      jumpToRendered(stories.length > 1 ? 1 : 0)
      setReady(true)
    })

    return () => cancelAnimationFrame(frame)
  }, [jumpToRendered])

  useEffect(() => {
    const track = trackRef.current
    const cards = getCards()
    if (!track || !cards?.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visible) return

        const renderedIndex = Number(
          visible.target.getAttribute('data-rendered-index'),
        )

        if (Number.isNaN(renderedIndex)) return

        if (stories.length === 1) {
          setActiveIndex(0)
          return
        }

        if (renderedIndex === 0) {
          setActiveIndex(stories.length - 1)
          return
        }

        if (renderedIndex === stories.length + 1) {
          setActiveIndex(0)
          return
        }

        setActiveIndex(renderedIndex - 1)
      },
      {
        root: track,
        threshold: [0.45, 0.6, 0.75],
      },
    )

    cards.forEach((card) => observer.observe(card))

    const settle = () => {
      if (stories.length <= 1) return

      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      cards.forEach((card, index) => {
        const distance = Math.abs(card.offsetLeft - track.scrollLeft)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      if (closestIndex === 0) {
        jumpToRendered(stories.length)
      }

      if (closestIndex === stories.length + 1) {
        jumpToRendered(1)
      }
    }

    const handleScroll = () => {
      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current)
      }

      settleTimerRef.current = window.setTimeout(settle, 120)
    }

    const handleResize = () => {
      jumpToRendered(stories.length > 1 ? activeIndex + 1 : 0)
    }

    track.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      observer.disconnect()
      track.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)

      if (settleTimerRef.current) {
        window.clearTimeout(settleTimerRef.current)
      }
    }
  }, [activeIndex, getCards, jumpToRendered])

  const goPrevious = () => {
    if (stories.length <= 1) return

    const nextIndex =
      (activeIndex - 1 + stories.length) % stories.length

    setActiveIndex(nextIndex)
    scrollToRendered(activeIndex === 0 ? 0 : activeIndex)
  }

  const goNext = () => {
    if (stories.length <= 1) return

    const nextIndex = (activeIndex + 1) % stories.length

    setActiveIndex(nextIndex)
    scrollToRendered(activeIndex + 2)
  }

  return (
    <section
      className={styles.stories}
      id="stories"
      aria-labelledby="stories-title"
    >
      <Container>
        <header className={styles.header}>
          <h2 className={styles.title} id="stories-title">
            {t.stories.title}
          </h2>

          {stories.length > 1 && (
            <div className={styles.controls}>
              <button
                className={styles.control}
                type="button"
                aria-label={t.stories.previous}
                onClick={goPrevious}
              >
                ←
              </button>

              <span className={styles.counter}>
                {String(activeIndex + 1).padStart(2, '0')}
                <span aria-hidden="true">/</span>
                {String(stories.length).padStart(2, '0')}
              </span>

              <button
                className={styles.control}
                type="button"
                aria-label={t.stories.next}
                onClick={goNext}
              >
                →
              </button>
            </div>
          )}
        </header>
      </Container>

      <div
        ref={trackRef}
        className={styles.track}
        data-ready={ready || undefined}
      >
        {loopedStories.map((story, index) => (
          <div
            className={styles.slide}
            data-story-card
            data-rendered-index={index}
            key={`${story.id}-${index}`}
          >
            <StoryCard story={story} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stories