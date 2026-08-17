import {
  useLanguage,
} from '../../../hooks/useLanguage'

import styles from './LanguageSwitch.module.scss'


function LanguageSwitch() {
  const {
    language,
    setLanguage,
    t,
  } = useLanguage()


  return (
    <div
      className={styles.switch}
      role="group"
      aria-label={t.common.language}
    >
      <button
        className={styles.button}
        type="button"
        aria-label="Русский"
        aria-pressed={
          language === 'ru'
        }
        data-active={
          language === 'ru' ||
          undefined
        }
        onClick={() => {
          setLanguage('ru')
        }}
      >
        RU
      </button>

      <button
        className={styles.button}
        type="button"
        aria-label="English"
        aria-pressed={
          language === 'en'
        }
        data-active={
          language === 'en' ||
          undefined
        }
        onClick={() => {
          setLanguage('en')
        }}
      >
        EN
      </button>
    </div>
  )
}


export default LanguageSwitch