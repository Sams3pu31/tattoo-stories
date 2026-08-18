import { useEffect, useId, useState } from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll'
import Container from '../../ui/Container/Container'
import LanguageSwitch from '../../ui/LanguageSwitch/LanguageSwitch'
import MobileMenu from '../MobileMenu/MobileMenu'
import Navigation from '../Navigation/Navigation'
import styles from './Header.module.scss'

function Header() {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuId = useId()

  useLockBodyScroll(isMenuOpen)

  const closeMenu = () => setIsMenuOpen(false)
  const toggleMenu = () => setIsMenuOpen((current) => !current)

  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  return (
    <>
      <header
        className={styles.header}
        data-menu-open={isMenuOpen || undefined}
      >
        <Container className={styles.container}>
          <div className={styles.language}>
            <LanguageSwitch />
          </div>

          <div className={styles.navigation}>
            <Navigation />
          </div>

          <button
            className={styles.menuButton}
            type="button"
            aria-label={
              isMenuOpen
                ? t.common.closeMenu
                : t.common.openMenu
            }
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            data-open={isMenuOpen || undefined}
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </Container>
      </header>

      <MobileMenu
        id={menuId}
        isOpen={isMenuOpen}
        onClose={closeMenu}
      />
    </>
  )
}

export default Header