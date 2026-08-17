import Container from '../../ui/Container/Container'
import ThemeToggle from '../../ui/ThemeToggle/ThemeToggle'

import styles from './Header.module.scss'

function Header() {
  return (
    <header className={styles.header}>
      <Container className={styles.container}>
        <div className={styles.logo}>
          Tattoo Stories
        </div>

        <div className={styles.actions}>
          <ThemeToggle />

          <button
            className={styles.menuButton}
            type="button"
            aria-label="Открыть меню"
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