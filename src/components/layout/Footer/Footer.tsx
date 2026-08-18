import { useLanguage } from '../../../hooks/useLanguage'
import LogoMark from '../../ui/LogoMark/LogoMark'
import styles from './Footer.module.scss'

function Footer() {
  const { t } = useLanguage()

  const links = [
    { href: '#intro', label: t.navigation.intro },
    { href: '#foundation', label: t.navigation.foundation },
    { href: '#fitting', label: t.navigation.fitting },
    { href: '#session', label: t.navigation.session },
    { href: '#reviews', label: t.navigation.reviews },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.name}>
              Tattoo Stories
            </span>

            <LogoMark
              className={styles.logo}
              tone="white"
            />

            <span className={styles.tagline}>
              Истории через тату
            </span>
          </div>

          <nav
            className={styles.navigation}
            aria-label={t.common.mainNavigation}
          >
            {links.map((link) => (
              <a
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            className={styles.booking}
            href="#booking"
          >
            <span>{t.common.booking}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} Tattoo Stories
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer