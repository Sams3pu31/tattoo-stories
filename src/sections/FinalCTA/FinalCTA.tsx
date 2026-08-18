import { useEffect, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './FinalCTA.module.scss'

function FinalCTA() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.14)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (isInView) setRevealed(true)
  }, [isInView])

  return (
    <section
      ref={ref}
      className={styles.finalCta}
      id="final"
      data-visible={revealed || undefined}
    >
      <Container className={styles.container}>
        <h2 className={styles.title}>{t.finalCta.title}</h2>

        <a className={styles.action} href="#booking">
          <span>{t.finalCta.action}</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </a>
      </Container>

      <div
        className={styles.inkSurface}
        data-ink-anchor="final-surface"
        aria-hidden="true"
      >
        <span className={styles.surfaceLine} />
      </div>
    </section>
  )
}

export default FinalCTA