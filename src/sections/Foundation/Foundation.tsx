import Container from '../../components/ui/Container/Container'
import { useLanguage } from '../../hooks/useLanguage'
import FoundationTimeline from './FoundationTimeline'
import styles from './Foundation.module.scss'

function Foundation() {
  const { t } = useLanguage()

  return (
    <section
      className={styles.foundation}
      id="foundation"
      aria-labelledby="foundation-title"
    >
      <Container className={styles.container}>
        <h2
          className={styles.title}
          id="foundation-title"
        >
          {t.foundation.title}
        </h2>

        <FoundationTimeline
          lead={t.foundation.lead}
          paragraphs={t.foundation.paragraphs}
        />
      </Container>
    </section>
  )
}

export default Foundation