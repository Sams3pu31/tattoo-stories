import { useId } from 'react'

import {
  type ThemeMode,
} from '../../../context/ThemeContext'
import { useTheme } from '../../../hooks/useTheme'

import styles from './ThemeToggle.module.scss'

type ThemeOption = {
  value: ThemeMode
  icon: string
  label: string
}

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    icon: '☀',
    label: 'Светлая тема',
  },
  {
    value: 'system',
    icon: '◐',
    label: 'Системная тема',
  },
  {
    value: 'dark',
    icon: '☾',
    label: 'Тёмная тема',
  },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const labelId = useId()

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
        Тема
      </span>

      <div className={styles.options}>
        {themeOptions.map((option) => {
          const isActive = theme === option.value

          return (
            <button
              key={option.value}
              className={styles.button}
              type="button"
              aria-label={option.label}
              aria-pressed={isActive}
              data-active={isActive || undefined}
              onClick={() => setTheme(option.value)}
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