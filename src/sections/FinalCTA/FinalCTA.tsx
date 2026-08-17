import Container from '../../components/ui/Container/Container'
import TypedText from '../../components/ui/TypedText/TypedText'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './FinalCTA.module.scss'

function FinalCTA() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.2)

  return (
    <section
      ref={ref}
      className={styles.finalCta}
      id="final"
      data-visible={isInView || undefined}
    >
      <Container className={styles.container}>
        <h2 className={styles.title}>
          <TypedText
            text={t.finalCta.title}
            state={isInView ? 'active' : 'waiting'}
            speed={70}
            startDelay={300}
            endDelay={400}
          />
        </h2>

        <a
          className={styles.action}
          href="#booking"
        >
          <span>{t.finalCta.action}</span>
          <span className={styles.arrow}>→</span>
        </a>
      </Container>
    </section>
  )
}

export default FinalCTA