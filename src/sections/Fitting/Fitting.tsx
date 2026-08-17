import Container from '../../components/ui/Container/Container'
import TypedText from '../../components/ui/TypedText/TypedText'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import { useTypingSequence } from '../../hooks/useTypingSequence'
import styles from './Fitting.module.scss'

function Fitting() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.15)
  const { completeStep, getState } = useTypingSequence(isInView, 3)

  return (
    <section
      ref={ref}
      className={styles.fitting}
      id="fitting"
      aria-labelledby="fitting-title"
      data-visible={isInView || undefined}
    >
      <Container className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>{t.fitting.eyebrow}</span>
          <h2 className={styles.title} id="fitting-title">
            {t.fitting.title}
          </h2>
        </header>

        <div className={styles.content}>
          <p className={styles.lead}>
            <TypedText
              text={t.fitting.lead}
              state={getState(0)}
              speed={65}
              startDelay={300}
              endDelay={650}
              onComplete={() => completeStep(0)}
            />
          </p>

          <div className={styles.fitVisual} aria-hidden="true">
            <span className={styles.shapeOuter} />
            <span className={styles.shapeMiddle} />
            <span className={styles.shapeInner} />
          </div>

          <p className={styles.text}>
            <TypedText
              text={t.fitting.text}
              state={getState(1)}
              speed={48}
              startDelay={300}
              endDelay={700}
              onComplete={() => completeStep(1)}
            />
          </p>

          <p className={styles.final}>
            <TypedText
              text={t.fitting.final}
              state={getState(2)}
              speed={52}
              startDelay={350}
              endDelay={500}
              onComplete={() => completeStep(2)}
            />
          </p>
        </div>
      </Container>
    </section>
  )
}

export default Fitting