import Container from '../../components/ui/Container/Container'

import heroImage from '../../assets/hero.png'

import styles from './Hero.module.scss'

function Hero() {
  return (
    <section
      className={styles.hero}
      id="hero"
      aria-labelledby="hero-title"
    >
      <div className={styles.background} aria-hidden="true">
        <img
          className={styles.image}
          src={heroImage}
          alt=""
          fetchPriority="high"
        />

        <div className={styles.overlay} />
      </div>

      <Container className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logoPlaceholder} aria-hidden="true">
            TS
          </div>

          <h1
            className={styles.title}
            id="hero-title"
          >
            <span>Истории</span>
            <span className={styles.titleSecondary}>через тату</span>
          </h1>

          <p className={styles.caption}>
            <span>про людей</span>

            <span
              className={styles.captionDots}
              aria-hidden="true"
            >
              •••
            </span>

            <span>для людей</span>
          </p>
        </div>
      </Container>
    </section>
  )
}

export default Hero