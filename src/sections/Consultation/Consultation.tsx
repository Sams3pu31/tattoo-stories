import { useEffect, useMemo, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import TypedText from '../../components/ui/TypedText/TypedText'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Consultation.module.scss'

type ConsultationStage =
  | 'waiting'
  | 'lead'
  | 'art'
  | 'final'
  | 'complete'

const ART_DURATION = 6800
const PROMPT_START_DELAY = 300
const PROMPT_END_DELAY = 300

function Consultation() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.15)
  const [stage, setStage] = useState<ConsultationStage>('waiting')

  const promptSpeed = useMemo(() => {
    const length = Math.max(
      1,
      Array.from(t.consultation.prompt).length,
    )

    return Math.max(
      40,
      Math.floor(
        (
          ART_DURATION -
          PROMPT_START_DELAY -
          PROMPT_END_DELAY
        ) / length,
      ),
    )
  }, [t.consultation.prompt])

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
    if (stage !== 'art') {
      return
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    if (reducedMotion.matches) {
      setStage('final')
      return
    }

    const timer = window.setTimeout(
      () => setStage('final'),
      ART_DURATION,
    )

    return () => window.clearTimeout(timer)
  }, [stage])

  return (
    <section
      ref={ref}
      className={styles.consultation}
      id="consultation"
      aria-labelledby="consultation-title"
      data-stage={stage}
    >
      <Container className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>
            {t.consultation.eyebrow}
          </span>

          <h2
            className={styles.title}
            id="consultation-title"
          >
            {t.consultation.title}
          </h2>
        </header>

        <div className={styles.content}>
          <p className={styles.lead}>
            <TypedText
              text={t.consultation.lead}
              state={
                stage === 'waiting'
                  ? 'waiting'
                  : stage === 'lead'
                    ? 'active'
                    : 'complete'
              }
              speed={60}
              startDelay={350}
              endDelay={700}
              onComplete={() => setStage('art')}
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

          <p className={styles.prompt}>
            <TypedText
              text={t.consultation.prompt}
              state={
                stage === 'art'
                  ? 'active'
                  : stage === 'final' ||
                      stage === 'complete'
                    ? 'complete'
                    : 'waiting'
              }
              speed={promptSpeed}
              startDelay={PROMPT_START_DELAY}
              endDelay={PROMPT_END_DELAY}
            />
          </p>

          <p className={styles.final}>
            <TypedText
              text={t.consultation.final}
              state={
                stage === 'final'
                  ? 'active'
                  : stage === 'complete'
                    ? 'complete'
                    : 'waiting'
              }
              speed={55}
              startDelay={400}
              endDelay={450}
              onComplete={() => setStage('complete')}
            />
          </p>
        </div>
      </Container>
    </section>
  )
}

export default Consultation