const phases = [
  'Launch',
  'Low Earth Orbit',
  'High Earth Orbit',
  'Trans-Lunar Injection',
  'Outbound Coast',
  'Lunar Flyby',
  'Return Coast',
  'Reentry & Splashdown',
]

interface MissionPhasesProps {
  activePhase: number
}

const MissionPhases = ({ activePhase }: MissionPhasesProps) => {
  return (
    <div className="phases">
      <div className="hud-sub">MISSION PHASES</div>
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
  )
}

export default MissionPhases
