import {
  forwardRef,
} from 'react'
import styles from './InkSplash.module.scss'

const InkSplash =
  forwardRef<
    SVGSVGElement
  >(
    function InkSplash(
      _,
      ref,
    ) {
      return (
        <svg
          ref={ref}
          className={
            styles.splash
          }
          viewBox="0 0 96 54"
          aria-hidden="true"
        >
          <path
            data-splash-base
            className={
              styles.base
            }
            d="
              M24 37
              C30 32 38 33 43 35
              C47 31 53 31 57 35
              C63 32 70 33 73 37
              C65 40 31 41 24 37
              Z
            "
          />

          <path
            data-splash-particle
            className={
              styles.particle
            }
            d="
              M48 34
              C45.5 29 46.5 25 48 22
              C49.8 25 50.7 29 48 34
              Z
            "
          />

          <path
            data-splash-particle
            className={
              styles.particle
            }
            d="
              M48 34
              C45.8 30 46.5 27 48 24
              C49.6 27 50.3 30 48 34
              Z
            "
          />

          <circle
            data-splash-particle
            className={
              styles.dot
            }
            cx="48"
            cy="34"
            r="2"
          />

          <path
            data-splash-particle
            className={
              styles.particle
            }
            d="
              M48 34
              C46 30 46.8 27 48 25
              C49.4 27 50.1 30 48 34
              Z
            "
          />

          <circle
            data-splash-particle
            className={
              styles.dot
            }
            cx="48"
            cy="34"
            r="1.6"
          />

          <path
            data-splash-particle
            className={
              styles.particle
            }
            d="
              M48 34
              C46.2 31 46.8 28 48 26
              C49.3 28 49.8 31 48 34
              Z
            "
          />
        </svg>
      )
    },
  )

export default InkSplash