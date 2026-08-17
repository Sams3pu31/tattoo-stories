import { useCallback, useEffect, useRef, useState } from 'react'
import TypedText from '../../components/ui/TypedText/TypedText'
import { useInView } from '../../hooks/useInView'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import {
  useTypingSequence,
  type TypingState,
} from '../../hooks/useTypingSequence'
import styles from './FoundationTimeline.module.scss'

type FoundationTimelineProps = {
  lead: string
  paragraphs: string[]
}

const NORMAL_SPEED = 30
const SCROLL_SPEED = 16

function FoundationTimeline({
  lead,
  paragraphs,
}: FoundationTimelineProps) {
  const textCount = paragraphs.length + 1
  const { ref: visibilityRef, isInView } =
    useInView<HTMLDivElement>(0.04)

  const trackRef = useRef<HTMLDivElement>(null)
  const textBlockRefs = useRef<Array<HTMLDivElement | null>>([])
  const scrollUnlockedRef = useRef(-1)

  const [autoUnlockedIndex, setAutoUnlockedIndex] = useState(-1)
  const [scrollUnlockedIndex, setScrollUnlockedIndex] = useState(-1)

  const { activeIndex, completeStep } = useTypingSequence(
    isInView,
    textCount,
  )

  const handleScrollProgress = useCallback((progress: number) => {
    const track = trackRef.current
    if (!track) return

    const trackRect = track.getBoundingClientRect()
    const dotY = trackRect.top + trackRect.height * progress
    let reachedIndex = -1

    textBlockRefs.current.forEach((block, index) => {
      if (!block) return

      const blockRect = block.getBoundingClientRect()
      const triggerY =
        blockRect.top + Math.min(24, blockRect.height * 0.2)

      if (dotY >= triggerY) {
        reachedIndex = index
      }
    })

    if (reachedIndex <= scrollUnlockedRef.current) return

    scrollUnlockedRef.current = reachedIndex
    setScrollUnlockedIndex(reachedIndex)
  }, [])

  const timelineRef =
    useScrollProgress<HTMLDivElement>(handleScrollProgress)

  const setTimelineRef = useCallback(
    (element: HTMLDivElement | null) => {
      timelineRef.current = element
      visibilityRef.current = element
    },
    [timelineRef, visibilityRef],
  )

  useEffect(() => {
    if (!isInView) {
      setAutoUnlockedIndex(-1)
      setScrollUnlockedIndex(-1)
      scrollUnlockedRef.current = -1
      return
    }

    const timers = Array.from({ length: textCount }, (_, index) =>
      window.setTimeout(() => {
        setAutoUnlockedIndex((current) => Math.max(current, index))
      }, 450 + index * 1250),
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [isInView, textCount])

  const unlockedIndex = Math.max(
    autoUnlockedIndex,
    scrollUnlockedIndex,
  )

  const getTextState = (index: number): TypingState => {
    if (!isInView) return 'waiting'
    if (index < activeIndex) return 'complete'

    if (index === activeIndex && index <= unlockedIndex) {
      return 'active'
    }

    return 'waiting'
  }

  const getTextSpeed = (index: number) =>
    index <= scrollUnlockedIndex ? SCROLL_SPEED : NORMAL_SPEED

  return (
    <div ref={setTimelineRef} className={styles.timeline}>
      <div ref={trackRef} className={styles.track} aria-hidden="true">
        <span className={styles.trackProgress} />
        <span className={styles.dot} />
      </div>

      <div
        ref={(element) => {
          textBlockRefs.current[0] = element
        }}
        className={styles.textBlock}
      >
        <p className={styles.lead}>
          <TypedText
            text={lead}
            state={getTextState(0)}
            speed={getTextSpeed(0)}
            startDelay={100}
            endDelay={260}
            onComplete={() => completeStep(0)}
          />
        </p>
      </div>

      {paragraphs.map((paragraph, index) => {
        const stepIndex = index + 1

        return (
          <div className={styles.group} key={`${index}-${paragraph}`}>
            <div className={styles.spacer} aria-hidden="true" />

            <div
              ref={(element) => {
                textBlockRefs.current[stepIndex] = element
              }}
              className={styles.textBlock}
            >
              <p className={styles.paragraph}>
                <TypedText
                  text={paragraph}
                  state={getTextState(stepIndex)}
                  speed={getTextSpeed(stepIndex)}
                  startDelay={100}
                  endDelay={280}
                  onComplete={() => completeStep(stepIndex)}
                />
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FoundationTimeline