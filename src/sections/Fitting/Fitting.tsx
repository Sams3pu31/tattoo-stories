import { useEffect, useMemo, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import TypedText from '../../components/ui/TypedText/TypedText'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Fitting.module.scss'

type FittingStage =
  | 'waiting'
  | 'lead'
  | 'fit'
  | 'final'
  | 'complete'

const FIT_DURATION = 4600
const TEXT_START_DELAY = 180

function Fitting() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.12)
  const [stage, setStage] = useState<FittingStage>('waiting')

  const textSpeed = useMemo(() => {
    const length = Math.max(1, Array.from(t.fitting.text).length)

    return Math.max(
      26,
      Math.floor(
        (FIT_DURATION - TEXT_START_DELAY - 150) / length,
      ),
    )
  }, [t.fitting.text])

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
    if (stage !== 'fit') return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    if (reducedMotion.matches) {
      setStage('final')
      return
    }

    const timer = window.setTimeout(
      () => setStage('final'),
      FIT_DURATION,
    )

    return () => window.clearTimeout(timer)
  }, [stage])

  return (
    <section
      ref={ref}
      className={styles.fitting}
      id="fitting"
      aria-labelledby="fitting-title"
      data-stage={stage}
    >
      <Container className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>
            {t.fitting.eyebrow}
          </span>

          <h2
            className={styles.title}
            id="fitting-title"
          >
            {t.fitting.title}
          </h2>
        </header>

        <div className={styles.content}>
          <p className={styles.lead}>
            <TypedText
              text={t.fitting.lead}
              state={
                stage === 'waiting'
                  ? 'waiting'
                  : stage === 'lead'
                    ? 'active'
                    : 'complete'
              }
              speed={42}
              startDelay={220}
              endDelay={350}
              onComplete={() => setStage('fit')}
            />
          </p>

          <div className={styles.fitArea}>
            <div
              className={styles.fitVisual}
              aria-hidden="true"
            >
              <span className={styles.shapeOuter} />
              <span className={styles.shapeMiddle} />
              <span className={styles.shapeInner} />
              <span className={styles.fitPoint} />
            </div>

            <p className={styles.text}>
              <TypedText
                text={t.fitting.text}
                state={
                  stage === 'fit'
                    ? 'active'
                    : stage === 'final' ||
                        stage === 'complete'
                      ? 'complete'
                      : 'waiting'
                }
                speed={textSpeed}
                startDelay={TEXT_START_DELAY}
                endDelay={0}
              />
            </p>
          </div>

          <p className={styles.final}>
            <TypedText
              text={t.fitting.final}
              state={
                stage === 'final'
                  ? 'active'
                  : stage === 'complete'
                    ? 'complete'
                    : 'waiting'
              }
              speed={32}
              startDelay={250}
              endDelay={300}
              onComplete={() => setStage('complete')}
            />
          </p>
        </div>
      </Container>
    </section>
  )
}

export default Fitting