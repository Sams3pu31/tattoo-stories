import { useEffect, useMemo, useRef, useState } from 'react'
import TypedText from '../../components/ui/TypedText/TypedText'
import { useInView } from '../../hooks/useInView'
import styles from './FoundationTimeline.module.scss'

type FoundationTimelineProps = {
  lead: string
  paragraphs: string[]
}

type FoundationStage =
  | 'waiting'
  | 'lead'
  | 'idea'
  | 'gather'
  | 'final'
  | 'complete'

const GATHER_DURATION = 5200
const PROMPT_START_DELAY = 180

function FoundationTimeline({
  lead,
  paragraphs,
}: FoundationTimelineProps) {
  const { ref, isInView } = useInView<HTMLDivElement>(0.08)
  const progressRef = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState<FoundationStage>('waiting')

  const idea = paragraphs[0] ?? ''
  const prompt = paragraphs[1] ?? ''
  const final = paragraphs[2] ?? ''

  const promptSpeed = useMemo(() => {
    const length = Math.max(1, Array.from(prompt).length)

    return Math.max(
      28,
      Math.floor(
        (GATHER_DURATION - PROMPT_START_DELAY - 150) / length,
      ),
    )
  }, [prompt])

  useEffect(() => {
    if (isInView) {
      setStage((current) =>
        current === 'waiting'
          ? 'lead'
          : current,
      )
      return
    }

    setStage('waiting')
  }, [isInView])

  useEffect(() => {
    if (stage !== 'gather') return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    if (reducedMotion.matches) {
      setStage('final')
      return
    }

    const timer = window.setTimeout(
      () => setStage('final'),
      GATHER_DURATION,
    )

    return () => window.clearTimeout(timer)
  }, [stage])

  useEffect(() => {
    const node = progressRef.current

    if (!node) return

    let frame = 0

    const updateProgress = () => {
      frame = 0

      const rect = node.getBoundingClientRect()
      const start = window.innerHeight * 0.82
      const end = window.innerHeight * 0.18
      const distance = rect.height + start - end

      const progress = Math.min(
        1,
        Math.max(
          0,
          (start - rect.top) / distance,
        ),
      )

      node.style.setProperty(
        '--scroll-progress',
        String(progress),
      )
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateProgress)
    }

    updateProgress()

    window.addEventListener('scroll', scheduleUpdate, {
      passive: true,
    })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)

      if (frame) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={styles.timeline}
      data-stage={stage}
    >
      <div
        ref={progressRef}
        className={styles.progressArea}
      >
        <div
          className={styles.track}
          aria-hidden="true"
        >
          <span className={styles.trackProgress} />
          <span className={styles.dot} />
        </div>

        <div className={styles.block}>
          <p className={styles.lead}>
            <TypedText
              text={lead}
              state={
                stage === 'waiting'
                  ? 'waiting'
                  : stage === 'lead'
                    ? 'active'
                    : 'complete'
              }
              speed={38}
              startDelay={180}
              endDelay={300}
              onComplete={() => setStage('idea')}
            />
          </p>
        </div>

        <div className={styles.block}>
          <p className={styles.text}>
            <TypedText
              text={idea}
              state={
                stage === 'idea'
                  ? 'active'
                  : stage === 'gather' ||
                      stage === 'final' ||
                      stage === 'complete'
                    ? 'complete'
                    : 'waiting'
              }
              speed={34}
              startDelay={120}
              endDelay={300}
              onComplete={() => setStage('gather')}
            />
          </p>
        </div>

        <div className={styles.gather}>
          <p className={styles.prompt}>
            <TypedText
              text={prompt}
              state={
                stage === 'gather'
                  ? 'active'
                  : stage === 'final' ||
                      stage === 'complete'
                    ? 'complete'
                    : 'waiting'
              }
              speed={promptSpeed}
              startDelay={PROMPT_START_DELAY}
              endDelay={0}
            />
          </p>

          <div
            className={styles.art}
            aria-hidden="true"
          >
            <svg
              className={styles.artSvg}
              viewBox="0 0 320 280"
              fill="none"
            >
              <g className={`${styles.piece} ${styles.circle}`}>
                <circle cx="160" cy="140" r="76" />
              </g>

              <g className={`${styles.piece} ${styles.triangle}`}>
                <path d="M160 75 L216 177 L104 177 Z" />
              </g>

              <g className={`${styles.piece} ${styles.diamond}`}>
                <rect
                  x="118"
                  y="98"
                  width="84"
                  height="84"
                  rx="2"
                />
              </g>

              <g className={`${styles.piece} ${styles.arcs}`}>
                <path d="M104 140 C116 92 204 92 216 140" />
                <path d="M104 140 C116 188 204 188 216 140" />
              </g>

              <g className={`${styles.piece} ${styles.line}`}>
                <path d="M78 140 H242" />
              </g>

              <circle
                className={styles.center}
                cx="160"
                cy="140"
                r="7"
              />
            </svg>
          </div>
        </div>

        <div className={styles.block}>
          <p className={styles.final}>
            <TypedText
              text={final}
              state={
                stage === 'final'
                  ? 'active'
                  : stage === 'complete'
                    ? 'complete'
                    : 'waiting'
              }
              speed={36}
              startDelay={180}
              endDelay={250}
              onComplete={() => setStage('complete')}
            />
          </p>
        </div>
      </div>
    </div>
  )
}

export default FoundationTimeline