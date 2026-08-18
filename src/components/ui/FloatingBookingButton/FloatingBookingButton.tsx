import { useLanguage } from '../../../hooks/useLanguage'
import styles from './FloatingBookingButton.module.scss'

function FloatingBookingButton() {
  const { t } = useLanguage()

  return (
    <a
      className={styles.button}
      href="#booking"
      aria-label={t.common.booking}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 3 9.4 14.6M21 3l-7.3 18-4.3-6.4L3 10.3 21 3Z" />
      </svg>
    </a>
  )
}

export default FloatingBookingButton