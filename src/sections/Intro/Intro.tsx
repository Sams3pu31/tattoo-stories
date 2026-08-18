import {
  Fragment,
  useEffect,
  useState,
} from 'react'
import Container from '../../components/ui/Container/Container'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Intro.module.scss'

function Intro() {
  const { t } = useLanguage()

  const {
    ref,
    isInView,
  } =
    useInView<HTMLElement>(
      0.12,
    )

  const [
    revealed,
    setRevealed,
  ] =
    useState(false)

  useEffect(() => {
    if (isInView) {
      setRevealed(true)
    }
  }, [isInView])

  const lines =
    t.intro.note
      .split('\n')
      .filter(Boolean)

  const topics =
    lines.length >= 4
      ? [
          lines[0],
          lines[1],
          lines
            .slice(2)
            .join('\n'),
        ]
      : lines

  return (
    <section
      ref={ref}
      className={styles.intro}
      id="intro"
      aria-labelledby="intro-title"
      data-visible={
        revealed || undefined
      }
    >
      <Container
        className={
          styles.container
        }
      >
        <h2
          className={styles.title}
          id="intro-title"
          data-ink-anchor="intro-title"
        >
          {t.intro.title}
        </h2>

        <div
          className={styles.body}
        >
          <p
            className={styles.name}
          >
            {t.intro.lead}
          </p>

          <p
            className={styles.lead}
          >
            {t.intro.text}
          </p>
        </div>

        <div
          className={styles.topics}
        >
          {topics.map(
            (
              topic,
              index,
            ) => {
              const topicLines =
                topic.split('\n')

              const isLastTopic =
                index ===
                topics.length - 1

              return (
                <p
                  key={`${topic}-${index}`}
                  data-ink-intro-line={
                    index
                  }
                >
                  {topicLines.map(
                    (
                      line,
                      lineIndex,
                    ) => {
                      const isLastLine =
                        lineIndex ===
                        topicLines.length - 1

                      const isFinalName =
                        isLastTopic &&
                        isLastLine

                      return (
                        <Fragment
                          key={`${line}-${lineIndex}`}
                        >
                          {isFinalName ? (
                            <span
                              data-ink-anchor="intro-name"
                            >
                              {line}
                            </span>
                          ) : (
                            line
                          )}

                          {!isLastLine && (
                            <br />
                          )}
                        </Fragment>
                      )
                    },
                  )}
                </p>
              )
            },
          )}
        </div>
      </Container>
    </section>
  )
}

export default Intro