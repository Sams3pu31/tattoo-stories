import { useEffect, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import TypedText from '../../components/ui/TypedText/TypedText'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Reviews.module.scss'

type ReviewsStage =
  | 'waiting'
  | 'lead'
  | 'cards'
  | 'text'
  | 'final'
  | 'complete'

function Reviews() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.1)
  const [stage, setStage] = useState<ReviewsStage>('waiting')

  useEffect(() => {
    if (isInView) {
      setStage((current) =>
        current === 'waiting' ? 'lead' : current,
      )
      return
    }

    setStage('waiting')
  }, [isInView])

  useEffect(() => {
    if (stage !== 'cards') return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    if (reducedMotion.matches) {
      setStage('text')
      return
    }

    const timer = window.setTimeout(
      () => setStage('text'),
      1800,
    )

    return () => window.clearTimeout(timer)
  }, [stage])

  return (
    <section
      ref={ref}
      className={styles.reviews}
      id="reviews"
      aria-labelledby="reviews-title"
      data-stage={stage}
    >
      <Container className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>
            {t.reviews.eyebrow}
          </span>

          <h2
            className={styles.title}
            id="reviews-title"
          >
            {t.reviews.title}
          </h2>
        </header>

        <p className={styles.lead}>
          <TypedText
            text={t.reviews.lead}
            state={
              stage === 'waiting'
                ? 'waiting'
                : stage === 'lead'
                  ? 'active'
                  : 'complete'
            }
            speed={34}
            startDelay={200}
            endDelay={300}
            onComplete={() => setStage('cards')}
          />
        </p>
      </Container>

      <div className={styles.track}>
        {[0, 1, 2].map((item) => (
          <div
            className={styles.review}
            key={item}
          >
            <span className={styles.avatar} />

            <div className={styles.lines}>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        ))}
      </div>

      <Container className={styles.footer}>
        <p className={styles.text}>
          <TypedText
            text={t.reviews.text}
            state={
              stage === 'text'
                ? 'active'
                : stage === 'final' ||
                    stage === 'complete'
                  ? 'complete'
                  : 'waiting'
            }
            speed={34}
            startDelay={180}
            endDelay={350}
            onComplete={() => setStage('final')}
          />
        </p>

        <p className={styles.final}>
          <TypedText
            text={t.reviews.final}
            state={
              stage === 'final'
                ? 'active'
                : stage === 'complete'
                  ? 'complete'
                  : 'waiting'
            }
            speed={42}
            startDelay={220}
            endDelay={250}
            onComplete={() => setStage('complete')}
          />
        </p>
      </Container>
    </section>
  )
}

export default Reviews