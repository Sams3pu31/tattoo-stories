import {
  useEffect,
  useState,
} from 'react'

import Container from '../../components/ui/Container/Container'
import TypedText from '../../components/ui/TypedText/TypedText'

import {
  useInView,
} from '../../hooks/useInView'

import {
  useLanguage,
} from '../../hooks/useLanguage'

import styles from './Sketch.module.scss'


type SketchStage =
  | 'waiting'
  | 'lead'
  | 'ink'
  | 'text'
  | 'complete'


function Sketch() {
  const { t } =
    useLanguage()


  const {
    ref,
    isInView,
  } =
    useInView<HTMLElement>(
      0.2,
    )


  const [
    stage,
    setStage,
  ] =
    useState<SketchStage>(
      'waiting',
    )


  // ======================================
  // START / RESET
  // ======================================

  useEffect(() => {
    if (isInView) {
      setStage(
        (current) =>
          current === 'waiting'
            ? 'lead'
            : current,
      )

      return
    }


    setStage('waiting')
  }, [isInView])


  // ======================================
  // AFTER INK
  // ======================================

  useEffect(() => {
    if (stage !== 'ink') {
      return
    }


    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      )


    if (reducedMotion.matches) {
      setStage('text')

      return
    }


    const timer =
      window.setTimeout(
        () => {
          setStage('text')
        },
        1650,
      )


    return () => {
      window.clearTimeout(
        timer,
      )
    }
  }, [stage])


  return (
    <section
      ref={ref}
      className={styles.sketch}
      id="sketch"
      aria-labelledby="sketch-title"
      data-stage={stage}
    >
      <Container
        className={styles.container}
      >
        <header
          className={styles.heading}
        >
          <span
            className={styles.eyebrow}
          >
            {t.sketch.eyebrow}
          </span>

          <h2
            className={styles.title}
            id="sketch-title"
          >
            {t.sketch.title}
          </h2>
        </header>


        <div
          className={styles.content}
        >
          <p
            className={styles.lead}
          >
            <TypedText
              text={t.sketch.lead}
              state={
                stage === 'waiting'
                  ? 'waiting'
                  : stage === 'lead'
                    ? 'active'
                    : 'complete'
              }
              startDelay={160}
              endDelay={300}
              onComplete={() => {
                setStage('ink')
              }}
            />
          </p>


          <div
            className={styles.ink}
            aria-hidden="true"
          >
            <svg
              className={styles.inkSvg}
              viewBox="0 0 50 180"
              fill="none"
            >
              <path
                className={
                  styles.inkPath
                }
                d="
                  M25 2
                  C18 28 31 43 24 67
                  C18 88 31 103 25 126
                  C21 143 27 158 25 174
                "
              />

              <circle
                className={
                  styles.inkDot
                }
                cx="25"
                cy="174"
                r="4"
              />
            </svg>
          </div>


          <p
            className={styles.text}
          >
            <TypedText
              text={t.sketch.text}
              state={
                stage === 'text'
                  ? 'active'
                  : stage === 'complete'
                    ? 'complete'
                    : 'waiting'
              }
              startDelay={160}
              endDelay={280}
              onComplete={() => {
                setStage(
                  'complete',
                )
              }}
            />
          </p>
        </div>
      </Container>
    </section>
  )
}


export default Sketch