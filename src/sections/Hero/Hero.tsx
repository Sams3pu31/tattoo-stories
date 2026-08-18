import heroImage from '../../assets/images/hero/hero-reference.jpg'
import Container from '../../components/ui/Container/Container'
import LogoMark from '../../components/ui/LogoMark/LogoMark'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Hero.module.scss'

function Hero() {
  const { t } = useLanguage()

  return (
    <section
      className={styles.hero}
      id="top"
      aria-labelledby="hero-title"
    >
      <div className={styles.visual} aria-hidden="true">
        <img
          src={heroImage}
          alt=""
          fetchPriority="high"
        />
        <div className={styles.overlay} />
      </div>

      <Container className={styles.container}>
        <div className={styles.content}>
          <LogoMark
            className={styles.heroLogo}
            tone="white"
          />

          <h1
            className={styles.title}
            id="hero-title"
          >
            <span>{t.hero.title}</span>
            <span>{t.hero.subtitle}</span>
          </h1>

          <div className={styles.subtitle}>
            <span>{t.hero.aboutPeople}</span>
            <span aria-hidden="true">···</span>
            <span>{t.hero.forPeople}</span>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero