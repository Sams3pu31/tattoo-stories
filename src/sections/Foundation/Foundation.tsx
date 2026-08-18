import { useEffect, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Foundation.module.scss'

function Foundation() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.12)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (isInView) setRevealed(true)
  }, [isInView])

  return (
    <section
      ref={ref}
      className={styles.foundation}
      id="foundation"
      aria-labelledby="foundation-title"
      data-visible={revealed || undefined}
    >
      <Container className={styles.container}>
        <h2
          className={styles.title}
          id="foundation-title"
          data-ink-anchor="foundation-title"
        >
          {t.foundation.title}
        </h2>

        <div className={styles.story}>
          <article
            className={`${styles.block} ${styles.leadBlock}`}
            data-ink-anchor="foundation-lead"
          >
            <p className={styles.lead}>{t.foundation.lead}</p>
          </article>

          {t.foundation.paragraphs.map((paragraph, index) => (
            <article
              className={styles.block}
              data-ink-anchor={`foundation-${index + 1}`}
              key={paragraph}
            >
              <p className={styles.text}>{paragraph}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Foundation