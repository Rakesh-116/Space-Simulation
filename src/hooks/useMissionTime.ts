import { useRef, useState } from 'react'

export const useMissionTime = () => {
  const timeRef = useRef(0)
  const elapsedDayRef = useRef(1)
  const phaseRef = useRef(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [activePhase, setActivePhase] = useState(0)

  const togglePlay = () => setIsPlaying((prev) => !prev)
  const updateSpeed = (multiplier: number) => setSpeed(multiplier)

  return {
    timeRef,
    elapsedDayRef,
    phaseRef,
    isPlaying,
    speed,
    activePhase,
    setActivePhase,
    togglePlay,
    setSpeed: updateSpeed,
  }
}
