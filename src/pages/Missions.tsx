import { Link } from 'react-router-dom'

const Missions = () => {
  return (
    <section className="page missions-list">
      <div className="missions-card">
        <div>
          <div className="hud-title">
            <span>ARTEMIS 2</span>
          </div>
          <div className="hud-sub">10-Day Mission Trajectory</div>
        </div>
        <Link to="/missions/artemis2">Open Mission</Link>
      </div>
      <div className="missions-card">
        <div>
          <div className="hud-title">Additional Missions</div>
          <div className="hud-sub">Add new historical missions here</div>
        </div>
        <Link to="/cosmos">Go to Planner</Link>
      </div>
    </section>
  )
}

export default Missions
