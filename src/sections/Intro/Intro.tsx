import Container from '../../components/ui/Container/Container'
import TypedText from '../../components/ui/TypedText/TypedText'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import { useTypingSequence } from '../../hooks/useTypingSequence'
import styles from './Intro.module.scss'

function Intro() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.15)
  const { completeStep, getState } = useTypingSequence(isInView, 3)

  return (
    <section
      ref={ref}
      className={styles.intro}
      id="intro"
      aria-labelledby="intro-title"
    >
      <Container className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>
            {t.intro.eyebrow}
          </span>

          <h2 className={styles.title} id="intro-title">
            {t.intro.title}
          </h2>
        </header>

        <div className={styles.content}>
          <p className={styles.lead}>
            <TypedText
              text={t.intro.lead}
              state={getState(0)}
              speed={40}
              startDelay={220}
              endDelay={420}
              onComplete={() => completeStep(0)}
            />
          </p>

          <p className={styles.text}>
            <TypedText
              text={t.intro.text}
              state={getState(1)}
              speed={38}
              startDelay={200}
              endDelay={450}
              onComplete={() => completeStep(1)}
            />
          </p>

          <p className={styles.note}>
            <TypedText
              text={t.intro.note}
              state={getState(2)}
              speed={40}
              startDelay={200}
              endDelay={350}
              onComplete={() => completeStep(2)}
            />
          </p>
        </div>
      </Container>
    </section>
  )
}

export default Intro