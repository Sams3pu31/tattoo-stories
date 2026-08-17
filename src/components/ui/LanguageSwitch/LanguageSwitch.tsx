import { useId } from 'react'

import { useLanguage } from '../../../hooks/useLanguage'

import type { Language } from '../../../locales/types'

import styles from './LanguageSwitch.module.scss'

type LanguageOption = {
  value: Language
  label: string
}

const languages: LanguageOption[] = [
  {
    value: 'ru',
    label: 'RU',
  },
  {
    value: 'en',
    label: 'EN',
  },
]

function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage()
  const labelId = useId()

  return (
    <div
      className={styles.switcher}
      role="group"
      aria-labelledby={labelId}
    >
      <span
        className={styles.label}
        id={labelId}
      >
        {t.common.language}
      </span>

      {languages.map((item) => {
        const isActive = language === item.value

        return (
          <button
            key={item.value}
            className={styles.button}
            type="button"
            aria-pressed={isActive}
            data-active={isActive || undefined}
            onClick={() => setLanguage(item.value)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitch