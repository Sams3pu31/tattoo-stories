import Container from '../../components/ui/Container/Container'

import { useLanguage } from '../../hooks/useLanguage'

import styles from './Intro.module.scss'


function Intro() {
  const { t } = useLanguage()

  return (
    <section
      className={styles.intro}
      id="intro"
      aria-labelledby="intro-title"
    >
      <Container className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            {t.intro.eyebrow}
          </span>

          <h2
            className={styles.title}
            id="intro-title"
          >
            {t.intro.title}
          </h2>
        </div>

        <div className={styles.content}>
          <p className={styles.lead}>
            {t.intro.lead}
          </p>

          <p className={styles.text}>
            {t.intro.text}
          </p>

          <p className={styles.note}>
            {t.intro.note}
          </p>
        </div>
      </Container>
    </section>
  )
}


export default Intro