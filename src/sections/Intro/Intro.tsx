import { useEffect, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Intro.module.scss'

function Intro() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.12)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (isInView) setRevealed(true)
  }, [isInView])

  return (
    <section
      ref={ref}
      className={styles.intro}
      id="intro"
      aria-labelledby="intro-title"
      data-visible={revealed || undefined}
    >
      <Container className={styles.container}>
        <h2 className={styles.title} id="intro-title">
          {t.intro.eyebrow}
        </h2>

        <div className={styles.body}>
          <p className={styles.name}>{t.intro.title}</p>
          <p className={styles.lead}>{t.intro.lead}</p>
        </div>

        <div className={styles.topics}>
          {t.intro.text
            .split('\n')
            .filter(Boolean)
            .map((topic) => (
              <p key={topic}>{topic}</p>
            ))}
          <p className={styles.topicWrapped}>{t.intro.note}</p>
        </div>
      </Container>
    </section>
  )
}

export default Intro