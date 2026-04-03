const LiveStats = () => {
  return (
    <div className="stats">
      <div className="stats-row">
        <span className="stats-label">AVERAGE MOON DISTANCE</span>
        <span className="stats-value">384,400 km</span>
      </div>
      <div className="stats-row">
        <span className="stats-label">LUNAR SPHERE OF INFLUENCE</span>
        <span className="stats-value">325,000 km</span>
      </div>
      <div className="stats-row">
        <span className="stats-label">ARTEMIS 2 HEO</span>
        <span className="stats-value">95,000 km</span>
      </div>
      <div className="stats-row">
        <span className="stats-label">GEOSTATIONARY ORBIT</span>
        <span className="stats-value">35,786 km</span>
      </div>
      <div className="stats-row">
        <span className="stats-label">SEA LEVEL</span>
        <span className="stats-value">0 km</span>
      </div>
    </div>
  )
}

export default LiveStats
