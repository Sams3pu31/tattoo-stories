import { useEffect, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import TypedText from '../../components/ui/TypedText/TypedText'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Session.module.scss'

type SessionStage =
  | 'waiting'
  | 'lead'
  | 'comfort'
  | 'final'
  | 'complete'

function Session() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.12)
  const [stage, setStage] = useState<SessionStage>('waiting')

  useEffect(() => {
    if (isInView) {
      setStage((current) =>
        current === 'waiting' ? 'lead' : current,
      )
      return
    }

    setStage('waiting')
  }, [isInView])

  return (
    <section
      ref={ref}
      className={styles.session}
      id="session"
      aria-labelledby="session-title"
      data-stage={stage}
    >
      <Container className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>
            {t.session.eyebrow}
          </span>

          <h2
            className={styles.title}
            id="session-title"
          >
            {t.session.title}
          </h2>
        </header>

        <div className={styles.content}>
          <p className={styles.lead}>
            <TypedText
              text={t.session.lead}
              state={
                stage === 'waiting'
                  ? 'waiting'
                  : stage === 'lead'
                    ? 'active'
                    : 'complete'
              }
              speed={38}
              startDelay={180}
              endDelay={300}
              onComplete={() => setStage('comfort')}
            />
          </p>

          <div className={styles.comfort}>
            <div
              className={styles.breath}
              aria-hidden="true"
            >
              <span className={styles.ringOuter} />
              <span className={styles.ringMiddle} />
              <span className={styles.ringInner} />
              <span className={styles.core} />
            </div>

            <p className={styles.text}>
              <TypedText
                text={t.session.text}
                state={
                  stage === 'comfort'
                    ? 'active'
                    : stage === 'final' ||
                        stage === 'complete'
                      ? 'complete'
                      : 'waiting'
                }
                speed={32}
                startDelay={160}
                endDelay={350}
                onComplete={() => setStage('final')}
              />
            </p>
          </div>

          <p className={styles.final}>
            <TypedText
              text={t.session.final}
              state={
                stage === 'final'
                  ? 'active'
                  : stage === 'complete'
                    ? 'complete'
                    : 'waiting'
              }
              speed={42}
              startDelay={250}
              endDelay={250}
              onComplete={() => setStage('complete')}
            />
          </p>
        </div>
      </Container>
    </section>
  )
}

export default Session