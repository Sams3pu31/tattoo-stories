import {
  useTheme,
} from '../../../hooks/useTheme'

import {
  useLanguage,
} from '../../../hooks/useLanguage'

import styles from './ThemeToggle.module.scss'


function ThemeToggle() {
  const {
    theme,
    setTheme,
  } = useTheme()

  const { t } =
    useLanguage()


  return (
    <div
      className={styles.toggle}
      role="group"
      aria-label={t.common.theme}
    >
      <button
        className={styles.button}
        type="button"
        aria-label={
          t.common.themeLight
        }
        aria-pressed={
          theme === 'light'
        }
        data-active={
          theme === 'light' ||
          undefined
        }
        onClick={() => {
          setTheme('light')
        }}
      >
        ☀
      </button>

      <button
        className={styles.button}
        type="button"
        aria-label={
          t.common.themeDark
        }
        aria-pressed={
          theme === 'dark'
        }
        data-active={
          theme === 'dark' ||
          undefined
        }
        onClick={() => {
          setTheme('dark')
        }}
      >
        ☾
      </button>
    </div>
  )
}


export default ThemeToggle