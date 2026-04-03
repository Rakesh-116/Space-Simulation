import { useMissionStore } from '../../store/missionStore'

const modes: Array<'free' | 'follow' | 'cinematic' | 'top'> = [
  'free',
  'follow',
  'cinematic',
  'top',
]

const CameraControls = () => {
  const cameraMode = useMissionStore((s) => s.cameraMode)
  const setCameraMode = useMissionStore((s) => s.setCameraMode)

  return (
    <div className="hud-card" style={{ position: 'absolute', right: 24, bottom: 120 }}>
      <div className="panel-title">Camera Modes</div>
      <div className="hud-controls">
        {modes.map((mode) => (
          <button
            key={mode}
            className={`hud-button ${cameraMode === mode ? 'active' : ''}`}
            onClick={() => setCameraMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CameraControls
