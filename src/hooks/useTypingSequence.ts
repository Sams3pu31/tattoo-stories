import { useCallback, useEffect, useState } from 'react'

export type TypingState = 'waiting' | 'active' | 'complete'

export function useTypingSequence(isActive: boolean, count: number) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!isActive) setActiveIndex(0)
  }, [isActive])

  const completeStep = useCallback(
    (index: number) => {
      setActiveIndex((current) => {
        if (current !== index) return current
        return Math.min(current + 1, count)
      })
    },
    [count],
  )

  const getState = useCallback(
    (index: number): TypingState => {
      if (!isActive) return 'waiting'
      if (index < activeIndex) return 'complete'
      if (index === activeIndex) return 'active'
      return 'waiting'
    },
    [activeIndex, isActive],
  )

  return {
    activeIndex,
    completeStep,
    getState,
  }
}