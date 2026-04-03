import { useMissionStore } from '../../store/missionStore'

const speeds = [0.5, 1, 10, 100, 1000]

const Timeline = () => {
  const spacecraftT = useMissionStore((s) => s.spacecraftT)
  const setSpacecraftT = useMissionStore((s) => s.setSpacecraftT)
  const simulationDate = useMissionStore((s) => s.simulationDate)
  const simulationSpeed = useMissionStore((s) => s.simulationSpeed)
  const setSimulationSpeed = useMissionStore((s) => s.setSimulationSpeed)
  const togglePlay = useMissionStore((s) => s.togglePlay)
  const isPlaying = useMissionStore((s) => s.isPlaying)

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    setSpacecraftT(Math.min(1, Math.max(0, ratio)))
  }

  return (
    <div className="hud-card timeline">
      <div className="timeline-bar" onClick={handleClick}>
        <div
          className="timeline-playhead"
          style={{ left: `${spacecraftT * 100}%` }}
        />
      </div>
      <div className="timeline-controls">
        <span>{simulationDate.toDateString()}</span>
        <div className="hud-controls">
          <button className="hud-button" onClick={togglePlay}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          {speeds.map((speed) => (
            <button
              key={speed}
              className={`hud-button ${simulationSpeed === speed ? 'active' : ''}`}
              onClick={() => setSimulationSpeed(speed)}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Timeline
