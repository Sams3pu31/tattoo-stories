import Container from '../../components/ui/Container/Container'

import { useLanguage } from '../../hooks/useLanguage'

import heroImage from '../../assets/images/hero/hero-reference.jpg'

import styles from './Hero.module.scss'


function Hero() {
  const { t } = useLanguage()

  return (
    <section
      className={styles.hero}
      id="hero"
      aria-labelledby="hero-title"
    >
      <div
        className={styles.visual}
        aria-hidden="true"
      >
        <img
          className={styles.image}
          src={heroImage}
          alt=""
          fetchPriority="high"
        />

        <div className={styles.imageOverlay} />
      </div>

      <Container className={styles.container}>
        <div className={styles.content}>
          <div
            className={styles.logoPlaceholder}
            aria-hidden="true"
          >
            TS
          </div>

          <h1
            className={styles.title}
            id="hero-title"
          >
            <span>{t.hero.title}</span>

            <span className={styles.titleSecondary}>
              {t.hero.subtitle}
            </span>
          </h1>

          <p className={styles.caption}>
            <span>{t.hero.aboutPeople}</span>

            <span
              className={styles.captionDots}
              aria-hidden="true"
            >
              •••
            </span>

            <span>{t.hero.forPeople}</span>
          </p>
        </div>
      </Container>
    </section>
  )
}


export default Hero