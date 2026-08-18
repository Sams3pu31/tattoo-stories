import { useEffect, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Reviews.module.scss'

function Reviews() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.1)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (isInView) setRevealed(true)
  }, [isInView])

  return (
    <section
      ref={ref}
      className={styles.reviews}
      id="reviews"
      aria-labelledby="reviews-title"
      data-visible={revealed || undefined}
    >
      <Container className={styles.container}>
        <h2 className={styles.title} id="reviews-title">
          {t.reviews.eyebrow}
        </h2>

        <div className={styles.copy}>
          <p className={styles.lead}>{t.reviews.lead}</p>
          <p className={styles.text}>{t.reviews.text}</p>
          <p className={styles.final}>{t.reviews.final}</p>
        </div>

        <div
          className={styles.reviewStack}
          data-ink-anchor="reviews-stack"
          aria-hidden="true"
        >
          <div className={`${styles.reviewCard} ${styles.cardBack}`}>
            <div className={styles.avatar} />
            <div className={styles.lines}>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className={`${styles.reviewCard} ${styles.cardMiddle}`}>
            <div className={styles.avatar} />
            <div className={styles.lines}>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className={`${styles.reviewCard} ${styles.cardFront}`}>
            <div className={styles.avatar} />
            <div className={styles.lines}>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Reviews