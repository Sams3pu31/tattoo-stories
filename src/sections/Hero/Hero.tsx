import heroHorizontal from '../../assets/images/hero/optimized/hero-horizontal-optimized.jpg'
import heroVertical from '../../assets/images/hero/optimized/hero-vertical-optimized.jpg'
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
            <div className={styles.frame}>
                <picture className={styles.picture}>
                    <source
                        media="(max-width: 767px)"
                        srcSet={heroVertical}
                    />

                    <img
                        className={styles.image}
                        src={heroHorizontal}
                        alt=""
                        aria-hidden="true"
                        fetchPriority="high"
                    />
                </picture>

                <div
                    className={styles.overlay}
                    aria-hidden="true"
                />

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
            </div>
        </section>
    )
}

export default Hero