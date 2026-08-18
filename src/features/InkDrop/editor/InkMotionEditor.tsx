import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { MotionPathHelper } from 'gsap/MotionPathHelper'
import styles from './InkMotionEditor.module.scss'

gsap.registerPlugin(MotionPathPlugin, MotionPathHelper)

type Point = {
  x: number
  y: number
}

type SegmentId =
  | 'hero-hello'
  | 'hello-important'
  | 'important-loved'
  | 'loved-unnamed'

type SegmentConfig = {
  id: SegmentId
  label: string
  from: string
  to: string
}

const SEGMENTS: SegmentConfig[] = [
  {
    id: 'hero-hello',
    label: 'Hero → Здравствуй',
    from: '[data-ink-anchor="hero-release"]',
    to: '[data-ink-anchor="intro-title"]',
  },
  {
    id: 'hello-important',
    label: 'Здравствуй → Про важное',
    from: '[data-ink-anchor="intro-title"]',
    to: '[data-ink-intro-line="0"]',
  },
  {
    id: 'important-loved',
    label: 'Про важное → Про любимое',
    from: '[data-ink-intro-line="0"]',
    to: '[data-ink-intro-line="1"]',
  },
  {
    id: 'loved-unnamed',
    label: 'Про любимое → Без названия',
    from: '[data-ink-intro-line="1"]',
    to: '[data-ink-intro-line="2"]',
  },
]

const INITIAL_PATHS: Partial<Record<SegmentId, string>> = {
  'hero-hello':
    'M195,403.3333282470703C195,464.6666666666667,195,521.997,195,583.333',
}

function InkMotionEditor() {
  const [activeId, setActiveId] =
    useState<SegmentId>('hero-hello')

  const [drawMode, setDrawMode] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const activeIdRef =
    useRef<SegmentId>('hero-hello')

  const overlayRef =
    useRef<SVGSVGElement>(null)

  const pathRefs =
    useRef<
      Partial<Record<SegmentId, SVGPathElement>>
    >({})

  const startRefs =
    useRef<
      Partial<Record<SegmentId, SVGCircleElement>>
    >({})

  const impactRefs =
    useRef<
      Partial<Record<SegmentId, SVGCircleElement>>
    >({})

  const dockRefs =
    useRef<
      Partial<Record<SegmentId, SVGCircleElement>>
    >({})

  const editorRef = useRef<{
    kill?: () => void
    deselect?: () => void
  } | null>(null)

  const drawingRef =
    useRef(false)

  const drawPointsRef =
    useRef<Point[]>([])

  const backupPathRef =
    useRef('')

  const messageTimerRef =
    useRef<number | null>(null)

  const getTextRect = (
    element: HTMLElement,
  ): DOMRect => {
    const range =
      document.createRange()

    range.selectNodeContents(element)

    const rect =
      range.getBoundingClientRect()

    if (
      rect.width > 0 &&
      rect.height > 0
    ) {
      return rect
    }

    return element.getBoundingClientRect()
  }

  const documentPoint = (
    element: HTMLElement,
    position: 'top' | 'bottom',
  ): Point => {
    const rect =
      getTextRect(element)

    return {
      x:
        window.scrollX +
        rect.left +
        rect.width / 2,

      y:
        window.scrollY +
        (
          position === 'top'
            ? rect.top + 2
            : rect.bottom + 11
        ),
    }
  }

  const getSegmentPoints = (
    segment: SegmentConfig,
  ) => {
    const fromElement =
      document.querySelector<HTMLElement>(
        segment.from,
      )

    const toElement =
      document.querySelector<HTMLElement>(
        segment.to,
      )

    if (!fromElement || !toElement) {
      return null
    }

    return {
      from:
        documentPoint(
          fromElement,
          'bottom',
        ),

      impact:
        documentPoint(
          toElement,
          'top',
        ),

      dock:
        documentPoint(
          toElement,
          'bottom',
        ),
    }
  }

  const distance = (
    a: Point,
    b: Point,
  ) =>
    Math.hypot(
      b.x - a.x,
      b.y - a.y,
    )

  const distanceToLine = (
    point: Point,
    start: Point,
    end: Point,
  ) => {
    const dx =
      end.x - start.x

    const dy =
      end.y - start.y

    if (dx === 0 && dy === 0) {
      return distance(
        point,
        start,
      )
    }

    const t =
      Math.max(
        0,
        Math.min(
          1,
          (
            (
              point.x -
              start.x
            ) *
              dx +
            (
              point.y -
              start.y
            ) *
              dy
          ) /
            (
              dx * dx +
              dy * dy
            ),
        ),
      )

    const projection: Point = {
      x:
        start.x +
        t * dx,

      y:
        start.y +
        t * dy,
    }

    return distance(
      point,
      projection,
    )
  }

  const simplifyPoints = (
    points: Point[],
    tolerance = 4,
  ): Point[] => {
    if (points.length <= 2) {
      return points
    }

    const first =
      points[0]

    const last =
      points[
        points.length - 1
      ]

    let maxDistance = 0
    let index = 0

    for (
      let i = 1;
      i < points.length - 1;
      i += 1
    ) {
      const current =
        distanceToLine(
          points[i],
          first,
          last,
        )

      if (current > maxDistance) {
        maxDistance = current
        index = i
      }
    }

    if (
      maxDistance <= tolerance
    ) {
      return [
        first,
        last,
      ]
    }

    const left =
      simplifyPoints(
        points.slice(
          0,
          index + 1,
        ),
        tolerance,
      )

    const right =
      simplifyPoints(
        points.slice(index),
        tolerance,
      )

    return [
      ...left.slice(0, -1),
      ...right,
    ]
  }

  const limitPoints = (
    points: Point[],
    maxPoints = 12,
  ) => {
    if (
      points.length <= maxPoints
    ) {
      return points
    }

    const result: Point[] = []

    for (
      let i = 0;
      i < maxPoints;
      i += 1
    ) {
      const index =
        Math.round(
          (
            i *
            (
              points.length -
              1
            )
          ) /
            (
              maxPoints -
              1
            ),
        )

      result.push(
        points[index],
      )
    }

    return result
  }

  const createRawPath = (
    points: Point[],
  ) => {
    if (!points.length) {
      return ''
    }

    return [
      `M${points[0].x},${points[0].y}`,
      ...points
        .slice(1)
        .map(
          point =>
            `L${point.x},${point.y}`,
        ),
    ].join('')
  }

  const createEditablePath = (
    points: Point[],
  ) => {
    if (points.length < 2) {
      return ''
    }

    let d =
      `M${points[0].x},${points[0].y}`

    for (
      let i = 0;
      i < points.length - 1;
      i += 1
    ) {
      const from =
        points[i]

      const to =
        points[i + 1]

      const dx =
        to.x - from.x

      const dy =
        to.y - from.y

      const c1: Point = {
        x:
          from.x +
          dx / 3,

        y:
          from.y +
          dy / 3,
      }

      const c2: Point = {
        x:
          from.x +
          dx * 2 / 3,

        y:
          from.y +
          dy * 2 / 3,
      }

      d +=
        `C${c1.x},${c1.y},` +
        `${c2.x},${c2.y},` +
        `${to.x},${to.y}`
    }

    return d
  }

  const prepareDrawnPath = (
    rawPoints: Point[],
  ) => {
    const simplified =
      simplifyPoints(
        rawPoints,
        4,
      )

    return limitPoints(
      simplified,
      12,
    )
  }

  const sizeOverlay = () => {
    const overlay =
      overlayRef.current

    if (!overlay) {
      return
    }

    const width =
      Math.max(
        document.documentElement
          .scrollWidth,
        document.documentElement
          .clientWidth,
        document.body.scrollWidth,
      )

    const height =
      Math.max(
        document.documentElement
          .scrollHeight,
        document.documentElement
          .clientHeight,
        document.body.scrollHeight,
      )

    overlay.setAttribute(
      'width',
      String(width),
    )

    overlay.setAttribute(
      'height',
      String(height),
    )

    overlay.setAttribute(
      'viewBox',
      `0 0 ${width} ${height}`,
    )
  }

  const layoutMarkers = () => {
    sizeOverlay()

    SEGMENTS.forEach(segment => {
      const points =
        getSegmentPoints(segment)

      const start =
        startRefs.current[
          segment.id
        ]

      const impact =
        impactRefs.current[
          segment.id
        ]

      const dock =
        dockRefs.current[
          segment.id
        ]

      if (
        !points ||
        !start ||
        !impact ||
        !dock
      ) {
        return
      }

      start.setAttribute(
        'cx',
        String(points.from.x),
      )

      start.setAttribute(
        'cy',
        String(points.from.y),
      )

      impact.setAttribute(
        'cx',
        String(points.impact.x),
      )

      impact.setAttribute(
        'cy',
        String(points.impact.y),
      )

      dock.setAttribute(
        'cx',
        String(points.dock.x),
      )

      dock.setAttribute(
        'cy',
        String(points.dock.y),
      )
    })
  }

  const stopEditing = () => {
    editorRef.current
      ?.deselect?.()

    editorRef.current
      ?.kill?.()

    editorRef.current = null
  }

  const openSegment = (
    id: SegmentId,
  ) => {
    const path =
      pathRefs.current[id]

    stopEditing()

    if (
      !path ||
      !path.getAttribute('d')
    ) {
      return
    }

    editorRef.current =
      MotionPathHelper.editPath(
        path,
        {
          selected: true,
          draggable: true,
          handleSize: 8,
        },
      )
  }

  const flashMessage = (
    text: string,
  ) => {
    setMessage(text)

    if (
      messageTimerRef.current
    ) {
      window.clearTimeout(
        messageTimerRef.current,
      )
    }

    messageTimerRef.current =
      window.setTimeout(
        () => {
          setMessage('')
        },
        1600,
      )
  }

  const startDrawMode = () => {
    const path =
      pathRefs.current[
        activeIdRef.current
      ]

    if (!path) {
      return
    }

    stopEditing()

    backupPathRef.current =
      path.getAttribute('d') ?? ''

    path.removeAttribute('d')

    drawPointsRef.current = []
    drawingRef.current = false

    setDrawMode(true)

    flashMessage(
      'Рисуй свободно',
    )
  }

  const cancelDrawMode = () => {
    const path =
      pathRefs.current[
        activeIdRef.current
      ]

    if (path) {
      if (
        backupPathRef.current
      ) {
        path.setAttribute(
          'd',
          backupPathRef.current,
        )
      } else {
        path.removeAttribute('d')
      }
    }

    drawingRef.current = false
    drawPointsRef.current = []

    setDrawMode(false)

    window.setTimeout(
      () => {
        openSegment(
          activeIdRef.current,
        )
      },
      40,
    )
  }

  const eventPoint = (
    event:
      ReactPointerEvent<HTMLDivElement>,
  ): Point => ({
    x:
      window.scrollX +
      event.clientX,

    y:
      window.scrollY +
      event.clientY,
  })

  const handleDrawStart = (
    event:
      ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) {
      return
    }

    const path =
      pathRefs.current[
        activeIdRef.current
      ]

    if (!path) {
      return
    }

    event.preventDefault()

    event.currentTarget
      .setPointerCapture(
        event.pointerId,
      )

    drawingRef.current = true

    const cursor =
      eventPoint(event)

    drawPointsRef.current = [
      cursor,
    ]

    path.setAttribute(
      'd',
      createRawPath(
        drawPointsRef.current,
      ),
    )
  }

  const handleDrawMove = (
    event:
      ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!drawingRef.current) {
      return
    }

    const path =
      pathRefs.current[
        activeIdRef.current
      ]

    if (!path) {
      return
    }

    const cursor =
      eventPoint(event)

    const points =
      drawPointsRef.current

    const last =
      points[
        points.length - 1
      ]

    if (
      !last ||
      distance(
        last,
        cursor,
      ) < 4
    ) {
      return
    }

    points.push(cursor)

    path.setAttribute(
      'd',
      createRawPath(points),
    )
  }

  const handleDrawEnd = (
    event:
      ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!drawingRef.current) {
      return
    }

    drawingRef.current = false

    if (
      event.currentTarget
        .hasPointerCapture(
          event.pointerId,
        )
    ) {
      event.currentTarget
        .releasePointerCapture(
          event.pointerId,
        )
    }

    const path =
      pathRefs.current[
        activeIdRef.current
      ]

    if (!path) {
      return
    }

    const finalCursor =
      eventPoint(event)

    const rawPoints = [
      ...drawPointsRef.current,
    ]

    const last =
      rawPoints[
        rawPoints.length - 1
      ]

    if (
      !last ||
      distance(
        last,
        finalCursor,
      ) > 2
    ) {
      rawPoints.push(
        finalCursor,
      )
    }

    if (
      rawPoints.length < 2
    ) {
      path.removeAttribute('d')

      flashMessage(
        'Нарисуй линию подлиннее',
      )

      return
    }

    const prepared =
      prepareDrawnPath(
        rawPoints,
      )

    if (
      prepared.length < 2
    ) {
      path.removeAttribute('d')
      return
    }

    path.setAttribute(
      'd',
      createEditablePath(
        prepared,
      ),
    )

    drawPointsRef.current = []

    setDrawMode(false)

    window.setTimeout(
      () => {
        openSegment(
          activeIdRef.current,
        )
      },
      50,
    )

    flashMessage(
      `Готово: ${prepared.length} точек`,
    )
  }

  const changeSegment = (
    id: SegmentId,
  ) => {
    if (drawMode) {
      return
    }

    stopEditing()

    activeIdRef.current = id
    setActiveId(id)
  }

  const clearCurrent = () => {
    const path =
      pathRefs.current[
        activeIdRef.current
      ]

    if (!path) {
      return
    }

    stopEditing()
    path.removeAttribute('d')

    flashMessage(
      'Маршрут очищен',
    )
  }

  const clearAll = () => {
    stopEditing()

    SEGMENTS.forEach(
      segment => {
        pathRefs.current[
          segment.id
        ]?.removeAttribute('d')
      },
    )

    flashMessage(
      'Все маршруты очищены',
    )
  }

  const copyCurrent =
    async () => {
      const path =
        pathRefs.current[
          activeIdRef.current
        ]

      const d =
        path?.getAttribute('d')

      if (!d) {
        flashMessage(
          'Маршрут пустой',
        )

        return
      }

      await navigator.clipboard
        .writeText(d)

      flashMessage(
        'Path скопирован',
      )
    }

  const copyAll =
    async () => {
      const result =
        Object.fromEntries(
          SEGMENTS.map(
            segment => [
              segment.id,
              pathRefs.current[
                segment.id
              ]?.getAttribute('d') ??
                '',
            ],
          ),
        )

      await navigator.clipboard
        .writeText(
          JSON.stringify(
            result,
            null,
            2,
          ),
        )

      flashMessage(
        'Все paths скопированы',
      )
    }

  useEffect(() => {
    activeIdRef.current =
      activeId

    if (drawMode) {
      return
    }

    const timer =
      window.setTimeout(
        () => {
          openSegment(activeId)
        },
        50,
      )

    return () => {
      window.clearTimeout(timer)
    }
  }, [activeId, drawMode])

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          layoutMarkers()

          SEGMENTS.forEach(
            segment => {
              const path =
                pathRefs.current[
                  segment.id
                ]

              const initial =
                INITIAL_PATHS[
                  segment.id
                ]

              if (
                path &&
                initial
              ) {
                path.setAttribute(
                  'd',
                  initial,
                )
              } else {
                path?.removeAttribute(
                  'd',
                )
              }
            },
          )

          openSegment(
            activeIdRef.current,
          )
        },
        150,
      )

    const handleResize = () => {
      if (drawingRef.current) {
        return
      }

      layoutMarkers()
    }

    window.addEventListener(
      'resize',
      handleResize,
    )

    return () => {
      window.clearTimeout(timer)

      if (
        messageTimerRef.current
      ) {
        window.clearTimeout(
          messageTimerRef.current,
        )
      }

      stopEditing()

      window.removeEventListener(
        'resize',
        handleResize,
      )
    }
  }, [])

  return createPortal(
    <>
      <svg
        ref={overlayRef}
        className={styles.overlay}
        aria-hidden="true"
      >
        {SEGMENTS.map(
          segment => (
            <g key={segment.id}>
              <path
                ref={element => {
                  if (element) {
                    pathRefs.current[
                      segment.id
                    ] = element
                  }
                }}
                className={
                  segment.id ===
                  activeId
                    ? styles.pathActive
                    : styles.path
                }
              />

              <circle
                ref={element => {
                  if (element) {
                    startRefs.current[
                      segment.id
                    ] = element
                  }
                }}
                className={styles.start}
                r="5"
              />

              <circle
                ref={element => {
                  if (element) {
                    impactRefs.current[
                      segment.id
                    ] = element
                  }
                }}
                className={styles.impact}
                r="7"
              />

              <circle
                ref={element => {
                  if (element) {
                    dockRefs.current[
                      segment.id
                    ] = element
                  }
                }}
                className={styles.dock}
                r="5"
              />
            </g>
          ),
        )}
      </svg>

      {drawMode && (
        <div
          className={styles.drawSurface}
          onPointerDown={
            handleDrawStart
          }
          onPointerMove={
            handleDrawMove
          }
          onPointerUp={
            handleDrawEnd
          }
          onPointerCancel={
            handleDrawEnd
          }
        >
          <div
            className={styles.drawHint}
          >
            Рисуй свободно
          </div>
        </div>
      )}

      <aside
        className={styles.panel}
      >
        <div
          className={styles.panelTitle}
        >
          Ink Motion Editor
        </div>

        <div
          className={styles.legend}
        >
          <span>
            <i
              className={
                styles.startKey
              }
            />
            ориентир
          </span>

          <span>
            <i
              className={
                styles.impactKey
              }
            />
            splash
          </span>

          <span>
            <i
              className={
                styles.dockKey
              }
            />
            после
          </span>
        </div>

        <div
          className={styles.segments}
        >
          {SEGMENTS.map(
            segment => (
              <button
                key={segment.id}
                type="button"
                disabled={drawMode}
                data-active={
                  segment.id ===
                    activeId ||
                  undefined
                }
                onClick={() =>
                  changeSegment(
                    segment.id,
                  )
                }
              >
                {segment.label}
              </button>
            ),
          )}
        </div>

        <div
          className={
            styles.drawActions
          }
        >
          {!drawMode ? (
            <button
              type="button"
              onClick={
                startDrawMode
              }
            >
              ✏️ Нарисовать текущий
            </button>
          ) : (
            <button
              type="button"
              onClick={
                cancelDrawMode
              }
            >
              Отмена рисования
            </button>
          )}
        </div>

        <div
          className={styles.actions}
        >
          <button
            type="button"
            disabled={drawMode}
            onClick={copyCurrent}
          >
            Копировать path
          </button>

          <button
            type="button"
            disabled={drawMode}
            onClick={copyAll}
          >
            Копировать все
          </button>

          <button
            type="button"
            disabled={drawMode}
            onClick={clearCurrent}
          >
            Очистить текущий
          </button>

          <button
            type="button"
            disabled={drawMode}
            onClick={clearAll}
          >
            Очистить все
          </button>
        </div>

        {message && (
          <div
            className={styles.message}
          >
            {message}
          </div>
        )}

        <div
          className={styles.help}
        >
          DRAW — рисуешь как хочешь
          <br />
          EDIT — двигаешь точки и handles
          <br />
          Автосглаживания больше нет
        </div>
      </aside>
    </>,
    document.body,
  )
}

export default InkMotionEditor