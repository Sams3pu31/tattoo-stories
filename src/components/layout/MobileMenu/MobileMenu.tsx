import { navigation } from '../../../data/navigation'
import { useLanguage } from '../../../hooks/useLanguage'
import styles from './MobileMenu.module.scss'

type MobileMenuProps = {
  id: string
  isOpen: boolean
  onClose: () => void
}

function MobileMenu({ id, isOpen, onClose }: MobileMenuProps) {
  const { t } = useLanguage()

  return (
    <div
      className={styles.menu}
      id={id}
      data-open={isOpen || undefined}
      aria-hidden={!isOpen}
    >
      <nav
        className={styles.navigation}
        aria-label={t.common.mobileNavigation}
      >
        <ul className={styles.list}>
          {navigation.map((item, index) => (
            <li className={styles.item} key={item.id}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>

              <a
                className={styles.link}
                href={item.href}
                onClick={onClose}
              >
                {t.navigation[item.labelKey]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default MobileMenu