import { celestialBodies } from '../../core/constants/celestialBodies'
import { useMissionStore } from '../../store/missionStore'

const MissionPlanner = () => {
  const origin = useMissionStore((s) => s.origin)
  const destination = useMissionStore((s) => s.destination)
  const departureDate = useMissionStore((s) => s.departureDate)
  const payloadMassKg = useMissionStore((s) => s.payloadMassKg)
  const propulsionType = useMissionStore((s) => s.propulsionType)
  const missionType = useMissionStore((s) => s.missionType)
  const setOrigin = useMissionStore((s) => s.setOrigin)
  const setDestination = useMissionStore((s) => s.setDestination)
  const setDepartureDate = useMissionStore((s) => s.setDepartureDate)
  const setPayloadMass = useMissionStore((s) => s.setPayloadMass)
  const setPropulsionType = useMissionStore((s) => s.setPropulsionType)
  const setMissionType = useMissionStore((s) => s.setMissionType)
  const computeMission = useMissionStore((s) => s.computeMission)

  const launchCapableBodies = celestialBodies.filter((body) => body.launchCapable)
  const destinationBodies = celestialBodies.filter((body) => body.id !== 'sun')

  return (
    <div className="hud-card">
      <div className="panel-title">Mission Planner</div>
      <div className="planner-section">
        <label>
          ORIGIN
          <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
            {launchCapableBodies.map((body) => (
              <option key={body.id} value={body.id}>
                {body.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          DESTINATION
          <select value={destination} onChange={(e) => setDestination(e.target.value)}>
            {destinationBodies.map((body) => (
              <option key={body.id} value={body.id}>
                {body.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          DEPARTURE DATE
          <input
            type="date"
            value={departureDate.toISOString().slice(0, 10)}
            onChange={(e) => setDepartureDate(new Date(e.target.value))}
          />
        </label>
        <label>
          PAYLOAD MASS
          <input
            type="range"
            min={5000}
            max={50000}
            step={1000}
            value={payloadMassKg}
            onChange={(e) => setPayloadMass(Number(e.target.value))}
          />
          <div style={{ color: '#fff', marginTop: 6 }}>{payloadMassKg.toLocaleString()} kg</div>
        </label>
        <div>
          PROPULSION
          <div className="inline">
            {(['chemical', 'nuclear', 'ion'] as const).map((type) => (
              <label key={type} style={{ color: '#fff' }}>
                <input
                  type="radio"
                  name="propulsion"
                  checked={propulsionType === type}
                  onChange={() => setPropulsionType(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        <div>
          MISSION TYPE
          <div className="inline">
            {(['flyby', 'orbit', 'land', 'return'] as const).map((type) => (
              <label key={type} style={{ color: '#fff' }}>
                <input
                  type="radio"
                  name="missionType"
                  checked={missionType === type}
                  onChange={() => setMissionType(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        <button onClick={computeMission}>Compute Trajectory</button>
      </div>
    </div>
  )
}

export default MissionPlanner
