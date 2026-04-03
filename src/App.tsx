import { NavLink, Route, Routes } from 'react-router-dom'
import Artemis2 from './pages/Artemis2'
import CosmosNavigator from './pages/CosmosNavigator'
import Missions from './pages/Missions'

const App = () => {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-title">COSMOS NAVIGATOR</span>
          <span className="brand-sub">Mission Systems Lab</span>
        </div>
        <nav className="nav">
          <NavLink
            to="/cosmos"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Cosmos Planner
          </NavLink>
          <NavLink
            to="/missions"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Past Missions
          </NavLink>
          <NavLink
            to="/missions/artemis2"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Artemis 2
          </NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<CosmosNavigator />} />
        <Route path="/cosmos" element={<CosmosNavigator />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/missions/artemis2" element={<Artemis2 />} />
      </Routes>
    </div>
  )
}

export default App
