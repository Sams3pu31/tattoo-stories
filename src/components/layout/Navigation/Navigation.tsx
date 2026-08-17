import { navigation } from '../../../data/navigation'
import { useLanguage } from '../../../hooks/useLanguage'
import styles from './Navigation.module.scss'

function Navigation() {
  const { t } = useLanguage()

  return (
    <nav
      className={styles.navigation}
      aria-label={t.common.mainNavigation}
    >
      <ul className={styles.list}>
        {navigation.map((item) => (
          <li key={item.id}>
            <a className={styles.link} href={item.href}>
              {t.navigation[item.labelKey]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation