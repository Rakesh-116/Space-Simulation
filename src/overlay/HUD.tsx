import { useEffect, useRef } from 'react'
import LiveStats from './LiveStats'
import MissionPhases from './MissionPhases'

interface HUDProps {
  isPlaying: boolean
  speed: number
  onTogglePlay: () => void
  onSetSpeed: (speed: number) => void
  activePhase: number
  followEnabled: boolean
  onToggleFollow: () => void
  elapsedDayRef: React.MutableRefObject<number>
}

const HUD = ({
  isPlaying,
  speed,
  onTogglePlay,
  onSetSpeed,
  activePhase,
  followEnabled,
  onToggleFollow,
  elapsedDayRef,
}: HUDProps) => {
  const dayRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame = 0
    const tick = () => {
      if (dayRef.current) {
        dayRef.current.textContent = `DAY ${elapsedDayRef.current} / 10`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [elapsedDayRef])

  return (
    <div className="hud">
      <div className="hud-card" style={{ position: 'absolute', top: 24, left: 24 }}>
        <div className="hud-title">
          <span>ARTEMIS 2</span> | 10-day Mission Trajectory
        </div>
        <div className="hud-sub">Historical Mission Archive</div>
      </div>

      <div className="hud-card" style={{ position: 'absolute', top: 120, left: 24, width: 320 }}>
        <LiveStats />
      </div>

      <div className="hud-card" style={{ position: 'absolute', top: 120, right: 24, width: 280 }}>
        <MissionPhases activePhase={activePhase} />
      </div>

      <div
        className="hud-card"
        style={{ position: 'absolute', bottom: 24, right: 24, width: 280 }}
      >
        <div className="hud-sub">Playback</div>
        <div className="hud-controls" style={{ marginTop: 10 }}>
          <button className="hud-button" onClick={onTogglePlay}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          {[1, 2, 5].map((mult) => (
            <button
              key={mult}
              className={`hud-button ${speed === mult ? 'active' : ''}`}
              onClick={() => onSetSpeed(mult)}
            >
              {mult}x
            </button>
          ))}
        </div>
        <div className="hud-controls" style={{ marginTop: 10 }}>
          <button
            className={`hud-button secondary ${followEnabled ? 'active' : ''}`}
            onClick={onToggleFollow}
          >
            Follow
          </button>
          <span className="hud-sub" ref={dayRef}>
            DAY 1 / 10
          </span>
        </div>
      </div>
    </div>
  )
}

export default HUD
