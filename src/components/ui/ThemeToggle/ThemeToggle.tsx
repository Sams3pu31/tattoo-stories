import { useId } from 'react'

import type {
  ThemeMode,
} from '../../../context/ThemeContext'

import { useLanguage } from '../../../hooks/useLanguage'
import { useTheme } from '../../../hooks/useTheme'

import styles from './ThemeToggle.module.scss'


type ThemeOption = {
  value: ThemeMode
  icon: string
}


const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    icon: '☀',
  },
  {
    value: 'system',
    icon: '◐',
  },
  {
    value: 'dark',
    icon: '☾',
  },
]


function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()

  const labelId = useId()


  const getThemeLabel = (
    value: ThemeMode,
  ): string => {
    switch (value) {
      case 'light':
        return t.common.themeLight

      case 'dark':
        return t.common.themeDark

      case 'system':
      default:
        return t.common.themeSystem
    }
  }


  return (
    <div
      className={styles.toggle}
      role="group"
      aria-labelledby={labelId}
    >
      <span
        className={styles.label}
        id={labelId}
      >
        {t.common.theme}
      </span>

      <div className={styles.options}>
        {themeOptions.map((option) => {
          const isActive =
            theme === option.value

          return (
            <button
              key={option.value}
              className={styles.button}
              type="button"
              aria-label={getThemeLabel(
                option.value,
              )}
              aria-pressed={isActive}
              data-active={
                isActive || undefined
              }
              onClick={() =>
                setTheme(option.value)
              }
            >
              <span aria-hidden="true">
                {option.icon}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}


export default ThemeToggle