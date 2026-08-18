import { useEffect, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Fitting.module.scss'

function Fitting() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.12)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (isInView) setRevealed(true)
  }, [isInView])

  return (
    <section
      ref={ref}
      className={styles.fitting}
      id="fitting"
      aria-labelledby="fitting-title"
      data-visible={revealed || undefined}
    >
      <Container className={styles.container}>
        <h2 className={styles.sectionTitle} id="fitting-title">
          {t.fitting.eyebrow}
        </h2>

        <div className={styles.intro}>
          <h3 className={styles.title}>{t.fitting.title}</h3>
          <p className={styles.lead}>{t.fitting.lead}</p>
        </div>

        <p className={styles.text}>{t.fitting.text}</p>

        <div
          className={styles.gallery}
          data-ink-anchor="fitting-gallery"
          aria-hidden="true"
        >
          <div className={`${styles.photoCard} ${styles.photoBack}`} />
          <div className={`${styles.photoCard} ${styles.photoMiddle}`} />
          <div className={`${styles.photoCard} ${styles.photoFront}`} />

          <div className={styles.dots} data-ink-anchor="fitting-dots">
            <span className={styles.dotActive} />
            <span />
            <span />
          </div>
        </div>

        <p className={styles.final}>{t.fitting.final}</p>
      </Container>
    </section>
  )
}

export default Fitting