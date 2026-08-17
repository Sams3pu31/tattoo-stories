import { useCallback, useEffect, useRef, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import { stories } from '../../data/stories'
import { useLanguage } from '../../hooks/useLanguage'
import StoryCard from './StoryCard'
import styles from './Stories.module.scss'

function Stories() {
  const { t } = useLanguage()
  const trackRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollPrevious, setCanScrollPrevious] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const maxScroll = track.scrollWidth - track.clientWidth

    setCanScrollPrevious(track.scrollLeft > 4)
    setCanScrollNext(track.scrollLeft < maxScroll - 4)
  }, [])

  const scrollToCard = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return

    const cards =
      track.querySelectorAll<HTMLElement>('[data-story-card]')
    const target = cards[index]

    if (!target) return

    track.scrollTo({
      left: target.offsetLeft,
      behavior: 'smooth',
    })
  }, [])

  const goPrevious = useCallback(() => {
    if (!canScrollPrevious) return

    const nextIndex = Math.max(0, activeIndex - 1)

    setActiveIndex(nextIndex)
    scrollToCard(nextIndex)
  }, [activeIndex, canScrollPrevious, scrollToCard])

  const goNext = useCallback(() => {
    if (!canScrollNext) return

    const nextIndex = Math.min(stories.length - 1, activeIndex + 1)

    setActiveIndex(nextIndex)
    scrollToCard(nextIndex)
  }, [activeIndex, canScrollNext, scrollToCard])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const cards =
      track.querySelectorAll<HTMLElement>('[data-story-card]')

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio,
          )[0]

        if (!visibleEntry) return

        const index = Number(
          visibleEntry.target.getAttribute('data-index'),
        )

        if (!Number.isNaN(index)) {
          setActiveIndex(index)
        }
      },
      {
        root: track,
        threshold: [0.4, 0.6, 0.8],
      },
    )

    cards.forEach((card) => observer.observe(card))

    updateScrollState()

    const handleScroll = () => updateScrollState()
    const handleResize = () => updateScrollState()

    track.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      observer.disconnect()
      track.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [updateScrollState])

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

          <div className={styles.controls}>
            <button
              className={styles.control}
              type="button"
              aria-label={t.stories.previous}
              onClick={goPrevious}
              disabled={!canScrollPrevious}
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
              disabled={!canScrollNext}
            >
              →
            </button>
          </div>
        </header>
      </Container>

      <div ref={trackRef} className={styles.track}>
        {stories.map((story, index) => (
          <div
            className={styles.slide}
            data-story-card
            data-index={index}
            key={story.id}
          >
            <StoryCard story={story} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stories