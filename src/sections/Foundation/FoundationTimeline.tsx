import {
  useScrollProgress,
} from '../../hooks/useScrollProgress'

import styles from './FoundationTimeline.module.scss'


type FoundationTimelineProps = {
  lead: string
  paragraphs: string[]
}


function FoundationTimeline({
  lead,
  paragraphs,
}: FoundationTimelineProps) {
  const timelineRef =
    useScrollProgress<HTMLDivElement>()

  return (
    <div
      ref={timelineRef}
      className={styles.timeline}
    >
      <div
        className={styles.track}
        aria-hidden="true"
      >
        <span
          className={styles.trackProgress}
        />

        <span
          className={styles.dot}
        />
      </div>

      <div className={styles.textBlock}>
        <p className={styles.lead}>
          {lead}
        </p>
      </div>

      {paragraphs.map((paragraph, index) => (
        <div
          className={styles.group}
          key={`${index}-${paragraph}`}
        >
          <div
            className={styles.spacer}
            aria-hidden="true"
          />

          <div className={styles.textBlock}>
            <p className={styles.paragraph}>
              {paragraph}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}


export default FoundationTimeline