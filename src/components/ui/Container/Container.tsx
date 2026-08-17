import type { ReactNode } from 'react'

import styles from './Container.module.scss'

type ContainerProps = {
  children: ReactNode
  className?: string
}

function Container({
  children,
  className = '',
}: ContainerProps) {
  const classes = [
    styles.container,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

export default Container