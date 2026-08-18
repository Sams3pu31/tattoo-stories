import { useEffect, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import TypedText from '../../components/ui/TypedText/TypedText'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './FinalCTA.module.scss'

type FinalStage = 'waiting' | 'title' | 'action'

function FinalCTA() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.2)
  const [stage, setStage] = useState<FinalStage>('waiting')

  useEffect(() => {
    if (isInView) {
      setStage((current) =>
        current === 'waiting' ? 'title' : current,
      )
      return
    }

    setStage('waiting')
  }, [isInView])

  return (
    <section
      ref={ref}
      className={styles.finalCta}
      id="final"
      data-stage={stage}
    >
      <Container className={styles.container}>
        <h2 className={styles.title}>
          <TypedText
            text={t.finalCta.title}
            state={
              stage === 'waiting'
                ? 'waiting'
                : stage === 'title'
                  ? 'active'
                  : 'complete'
            }
            speed={58}
            startDelay={250}
            endDelay={350}
            onComplete={() => setStage('action')}
          />
        </h2>

        <a
          className={styles.action}
          href="#booking"
        >
          <span>{t.finalCta.action}</span>
          <span
            className={styles.arrow}
            aria-hidden="true"
          >
            →
          </span>
        </a>
      </Container>
    </section>
  )
}

export default FinalCTA