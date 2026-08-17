import Container from '../../components/ui/Container/Container'
import TypedText from '../../components/ui/TypedText/TypedText'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import { useTypingSequence } from '../../hooks/useTypingSequence'
import styles from './Session.module.scss'

function Session() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.15)
  const { completeStep, getState } = useTypingSequence(isInView, 3)

  return (
    <section
      ref={ref}
      className={styles.session}
      id="session"
      aria-labelledby="session-title"
      data-visible={isInView || undefined}
    >
      <Container className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>{t.session.eyebrow}</span>

          <h2 className={styles.title} id="session-title">
            {t.session.title}
          </h2>
        </header>

        <div className={styles.content}>
          <p className={styles.lead}>
            <TypedText
              text={t.session.lead}
              state={getState(0)}
              speed={58}
              startDelay={300}
              endDelay={500}
              onComplete={() => completeStep(0)}
            />
          </p>

          <div className={styles.breath} aria-hidden="true">
            <span className={styles.ringOuter} />
            <span className={styles.ringMiddle} />
            <span className={styles.ringInner} />
            <span className={styles.core} />
          </div>

          <p className={styles.text}>
            <TypedText
              text={t.session.text}
              state={getState(1)}
              speed={46}
              startDelay={250}
              endDelay={650}
              onComplete={() => completeStep(1)}
            />
          </p>

          <p className={styles.final}>
            <TypedText
              text={t.session.final}
              state={getState(2)}
              speed={65}
              startDelay={400}
              endDelay={400}
              onComplete={() => completeStep(2)}
            />
          </p>
        </div>
      </Container>
    </section>
  )
}

export default Session