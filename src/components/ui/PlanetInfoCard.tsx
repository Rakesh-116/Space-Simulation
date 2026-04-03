import { celestialBodies } from '../../core/constants/celestialBodies'
import { useMissionStore } from '../../store/missionStore'

const PlanetInfoCard = () => {
  const selectedBody = useMissionStore((s) => s.selectedBody)
  if (!selectedBody) return null
  const body = celestialBodies.find((item) => item.id === selectedBody)
  if (!body) return null

  return (
    <div className="hud-card" style={{ position: 'absolute', bottom: 24, left: 24, width: 260 }}>
      <div className="panel-title">{body.name}</div>
      <div className="stats">
        <div className="stats-row">
          <span className="stats-label">Radius</span>
          <span className="stats-value">{body.radius.toLocaleString()} km</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">Gravity</span>
          <span className="stats-value">{body.surfaceGravity} m/s²</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">SOI</span>
          <span className="stats-value">{body.SOI.toLocaleString()} km</span>
        </div>
        <div className="stats-row">
          <span className="stats-label">Orbit</span>
          <span className="stats-value">{body.orbitalPeriod} days</span>
        </div>
      </div>
    </div>
  )
}

export default PlanetInfoCard
