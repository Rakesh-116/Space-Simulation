import { useMissionStore } from '../../store/missionStore'

const phases = [
  'Launch',
  'Departure Burn',
  'Cruise',
  'Midcourse',
  'Approach',
  'Orbital Insertion',
  'Science Ops',
  'Return Prep',
]

const MissionPhases = () => {
  const activePhase = useMissionStore((s) => s.activePhase)

  return (
    <div className="hud-card">
      <div className="panel-title">Mission Phases</div>
      <div className="phases">
        {phases.map((phase, idx) => (
          <div
            key={phase}
            className={`phase-row ${activePhase === idx ? 'active' : ''}`}
          >
            <span className="phase-dot" />
            <span>
              {idx + 1}. {phase}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MissionPhases
