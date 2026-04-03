import { PRESETS } from '../../core/constants/missionProfiles'
import { useMissionStore } from '../../store/missionStore'
import CameraControls from './CameraControls'
import MissionPhases from './MissionPhases'
import MissionPlanner from './MissionPlanner'
import PlanetInfoCard from './PlanetInfoCard'
import Timeline from './Timeline'
import TrajectoryStats from './TrajectoryStats'

const HUD = () => {
  const setOrigin = useMissionStore((s) => s.setOrigin)
  const setDestination = useMissionStore((s) => s.setDestination)
  const setMissionType = useMissionStore((s) => s.setMissionType)
  const setDepartureDate = useMissionStore((s) => s.setDepartureDate)
  const computeMission = useMissionStore((s) => s.computeMission)

  const handlePreset = (presetId: string) => {
    const preset = PRESETS.find((item) => item.id === presetId)
    if (!preset) return
    setOrigin(preset.origin)
    setDestination(preset.destination)
    setMissionType(preset.missionType)
    setDepartureDate(new Date(preset.departureDate))
    computeMission()
  }

  return (
    <div className="hud">
      <div
        className="hud-card"
        style={{ position: 'absolute', top: 24, left: 24, right: 24 }}
      >
        <div className="hud-title">
          COSMOS NAVIGATOR <span>|</span>
        </div>
        <div className="hud-controls" style={{ marginTop: 10 }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              className="hud-button"
              onClick={() => handlePreset(preset.id)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mission-layout">
        <div>
          <MissionPlanner />
        </div>
        <div />
        <div style={{ display: 'grid', gap: 16 }}>
          <TrajectoryStats />
          <MissionPhases />
        </div>
      </div>
      <Timeline />
      <CameraControls />
      <PlanetInfoCard />
    </div>
  )
}

export default HUD
