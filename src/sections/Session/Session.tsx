import { useEffect, useMemo, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import { useInView } from '../../hooks/useInView'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Session.module.scss'

function Session() {
  const { t } = useLanguage()
  const { ref, isInView } = useInView<HTMLElement>(0.12)
  const [revealed, setRevealed] = useState(false)
  const [enabled, setEnabled] = useState(false)

  const text = useMemo(() => {
    const [comfort = '', details = '', extra = ''] = t.session.text.split('\n\n')
    const comfortLines = comfort.split('\n')
    const accent = comfortLines.pop() ?? ''

    return {
      comfort: comfortLines.join('\n'),
      accent,
      details,
      extra,
    }
  }, [t.session.text])

  useEffect(() => {
    if (!isInView || revealed) return

    setRevealed(true)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reducedMotion.matches) {
      setEnabled(true)
      return
    }

    const timer = window.setTimeout(() => setEnabled(true), 950)

    return () => window.clearTimeout(timer)
  }, [isInView, revealed])

  return (
    <section
      ref={ref}
      className={styles.session}
      id="session"
      aria-labelledby="session-title"
      data-visible={revealed || undefined}
      data-enabled={enabled || undefined}
    >
      <Container className={styles.container}>
        <h2 className={styles.sectionTitle} id="session-title">
          {t.session.eyebrow}
        </h2>

        <div className={styles.system}>
          <p className={styles.qualities}>{t.session.title}</p>

          <div
            className={styles.switchArea}
            data-ink-anchor="session-switch"
          >
            <div
              className={styles.switch}
              role="img"
              aria-label={enabled ? 'ON' : 'OFF'}
            >
              <span className={styles.switchLabelOff}>OFF</span>
              <span className={styles.switchLabelOn}>ON</span>
              <span className={styles.switchKnob} />
            </div>
          </div>

          <p className={styles.defaults}>{t.session.lead}</p>
        </div>

        <div className={styles.comfort}>
          <p className={styles.comfortText}>{text.comfort}</p>
          <p className={styles.comfortAccent}>{text.accent}</p>
        </div>

        <div className={styles.details}>
          <p>{text.details}</p>
          <p>{text.extra}</p>
        </div>

        <p
          className={styles.final}
          data-ink-anchor="session-final"
        >
          {t.session.final}
        </p>
      </Container>
    </section>
  )
}

export default Session