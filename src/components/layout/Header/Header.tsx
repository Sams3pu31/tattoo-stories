import Container from '../../ui/Container/Container'
import LanguageSwitch from '../../ui/LanguageSwitch/LanguageSwitch'
import ThemeToggle from '../../ui/ThemeToggle/ThemeToggle'

import Navigation from '../Navigation/Navigation'

import { useLanguage } from '../../../hooks/useLanguage'

import styles from './Header.module.scss'


function Header() {
  const { t } = useLanguage()

  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <div className={styles.logo}>
          Tattoo Stories
        </div>

        <Navigation />

        <div className={styles.actions}>
          <LanguageSwitch />

          <ThemeToggle />

          <button
            className={styles.menuButton}
            type="button"
            aria-label={t.common.openMenu}
          >
            <span />
            <span />
          </button>
        </div>
      </Container>
    </header>
  )
}


export default Header