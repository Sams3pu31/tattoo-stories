import Container from '../../components/ui/Container/Container'
import TypedText from '../../components/ui/TypedText/TypedText'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import { useTypingSequence } from '../../hooks/useTypingSequence'
import styles from './Reviews.module.scss'

function Reviews() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.12)
  const { completeStep, getState } = useTypingSequence(isInView, 3)

  return (
    <section
      ref={ref}
      className={styles.reviews}
      id="reviews"
      aria-labelledby="reviews-title"
      data-visible={isInView || undefined}
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
            state={getState(0)}
            speed={52}
            startDelay={300}
            endDelay={500}
            onComplete={() => completeStep(0)}
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
            state={getState(1)}
            speed={48}
            startDelay={300}
            endDelay={600}
            onComplete={() => completeStep(1)}
          />
        </p>

        <p className={styles.final}>
          <TypedText
            text={t.reviews.final}
            state={getState(2)}
            speed={60}
            startDelay={350}
            endDelay={400}
            onComplete={() => completeStep(2)}
          />
        </p>
      </Container>
    </section>
  )
}

export default Reviews