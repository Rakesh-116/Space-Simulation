import { useMissionStore } from '../../store/missionStore'

const formatCurrency = (value: number) =>
  `$${Math.round(value / 1_000_000).toLocaleString()}M`

const TrajectoryStats = () => {
  const trajectory = useMissionStore((s) => s.trajectory)
  const cost = useMissionStore((s) => s.cost)
  const launchWindows = useMissionStore((s) => s.launchWindows)

  if (!trajectory || !cost) {
    return (
      <div className="hud-card">
        <div className="panel-title">Trajectory Results</div>
        <div className="hud-sub">Compute a mission to see analytics.</div>
      </div>
    )
  }

  return (
    <div className="hud-card">
      <div className="panel-title">Trajectory Results</div>
      <div className="results-grid">
        <div>
          TRAVEL TIME
          <div style={{ color: '#fff' }}>{trajectory.transferTime} days</div>
        </div>
        <div>
          TOTAL Δv REQUIRED
          <div style={{ color: '#fff' }}>{trajectory.totalDeltaV} km/s</div>
          <div style={{ color: 'rgba(255,255,255,0.5)' }}>
            Departure burn: {trajectory.deltaV1} km/s
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)' }}>
            Arrival burn: {trajectory.deltaV2} km/s
          </div>
        </div>
        <div>
          NEXT LAUNCH WINDOWS
          {launchWindows.slice(0, 3).map((date) => (
            <div key={date.toISOString()} style={{ color: '#fff' }}>
              {date.toDateString()}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8 }}>
          COST ESTIMATE
          <div style={{ color: '#fff' }}>Fuel: {cost.fuelMassKg.toLocaleString()} kg</div>
          <div style={{ color: '#fff' }}>Launch cost: {formatCurrency(cost.launchCostUSD)}</div>
          <div style={{ color: '#fff' }}>
            Total mission: {formatCurrency(cost.totalMissionCostUSD)}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)' }}>
            Cost/kg: ${cost.costPerKgToDestination.toLocaleString()}
          </div>
        </div>
        <div>
          BY VEHICLE
          <div style={{ color: '#fff' }}>
            Falcon Heavy: {formatCurrency(cost.totalMissionCostUSD * 1.5)}
          </div>
          <div style={{ color: '#fff' }}>
            Starship: {formatCurrency(cost.comparisonCosts.starshipEstimate)} ⭐
          </div>
          <div style={{ color: '#fff' }}>
            Nuclear NTP: {formatCurrency(cost.totalMissionCostUSD * 0.8)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrajectoryStats
