import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import TypedText from '../../components/ui/TypedText/TypedText'

import {
  useInView,
} from '../../hooks/useInView'

import {
  useScrollProgress,
} from '../../hooks/useScrollProgress'

import {
  useTypingSequence,
  type TypingState,
} from '../../hooks/useTypingSequence'

import styles from './FoundationTimeline.module.scss'


type FoundationTimelineProps = {
  lead: string
  paragraphs: string[]
}


// ========================================
// FOUNDATION TYPING
// ========================================

const NORMAL_SPEED = 30

/*
 * Если шарик сам дошёл
 * до соответствующего текста —
 * текст начинает печататься заметно быстрее.
 */
const SCROLL_SPEED = 16


function FoundationTimeline({
  lead,
  paragraphs,
}: FoundationTimelineProps) {
  const textCount =
    paragraphs.length + 1


  // ======================================
  // VISIBILITY
  // ======================================

  const {
    ref: visibilityRef,
    isInView,
  } =
    useInView<HTMLDivElement>(
      0.04,
    )


  // ======================================
  // VISUAL ELEMENT REFS
  // ======================================

  const trackRef =
    useRef<HTMLDivElement>(null)


  const textBlockRefs =
    useRef<
      Array<
        HTMLDivElement | null
      >
    >([])


  // ======================================
  // UNLOCK STATE
  //
  // autoUnlocked:
  // текст разрешается со временем.
  //
  // scrollUnlocked:
  // текст разрешает шарик.
  // ======================================

  const [
    autoUnlockedIndex,
    setAutoUnlockedIndex,
  ] =
    useState(-1)


  const [
    scrollUnlockedIndex,
    setScrollUnlockedIndex,
  ] =
    useState(-1)


  const scrollUnlockedRef =
    useRef(-1)


  // ======================================
  // SEQUENCE
  // ======================================

  const {
    activeIndex,
    completeStep,
  } =
    useTypingSequence(
      isInView,
      textCount,
    )


  // ======================================
  // BALL REACHED TEXT
  // ======================================

  const handleScrollProgress =
    useCallback(
      (
        progress: number,
      ) => {
        const track =
          trackRef.current


        if (!track) {
          return
        }


        const trackRect =
          track.getBoundingClientRect()


        /*
         * Фактическая координата шарика
         * внутри viewport.
         */
        const dotY =
          trackRect.top +
          trackRect.height *
            progress


        let reachedIndex =
          -1


        textBlockRefs.current.forEach(
          (
            block,
            index,
          ) => {
            if (!block) {
              return
            }


            const blockRect =
              block.getBoundingClientRect()


            /*
             * Триггерим не по центру текста,
             * а когда шарик только входит
             * в его верхнюю часть.
             */
            const triggerY =
              blockRect.top +
              Math.min(
                24,
                blockRect.height *
                  0.2,
              )


            if (
              dotY >= triggerY
            ) {
              reachedIndex =
                index
            }
          },
        )


        if (
          reachedIndex <=
          scrollUnlockedRef.current
        ) {
          return
        }


        scrollUnlockedRef.current =
          reachedIndex


        setScrollUnlockedIndex(
          reachedIndex,
        )
      },
      [],
    )


  // ======================================
  // SCROLL PROGRESS
  // ======================================

  const timelineRef =
    useScrollProgress<HTMLDivElement>(
      handleScrollProgress,
    )


  // ======================================
  // COMBINE REFS
  // ======================================

  const setTimelineRef =
    useCallback(
      (
        element:
          | HTMLDivElement
          | null,
      ) => {
        timelineRef.current =
          element

        visibilityRef.current =
          element
      },
      [
        timelineRef,
        visibilityRef,
      ],
    )


  // ======================================
  // AUTO MODE
  //
  // Если пользователь просто остановился
  // на Foundation и не двигает страницу,
  // текст всё равно постепенно открывается.
  //
  // Но TypedText дополнительно проверяет,
  // что конкретный абзац действительно
  // находится в viewport.
  // ======================================

  useEffect(() => {
    if (!isInView) {
      setAutoUnlockedIndex(
        -1,
      )

      setScrollUnlockedIndex(
        -1,
      )

      scrollUnlockedRef.current =
        -1

      return
    }


    const timers =
      Array.from(
        {
          length:
            textCount,
        },
        (
          _,
          index,
        ) =>
          window.setTimeout(
            () => {
              setAutoUnlockedIndex(
                (
                  current,
                ) =>
                  Math.max(
                    current,
                    index,
                  ),
              )
            },

            /*
             * Первый текст почти сразу.
             *
             * Следующие постепенно
             * разрешаются со временем.
             */
            450 +
              index *
                1250,
          ),
      )


    return () => {
      timers.forEach(
        (timer) => {
          window.clearTimeout(
            timer,
          )
        },
      )
    }
  }, [
    isInView,
    textCount,
  ])


  // ======================================
  // CURRENT AVAILABLE TEXT
  // ======================================

  const unlockedIndex =
    Math.max(
      autoUnlockedIndex,
      scrollUnlockedIndex,
    )


  // ======================================
  // TEXT STATE
  // ======================================

  const getTextState = (
    index: number,
  ): TypingState => {
    if (!isInView) {
      return 'waiting'
    }


    if (
      index <
      activeIndex
    ) {
      return 'complete'
    }


    if (
      index === activeIndex &&
      index <= unlockedIndex
    ) {
      return 'active'
    }


    return 'waiting'
  }


  // ======================================
  // SPEED
  // ======================================

  const getTextSpeed = (
    index: number,
  ) => {
    /*
     * Если до этого текста уже
     * физически доехал шарик —
     * печать ускоряется.
     */
    if (
      index <=
      scrollUnlockedIndex
    ) {
      return SCROLL_SPEED
    }


    return NORMAL_SPEED
  }


  return (
    <div
      ref={setTimelineRef}
      className={styles.timeline}
    >
      <div
        ref={trackRef}
        className={styles.track}
        aria-hidden="true"
      >
        <span
          className={
            styles.trackProgress
          }
        />

        <span
          className={styles.dot}
        />
      </div>


      {/* =================================
          FIRST TEXT
      ================================= */}

      <div
        ref={(element) => {
          textBlockRefs.current[
            0
          ] = element
        }}
        className={
          styles.textBlock
        }
      >
        <p
          className={styles.lead}
        >
          <TypedText
            text={lead}
            state={
              getTextState(0)
            }
            speed={
              getTextSpeed(0)
            }
            startDelay={100}
            endDelay={260}
            onComplete={() => {
              completeStep(0)
            }}
          />
        </p>
      </div>


      {/* =================================
          NEXT TEXTS
      ================================= */}

      {paragraphs.map(
        (
          paragraph,
          index,
        ) => {
          const stepIndex =
            index + 1


          return (
            <div
              className={
                styles.group
              }
              key={`${index}-${paragraph}`}
            >
              <div
                className={
                  styles.spacer
                }
                aria-hidden="true"
              />


              <div
                ref={(element) => {
                  textBlockRefs.current[
                    stepIndex
                  ] = element
                }}
                className={
                  styles.textBlock
                }
              >
                <p
                  className={
                    styles.paragraph
                  }
                >
                  <TypedText
                    text={paragraph}
                    state={
                      getTextState(
                        stepIndex,
                      )
                    }
                    speed={
                      getTextSpeed(
                        stepIndex,
                      )
                    }
                    startDelay={100}
                    endDelay={280}
                    onComplete={() => {
                      completeStep(
                        stepIndex,
                      )
                    }}
                  />
                </p>
              </div>
            </div>
          )
        },
      )}
    </div>
  )
}


export default FoundationTimeline