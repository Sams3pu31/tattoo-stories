import type { Story } from '../../data/stories'
import { useLanguage } from '../../hooks/useLanguage'

import styles from './Stories.module.scss'

type StoryCardProps = {
  story: Story
}

function StoryCard({
  story,
}: StoryCardProps) {
  const { t } = useLanguage()

  return (
    <article className={styles.card}>
      <div className={styles.category}>
        {t.stories.categories[story.categoryKey]}
      </div>

      <div className={styles.media}>
        <img
          className={styles.image}
          src={story.image}
          alt={t.stories.captions[story.captionKey]}
          loading="lazy"
          decoding="async"
        />

        <span
          className={styles.number}
          aria-hidden="true"
        >
          {story.number}
        </span>
      </div>

      <p className={styles.caption}>
        {t.stories.captions[story.captionKey]}
      </p>
    </article>
  )
}

export default StoryCard