import { useEffect, useMemo, useRef } from 'react'
import type { TypingState } from '../../../hooks/useTypingSequence'
import styles from './TypedText.module.scss'

type TypedTextProps = {
  text: string
  state?: TypingState
  speed?: number
  startDelay?: number
  endDelay?: number
  className?: string
  onComplete?: () => void
}

const DEFAULT_TYPING_SPEED = 30

function TypedText({
  text,
  state = 'active',
  speed = DEFAULT_TYPING_SPEED,
  startDelay = 150,
  endDelay = 350,
  className,
  onComplete,
}: TypedTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const characterRefs = useRef<HTMLSpanElement[]>([])
  const startedRef = useRef(false)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const speedRef = useRef(speed)

  onCompleteRef.current = onComplete
  speedRef.current = speed

  const words = useMemo(() => text.trim().split(/\s+/), [text])

  const totalCharacters = useMemo(
    () =>
      words.reduce(
        (total, word) => total + Array.from(word).length,
        0,
      ),
    [words],
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    let observer: IntersectionObserver | null = null
    let frameId: number | null = null
    let startTimer: ReturnType<typeof setTimeout> | null = null
    let completeTimer: ReturnType<typeof setTimeout> | null = null
    let startTime: number | null = null

    const hideAll = () => {
      characterRefs.current.forEach((character) => {
        if (character) delete character.dataset.visible
      })
    }

    const showAll = () => {
      characterRefs.current.forEach((character) => {
        if (character) character.dataset.visible = 'true'
      })
    }

    const revealUntil = (count: number) => {
      for (let index = 0; index < count; index += 1) {
        const character = characterRefs.current[index]
        if (character) character.dataset.visible = 'true'
      }
    }

    const finish = () => {
      showAll()
      completedRef.current = true

      completeTimer = setTimeout(() => {
        onCompleteRef.current?.()
      }, endDelay)
    }

    const tick = (time: number) => {
      if (startTime === null) startTime = time

      const elapsed = time - startTime
      const currentSpeed = Math.max(1, speedRef.current)
      const visibleCount = Math.min(
        totalCharacters,
        Math.floor(elapsed / currentSpeed) + 1,
      )

      revealUntil(visibleCount)

      if (visibleCount >= totalCharacters) {
        frameId = null
        finish()
        return
      }

      frameId = window.requestAnimationFrame(tick)
    }

    const startTyping = () => {
      if (startedRef.current || completedRef.current) return

      startedRef.current = true
      startTimer = setTimeout(() => {
        frameId = window.requestAnimationFrame(tick)
      }, startDelay)
    }

    if (state === 'waiting') {
      startedRef.current = false
      completedRef.current = false
      hideAll()
      return
    }

    if (state === 'complete') {
      startedRef.current = true
      completedRef.current = true
      showAll()
      return
    }

    if (reducedMotion.matches) {
      showAll()
      completedRef.current = true
      onCompleteRef.current?.()
      return
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        startTyping()
        observer?.disconnect()
        observer = null
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -4% 0px',
      },
    )

    observer.observe(root)

    return () => {
      observer?.disconnect()

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }

      if (startTimer !== null) {
        clearTimeout(startTimer)
      }

      if (completeTimer !== null) {
        clearTimeout(completeTimer)
      }
    }
  }, [endDelay, startDelay, state, text, totalCharacters])

  let characterIndex = 0

  return (
    <span
      ref={rootRef}
      className={[styles.typedText, className].filter(Boolean).join(' ')}
      aria-label={text}
    >
      {words.map((word, wordIndex) => {
        const characters = Array.from(word)

        return (
          <span
            className={styles.word}
            aria-hidden="true"
            key={`${wordIndex}-${word}`}
          >
            {characters.map((character, index) => {
              const currentIndex = characterIndex
              characterIndex += 1

              return (
                <span
                  ref={(element) => {
                    if (element) {
                      characterRefs.current[currentIndex] = element
                    }
                  }}
                  className={styles.character}
                  key={`${index}-${character}`}
                >
                  {character}
                </span>
              )
            })}

            {wordIndex < words.length - 1 && (
              <span className={styles.space}>{' '}</span>
            )}
          </span>
        )
      })}
    </span>
  )
}

export default TypedText