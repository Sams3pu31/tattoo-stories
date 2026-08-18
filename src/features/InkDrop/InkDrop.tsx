import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import styles from './InkDrop.module.scss'

gsap.registerPlugin(MotionPathPlugin)

type Point = {
  x: number
  y: number
}

type Bounds = {
  left: number
  right: number
  top: number
  bottom: number
}

type Stage = 'waiting-hello' | 'waiting-flow' | 'done'

const DROP_PATH =
  'M22 2C19.8 9.5 5 23.4 5 37.1C5 48.2 12.6 56 22 56C31.4 56 39 48.2 39 37.1C39 23.4 24.2 9.5 22 2Z'

const HELLO_PUDDLE_PATH =
  'M22 26C35 22 43 24 43 30C43 36 34 40 22 40C10 40 1 36 1 30C1 24 9 22 22 26Z'

const BLOB_IDLE_PATH =
  'M22 12C29 10 35 14 36 22C37 30 32 37 25 40C17 42 10 38 8 31C6 23 10 16 17 13C19 12 21 12 22 12Z'

const BLOB_LEFT_PATH =
  'M24 11C31 12 35 17 34 25C33 33 28 39 20 40C13 40 8 34 8 27C8 19 14 12 21 11C22 11 23 11 24 11Z'

const BLOB_RIGHT_PATH =
  'M20 12C27 9 34 13 36 20C38 28 34 35 27 39C19 42 12 38 9 32C6 24 10 17 16 14C17 13 19 12 20 12Z'

const BLOB_IMPACT_LEFT_PATH =
  'M23 16C30 14 35 18 35 24C35 30 30 35 23 36C16 37 10 34 9 29C8 23 12 18 18 16C20 15 22 15 23 16Z'

const BLOB_IMPACT_RIGHT_PATH =
  'M21 16C28 14 34 17 36 23C37 29 33 34 26 36C19 38 12 35 10 30C8 24 11 19 17 16C18 16 20 15 21 16Z'

const HERO_TO_HELLO_REFERENCE_START: Point = {
  x: 195,
  y: 400.66668701171875,
}

const HERO_TO_HELLO_REFERENCE_END: Point = {
  x: 194.3333740234375,
  y: 590.6666870117188,
}

const HERO_TO_HELLO_PATH =
  'M195,400.66668701171875C194.77779134114584,464.00002034505206,194.55558268229166,527.3333536783854,194.3333740234375,590.6666870117188'

const INTRO_REFERENCE_HELLO: Point = {
  x: 194.3333740234375,
  y: 590.6666870117188,
}

const INTRO_PATH_1 =
  'M195,634.6666870117188C194.5555623372396,712.4444580078125,194.11112467447916,791.2222290039062,193.66668701171875,870'

const INTRO_PATH_2 =
  'M193.66668701171875,870C185.4444580078125,866.8888956705729,177.22222900390625,863.7777913411459,169,860.6666870117188,165,871.1111246744791,161,881.5555623372396,157,892,157,898.6666666666666,157,905.3333333333334,157,912'

const INTRO_PATH_3 =
  'M157,912C167.22222900390625,908.6666666666666,177.4444580078125,905.3333333333334,187.66668701171875,902,193.66668701171875,911.5555623372396,199.66668701171875,921.1111246744791,205.66668701171875,930.6666870117188,205.4444580078125,936.6666870117188,205.22222900390625,942.6666870117188,205,948.6666870117188'

const INTRO_PATH_4 =
  'M205,948.6666870117188C202.77779134114584,945.1111246744791,200.55558268229166,941.5555623372396,198.3333740234375,938,195.66670735677084,938,193.00004069010416,938,190.3333740234375,938,188.7778116861979,960.5555623372396,187.22224934895834,982.1111246744791,185.66668701171875,1000.6666870117188,187.66668701171875,1002.2222493489584,189.66668701171875,1003.7778116861979,191.66668701171875,1005.3333740234375'

const COMPACT_SPLASH = [
  { x: -19, y: -5, scale: 0.3, rotation: -40 },
  { x: -15, y: -11, scale: 0.26, rotation: -32 },
  { x: -10, y: -16, scale: 0.22, rotation: -24 },
  { x: -5, y: -19, scale: 0.18, rotation: -14 },
  { x: 1, y: -21, scale: 0.16, rotation: -2 },
  { x: 7, y: -19, scale: 0.18, rotation: 12 },
  { x: 12, y: -16, scale: 0.22, rotation: 22 },
  { x: 16, y: -11, scale: 0.26, rotation: 32 },
  { x: 20, y: -5, scale: 0.3, rotation: 40 },
  { x: -11, y: -3, scale: 0.14, rotation: -16 },
  { x: 12, y: -3, scale: 0.14, rotation: 16 },
  { x: 3, y: -12, scale: 0.12, rotation: 5 },
]

const HELLO_SPLASH = [
  { x: -50, y: -7, scale: 0.74, rotation: -50 },
  { x: -42, y: -20, scale: 0.64, rotation: -41 },
  { x: -32, y: -31, scale: 0.54, rotation: -32 },
  { x: -21, y: -41, scale: 0.45, rotation: -23 },
  { x: -9, y: -48, scale: 0.38, rotation: -12 },
  { x: 2, y: -51, scale: 0.34, rotation: -2 },
  { x: 13, y: -47, scale: 0.38, rotation: 12 },
  { x: 25, y: -40, scale: 0.45, rotation: 23 },
  { x: 36, y: -30, scale: 0.54, rotation: 32 },
  { x: 45, y: -19, scale: 0.64, rotation: 41 },
  { x: 52, y: -6, scale: 0.74, rotation: 50 },
  { x: -31, y: -2, scale: 0.3, rotation: -22 },
  { x: 33, y: -2, scale: 0.3, rotation: 22 },
  { x: -17, y: -24, scale: 0.25, rotation: -12 },
  { x: 18, y: -25, scale: 0.25, rotation: 12 },
  { x: 4, y: -31, scale: 0.22, rotation: 4 },
]

const STREAM_DRIFT = [
  -8,
  6,
  -5,
  4,
  -3,
  2,
  7,
  -6,
  5,
  -4,
  3,
  -7,
  6,
  -2,
  1,
  0,
]

const FRAGMENT_PATHS = [
  'M0-5C3-5 5-2 4 1C4 4 1 6-2 5C-5 4-6 1-4-2C-3-4-2-5 0-5Z',
  'M-1-5C2-6 5-3 5 0C5 4 2 6-2 5C-5 4-6 0-4-3C-3-4-2-5-1-5Z',
  'M0-4C3-4 5-1 4 2C3 5 0 6-3 4C-5 2-5-1-3-3C-2-4-1-4 0-4Z',
  'M-1-4C2-5 5-2 4 1C4 4 1 5-2 5C-5 4-6 1-4-2C-3-3-2-4-1-4Z',
  'M0-5C2-5 4-3 4 0C4 3 2 5-1 5C-4 5-5 2-4-1C-3-3-2-5 0-5Z',
  'M-1-4C2-5 4-2 4 1C4 4 1 5-2 4C-4 3-5 0-3-2C-3-3-2-4-1-4Z',
  'M0-5C3-4 5-2 4 1C4 4 1 6-2 5C-5 4-5 1-4-2C-3-4-2-5 0-5Z',
  'M-1-5C2-5 5-2 5 1C4 4 1 6-2 5C-5 4-6 1-4-2C-3-4-2-5-1-5Z',
  'M0-4C3-4 4-2 4 1C4 4 1 5-2 5C-5 4-5 1-4-2C-3-3-1-4 0-4Z',
  'M-1-4C2-4 4-2 4 1C4 4 1 5-2 4C-4 3-5 0-3-2C-3-3-2-4-1-4Z',
  'M0-4C2-4 4-2 4 1C3 4 1 5-2 4C-4 3-5 0-3-2C-2-3-1-4 0-4Z',
  'M-1-3C1-4 3-2 3 0C3 3 1 4-1 4C-3 3-4 1-3-1C-2-2-2-3-1-3Z',
  'M0-4C3-5 5-2 4 1C4 4 1 5-2 5C-4 4-5 1-3-2C-2-3-1-4 0-4Z',
  'M-1-4C2-5 4-2 4 1C4 4 1 5-2 4C-5 3-5 0-3-2C-3-3-2-4-1-4Z',
  'M0-3C2-4 4-2 4 1C3 4 1 5-2 4C-4 3-4 0-3-2C-2-3-1-3 0-3Z',
  'M-1-4C2-4 4-1 3 2C3 4 0 5-2 4C-4 3-5 0-3-2C-3-3-2-4-1-4Z',
]

function translatePath(path: string, dx: number, dy: number) {
  let coordinateIndex = 0

  return path.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, value => {
    const number = Number(value)
    const isX = coordinateIndex % 2 === 0

    coordinateIndex += 1

    return String(isX ? number + dx : number + dy)
  })
}

function mapVerticalPath(
  path: string,
  referenceStart: Point,
  referenceEnd: Point,
  targetStart: Point,
  targetEnd: Point,
) {
  const referenceHeight = referenceEnd.y - referenceStart.y
  const targetHeight = targetEnd.y - targetStart.y
  const scaleY =
    referenceHeight === 0 ? 1 : targetHeight / referenceHeight

  let coordinateIndex = 0

  return path.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, value => {
    const number = Number(value)
    const isX = coordinateIndex % 2 === 0

    coordinateIndex += 1

    if (isX) {
      const ratio =
        (number - referenceStart.x) /
        (referenceEnd.x - referenceStart.x || 1)

      return String(
        targetStart.x +
          (targetEnd.x - targetStart.x) * ratio,
      )
    }

    return String(
      targetStart.y +
        (number - referenceStart.y) * scaleY,
    )
  })
}

function InkDrop() {
  const rootRef = useRef<HTMLDivElement>(null)
  const shapeRef = useRef<SVGSVGElement>(null)
  const dropRef = useRef<SVGPathElement>(null)
  const blobRef = useRef<SVGPathElement>(null)
  const splashRef = useRef<SVGSVGElement>(null)

  const heroHelloPathRef = useRef<SVGPathElement>(null)
  const introPath1Ref = useRef<SVGPathElement>(null)
  const introPath2Ref = useRef<SVGPathElement>(null)
  const introPath3Ref = useRef<SVGPathElement>(null)
  const introPath4Ref = useRef<SVGPathElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const shape = shapeRef.current
    const drop = dropRef.current
    const blob = blobRef.current
    const splash = splashRef.current

    const heroHelloPath = heroHelloPathRef.current
    const path1 = introPath1Ref.current
    const path2 = introPath2Ref.current
    const path3 = introPath3Ref.current
    const path4 = introPath4Ref.current

    if (
      !root ||
      !shape ||
      !drop ||
      !blob ||
      !splash ||
      !heroHelloPath ||
      !path1 ||
      !path2 ||
      !path3 ||
      !path4
    ) {
      return
    }

    const intro =
      document.querySelector<HTMLElement>('#intro')

    const introTitle =
      document.querySelector<HTMLElement>(
        '[data-ink-anchor="intro-title"]',
      )

    if (!intro || !introTitle) {
      return
    }

    const fragments = Array.from(
      splash.querySelectorAll<SVGPathElement>(
        '[data-ink-fragment]',
      ),
    )

    let destroyed = false
    let stage: Stage = 'waiting-hello'
    let stageRunning = false
    let heroReady = false
    let scrollGate = 0
    let resizeTimer: number | undefined

    let heroTimeline: gsap.core.Timeline | undefined
    let stageTimeline: gsap.core.Timeline | undefined

    const getStableBounds = (element: HTMLElement): Bounds => {
      const range = document.createRange()
      range.selectNodeContents(element)

      let rect = range.getBoundingClientRect()

      if (rect.width <= 0 || rect.height <= 0) {
        rect = element.getBoundingClientRect()
      }

      let tx = 0
      let ty = 0

      const transform =
        window.getComputedStyle(element).transform

      if (transform && transform !== 'none') {
        const matrix = new DOMMatrixReadOnly(transform)
        tx = matrix.m41
        ty = matrix.m42
      }

      return {
        left: window.scrollX + rect.left - tx,
        right: window.scrollX + rect.right - tx,
        top: window.scrollY + rect.top - ty,
        bottom: window.scrollY + rect.bottom - ty,
      }
    }

    const getLogo = (): HTMLElement | null => {
      const source =
        document.querySelector<HTMLElement>(
          '[data-ink-source="hero-logo"]',
        )

      if (!source) {
        return null
      }

      const media =
        source.querySelector<HTMLElement>('svg, img')

      if (media) {
        return media
      }

      const first = source.firstElementChild
      return first instanceof HTMLElement ? first : null
    }

    const logoPoint = (ratio: number): Point | null => {
      const logo = getLogo()

      if (!logo) {
        return null
      }

      const rect = logo.getBoundingClientRect()

      return {
        x: window.scrollX + rect.left + rect.width / 2,
        y: window.scrollY + rect.top + rect.height * ratio,
      }
    }

    const getHeroReleasePoint = (): Point | null => {
      const anchor =
        document.querySelector<HTMLElement>(
          '[data-ink-anchor="hero-release"]',
        )

      if (!anchor) {
        return null
      }

      const rect = anchor.getBoundingClientRect()

      return {
        x: window.scrollX + rect.left + rect.width / 2,
        y: window.scrollY + rect.bottom + 3,
      }
    }

    const getHelloImpactPoint = (): Point => {
      const rect = getStableBounds(introTitle)

      return {
        x: (rect.left + rect.right) / 2,
        y: rect.top + 2,
      }
    }

    const layoutPaths = () => {
      const heroRelease = getHeroReleasePoint()

      if (!heroRelease) {
        return
      }

      const helloImpact = getHelloImpactPoint()

      heroHelloPath.setAttribute(
        'd',
        mapVerticalPath(
          HERO_TO_HELLO_PATH,
          HERO_TO_HELLO_REFERENCE_START,
          HERO_TO_HELLO_REFERENCE_END,
          heroRelease,
          helloImpact,
        ),
      )

      const dx = helloImpact.x - INTRO_REFERENCE_HELLO.x
      const dy = helloImpact.y - INTRO_REFERENCE_HELLO.y

      path1.setAttribute(
        'd',
        translatePath(INTRO_PATH_1, dx, dy),
      )

      path2.setAttribute(
        'd',
        translatePath(INTRO_PATH_2, dx, dy),
      )

      path3.setAttribute(
        'd',
        translatePath(INTRO_PATH_3, dx, dy),
      )

      path4.setAttribute(
        'd',
        translatePath(INTRO_PATH_4, dx, dy),
      )
    }

    const place = (point: Point) => {
      gsap.set(root, {
        x: point.x,
        y: point.y,
      })
    }

    const showDrop = () => {
      gsap.set(drop, {
        opacity: 1,
        attr: {
          d: DROP_PATH,
        },
      })

      gsap.set(blob, {
        opacity: 0,
        attr: {
          d: BLOB_IDLE_PATH,
        },
      })

      gsap.set(shape, {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        transformOrigin: '50% 50%',
      })
    }

    const showBlob = () => {
      gsap.set(drop, {
        opacity: 0,
      })

      gsap.set(blob, {
        opacity: 1,
        attr: {
          d: BLOB_IDLE_PATH,
        },
      })

      gsap.set(shape, {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        transformOrigin: '50% 50%',
      })
    }

    const resetSplash = () => {
      gsap.set(splash, {
        opacity: 0,
      })

      gsap.set(fragments, {
        x: 0,
        y: 0,
        scale: 0.04,
        rotation: 0,
        opacity: 0,
        transformOrigin: '50% 50%',
      })
    }

    const compactBurst = (point: Point) => {
      gsap.killTweensOf(fragments)
      gsap.killTweensOf(splash)

      gsap.set(splash, {
        x: point.x - 48,
        y: point.y - 48,
        opacity: 1,
      })

      gsap.set(fragments, {
        x: 0,
        y: 0,
        scale: 0.04,
        rotation: 0,
        opacity: 0,
      })

      gsap
        .timeline({
          onComplete: () => {
            gsap.set(splash, {
              opacity: 0,
            })
          },
        })
        .to(fragments, {
          x: index =>
            COMPACT_SPLASH[index % COMPACT_SPLASH.length].x,
          y: index =>
            COMPACT_SPLASH[index % COMPACT_SPLASH.length].y,
          scale: index =>
            COMPACT_SPLASH[index % COMPACT_SPLASH.length].scale,
          rotation: index =>
            COMPACT_SPLASH[index % COMPACT_SPLASH.length].rotation,
          opacity: 0.86,
          duration: 0.1,
          ease: 'power3.out',
          stagger: 0.002,
        })
        .to(
          fragments,
          {
            x: index =>
              COMPACT_SPLASH[index % COMPACT_SPLASH.length].x *
              1.08,
            y: index =>
              COMPACT_SPLASH[index % COMPACT_SPLASH.length].y *
                1.04 +
              2,
            scale: index =>
              COMPACT_SPLASH[index % COMPACT_SPLASH.length]
                .scale * 0.52,
            opacity: 0,
            duration: 0.18,
            ease: 'power1.out',
            stagger: 0.002,
          },
          '<35%',
        )
    }

    const addDropTravel = (
      timeline: gsap.core.Timeline,
      path: SVGPathElement,
      duration: number,
    ) => {
      timeline
        .to(
          shape,
          {
            scaleX: 0.84,
            scaleY: 1.18,
            duration: 0.11,
            ease: 'power2.out',
          },
          '<',
        )
        .to(
          root,
          {
            motionPath: {
              path,
              start: 0,
              end: 1,
            },
            duration,
            ease: 'power1.inOut',
          },
          '<',
        )
        .to(
          shape,
          {
            scaleX: 1,
            scaleY: 1,
            duration: 0.1,
            ease: 'power2.out',
          },
          '<75%',
        )
    }

    const addHelloImpact = (
      timeline: gsap.core.Timeline,
      impact: Point,
      target: Point,
    ) => {
      const dx = target.x - impact.x
      const dy = target.y - impact.y

      timeline.addLabel('hello-impact')

      timeline
        .set(
          splash,
          {
            x: impact.x - 48,
            y: impact.y - 48,
            opacity: 1,
          },
          'hello-impact',
        )
        .set(
          fragments,
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 0.04,
            opacity: 0,
          },
          'hello-impact',
        )
        .to(
          drop,
          {
            attr: {
              d: HELLO_PUDDLE_PATH,
            },
            duration: 0.065,
            ease: 'power4.out',
          },
          'hello-impact',
        )
        .to(
          shape,
          {
            scaleX: 1.62,
            scaleY: 0.54,
            duration: 0.065,
            ease: 'power4.out',
          },
          'hello-impact',
        )
        .to(
          fragments,
          {
            x: index =>
              HELLO_SPLASH[index % HELLO_SPLASH.length].x,
            y: index =>
              HELLO_SPLASH[index % HELLO_SPLASH.length].y,
            scale: index =>
              HELLO_SPLASH[index % HELLO_SPLASH.length].scale,
            rotation: index =>
              HELLO_SPLASH[index % HELLO_SPLASH.length].rotation,
            opacity: 1,
            duration: 0.13,
            ease: 'power3.out',
            stagger: 0.001,
          },
          'hello-impact',
        )

      timeline.addLabel('drain', 'hello-impact+=0.13')

      timeline
        .to(
          drop,
          {
            opacity: 0,
            duration: 0.07,
            ease: 'sine.out',
          },
          'drain',
        )
        .to(
          shape,
          {
            opacity: 0,
            duration: 0.07,
            ease: 'sine.out',
          },
          'drain',
        )

      fragments.forEach((fragment, index) => {
        const splashVector =
          HELLO_SPLASH[index % HELLO_SPLASH.length]

        const drift =
          STREAM_DRIFT[index % STREAM_DRIFT.length]

        timeline.to(
          fragment,
          {
            motionPath: {
              path: [
                {
                  x: splashVector.x,
                  y: splashVector.y,
                },
                {
                  x: dx * 0.3 + drift * 1.25,
                  y: dy * 0.22 - 4 + Math.abs(drift) * 0.15,
                },
                {
                  x: dx * 0.62 + drift * 0.7,
                  y: dy * 0.58,
                },
                {
                  x: dx * 0.86 + drift * 0.3,
                  y: dy * 0.83,
                },
                {
                  x: dx + drift * 0.08,
                  y: dy - 2,
                },
              ],
              curviness: 1.3,
            },
            scale: Math.max(
              0.08,
              splashVector.scale * 0.28,
            ),
            rotation: drift * 2,
            opacity: 0.78,
            duration: 0.42,
            ease: 'sine.inOut',
          },
          'drain',
        )
      })

      timeline.addLabel('form', 'drain+=0.42')

      timeline
        .set(
          root,
          {
            x: target.x,
            y: target.y,
          },
          'form',
        )
        .set(
          drop,
          {
            opacity: 0,
            attr: {
              d: DROP_PATH,
            },
          },
          'form',
        )
        .set(
          shape,
          {
            opacity: 1,
            scaleX: 0.24,
            scaleY: 0.24,
            rotation: 0,
            transformOrigin: '50% 50%',
          },
          'form',
        )
        .to(
          fragments,
          {
            scale: 0.025,
            opacity: 0,
            duration: 0.1,
            ease: 'sine.in',
          },
          'form',
        )
        .to(
          drop,
          {
            opacity: 1,
            duration: 0.14,
            ease: 'sine.in',
          },
          'form+=0.045',
        )
        .to(
          shape,
          {
            scaleX: 0.7,
            scaleY: 0.86,
            duration: 0.16,
            ease: 'sine.out',
          },
          'form+=0.045',
        )
        .to(shape, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.2,
          ease: 'power2.out',
        })
        .set(splash, {
          opacity: 0,
        })
    }

    const addBlobTravel = (
      timeline: gsap.core.Timeline,
      path: SVGPathElement,
      duration: number,
      direction: number,
    ) => {
      const travelPath =
        direction > 0
          ? BLOB_RIGHT_PATH
          : BLOB_LEFT_PATH

      timeline
        .to(
          blob,
          {
            attr: {
              d: travelPath,
            },
            duration: 0.1,
            ease: 'sine.out',
          },
          '<',
        )
        .to(
          shape,
          {
            rotation: direction * 3,
            scaleX: 0.98,
            scaleY: 1.03,
            duration: 0.1,
            ease: 'sine.out',
          },
          '<',
        )
        .to(
          root,
          {
            motionPath: {
              path,
              start: 0,
              end: 1,
            },
            duration,
            ease: 'power1.inOut',
          },
          '<',
        )
        .to(
          blob,
          {
            attr: {
              d: BLOB_IDLE_PATH,
            },
            duration: 0.11,
            ease: 'sine.inOut',
          },
          '<72%',
        )
        .to(
          shape,
          {
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.11,
            ease: 'sine.inOut',
          },
          '<',
        )
    }

    const addBlobImpact = (
      timeline: gsap.core.Timeline,
      point: Point,
      direction: number,
      switchFromDrop = false,
    ) => {
      const impactPath =
        direction > 0
          ? BLOB_IMPACT_RIGHT_PATH
          : BLOB_IMPACT_LEFT_PATH

      const reboundPath =
        direction > 0
          ? BLOB_RIGHT_PATH
          : BLOB_LEFT_PATH

      timeline
        .call(() => {
          if (switchFromDrop) {
            showBlob()
          }

          compactBurst(point)
        })
        .to(blob, {
          attr: {
            d: impactPath,
          },
          duration: 0.065,
          ease: 'power3.out',
        })
        .to(
          shape,
          {
            scaleX: 1.06,
            scaleY: 0.94,
            rotation: direction * 3,
            duration: 0.065,
            ease: 'power3.out',
          },
          '<',
        )
        .to(blob, {
          attr: {
            d: reboundPath,
          },
          duration: 0.09,
          ease: 'power2.out',
        })
        .to(
          shape,
          {
            scaleX: 0.97,
            scaleY: 1.05,
            rotation: direction * -3,
            duration: 0.09,
            ease: 'power2.out',
          },
          '<',
        )
    }

    const buildHelloStage = () => {
      const impact =
        heroHelloPath.getPointAtLength(
          heroHelloPath.getTotalLength(),
        )

      const introStart =
        path1.getPointAtLength(0)

      const timeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          if (destroyed) {
            return
          }

          showDrop()

          stage = 'waiting-flow'
          stageRunning = false
          scrollGate = window.scrollY + 56
        },
      })

      addDropTravel(
        timeline,
        heroHelloPath,
        0.88,
      )

      addHelloImpact(
        timeline,
        impact,
        introStart,
      )

      return timeline
    }

    const buildFlowStage = () => {
      const impact1 =
        path1.getPointAtLength(
          path1.getTotalLength(),
        )

      const impact2 =
        path2.getPointAtLength(
          path2.getTotalLength(),
        )

      const impact3 =
        path3.getPointAtLength(
          path3.getTotalLength(),
        )

      const timeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          if (destroyed) {
            return
          }

          showDrop()

          stage = 'done'
          stageRunning = false
        },
      })

      addDropTravel(
        timeline,
        path1,
        0.88,
      )

      addBlobImpact(
        timeline,
        impact1,
        -1,
        true,
      )

      addBlobTravel(
        timeline,
        path2,
        0.56,
        -1,
      )

      addBlobImpact(
        timeline,
        impact2,
        1,
      )

      addBlobTravel(
        timeline,
        path3,
        0.58,
        1,
      )

      addBlobImpact(
        timeline,
        impact3,
        -1,
      )

      addBlobTravel(
        timeline,
        path4,
        0.7,
        -1,
      )

      timeline
        .to(shape, {
          scaleX: 0.86,
          scaleY: 1.16,
          duration: 0.12,
          ease: 'power2.out',
        })
        .to(
          blob,
          {
            opacity: 0,
            duration: 0.15,
            ease: 'power1.out',
          },
          '<',
        )
        .to(
          drop,
          {
            opacity: 1,
            duration: 0.15,
            ease: 'power1.in',
          },
          '<',
        )
        .to(shape, {
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          duration: 0.2,
          ease: 'back.out(1.5)',
        })

      return timeline
    }

    const canStartHello = () => {
      const threshold =
        getStableBounds(introTitle).top -
        window.innerHeight * 0.78

      return (
        heroReady &&
        stage === 'waiting-hello' &&
        !stageRunning &&
        window.scrollY >= Math.max(scrollGate, threshold)
      )
    }

    const canStartFlow = () => {
      const threshold =
        getStableBounds(intro).top -
        window.innerHeight * 0.18

      return (
        stage === 'waiting-flow' &&
        !stageRunning &&
        window.scrollY >= Math.max(scrollGate, threshold)
      )
    }

    const checkStages = () => {
      if (canStartHello()) {
        stageRunning = true

        stageTimeline?.kill()
        stageTimeline = buildHelloStage()
        stageTimeline.play(0)

        return
      }

      if (canStartFlow()) {
        stageRunning = true

        stageTimeline?.kill()
        stageTimeline = buildFlowStage()
        stageTimeline.play(0)
      }
    }

    const runHeroMotion = () => {
      const start = logoPoint(0.12)
      const middle = logoPoint(0.52)
      const logoBottom = logoPoint(0.965)
      const heroEnd = getHeroReleasePoint()

      if (!start || !middle || !logoBottom || !heroEnd) {
        heroReady = true
        scrollGate = window.scrollY + 24
        return
      }

      place(start)

      root.dataset.visible = 'true'
      root.dataset.stage = 'hero-moving'

      showDrop()
      resetSplash()

      gsap.set(shape, {
        scaleX: 0.65,
        scaleY: 0.65,
      })

      const between: Point = {
        x:
          logoBottom.x +
          (heroEnd.x - logoBottom.x) * 0.12,

        y:
          logoBottom.y +
          (heroEnd.y - logoBottom.y) * 0.52,
      }

      heroTimeline = gsap.timeline()

      heroTimeline
        .to(root, {
          motionPath: {
            path: [
              {
                x: middle.x,
                y: middle.y,
              },
              {
                x: logoBottom.x,
                y: logoBottom.y,
              },
            ],
            curviness: 1,
          },
          duration: 1.15,
          ease: 'power1.inOut',
        })
        .to(
          shape,
          {
            scaleX: 0.72,
            scaleY: 1.35,
            duration: 0.22,
            ease: 'power2.out',
          },
          0.88,
        )
        .to(
          root,
          {
            motionPath: {
              path: [
                {
                  x: between.x,
                  y: between.y,
                },
                {
                  x: heroEnd.x,
                  y: heroEnd.y,
                },
              ],
              curviness: 1.1,
            },
            duration: 0.85,
            ease: 'power2.in',
          },
          '+=0.12',
        )
        .to(shape, {
          scaleX: 1.06,
          scaleY: 0.94,
          duration: 0.12,
          ease: 'power2.out',
        })
        .to(shape, {
          scaleX: 1,
          scaleY: 1,
          duration: 0.18,
          ease: 'back.out(1.5)',
        })
        .call(() => {
          if (destroyed) {
            return
          }

          place(heroEnd)
          showDrop()

          root.dataset.stage = 'hero-waiting'

          heroReady = true
          scrollGate = window.scrollY + 24
        })
    }

    layoutPaths()
    showDrop()
    resetSplash()

    const heroTimer =
      window.setTimeout(
        runHeroMotion,
        100,
      )

    const handleScroll = () => {
      checkStages()
    }

    const handleResize = () => {
      if (resizeTimer) {
        window.clearTimeout(resizeTimer)
      }

      resizeTimer =
        window.setTimeout(() => {
          if (
            !stageRunning &&
            stage === 'waiting-hello'
          ) {
            layoutPaths()
          }
        }, 120)
    }

    window.addEventListener(
      'scroll',
      handleScroll,
      {
        passive: true,
      },
    )

    window.addEventListener(
      'resize',
      handleResize,
    )

    return () => {
      destroyed = true

      window.clearTimeout(
        heroTimer,
      )

      if (resizeTimer) {
        window.clearTimeout(
          resizeTimer,
        )
      }

      heroTimeline?.kill()
      stageTimeline?.kill()

      window.removeEventListener(
        'scroll',
        handleScroll,
      )

      window.removeEventListener(
        'resize',
        handleResize,
      )
    }
  }, [])

  return (
    <>
      <svg
        className={styles.motionPaths}
        aria-hidden="true"
      >
        <path ref={heroHelloPathRef} />
        <path ref={introPath1Ref} />
        <path ref={introPath2Ref} />
        <path ref={introPath3Ref} />
        <path ref={introPath4Ref} />
      </svg>

      <svg
        ref={splashRef}
        aria-hidden="true"
        viewBox="-48 -48 96 96"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 998,
          width: 96,
          height: 96,
          overflow: 'visible',
          pointerEvents: 'none',
          color: '#171514',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      >
        {FRAGMENT_PATHS.map((fragmentPath, index) => (
          <path
            key={index}
            data-ink-fragment
            d={fragmentPath}
            fill="currentColor"
            style={{
              opacity: 0,
              transformBox: 'fill-box',
              transformOrigin: 'center',
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </svg>

      <div
        ref={rootRef}
        className={styles.inkDrop}
        aria-hidden="true"
      >
        <svg
          ref={shapeRef}
          className={styles.shape}
          viewBox="0 0 44 58"
        >
          <path
            ref={dropRef}
            className={styles.dropPath}
            d={DROP_PATH}
          />

          <path
            ref={blobRef}
            className={styles.dropPath}
            d={BLOB_IDLE_PATH}
            opacity="0"
          />
        </svg>
      </div>
    </>
  )
}

export default InkDrop