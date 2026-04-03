import * as THREE from 'three'
import { celestialBodies } from '../core/constants/celestialBodies'
import { getPlanetPosition } from '../core/physics/planetaryEphemeris'
import { AU_SCALE } from '../core/constants/celestialBodies'
import { useMissionStore } from '../store/missionStore'

export const usePlanetPositions = () => {
  const simulationDate = useMissionStore((s) => s.simulationDate)
  const positions: Record<string, THREE.Vector3> = {}

  celestialBodies.forEach((body) => {
    if (body.id === 'moon') {
      const earth = celestialBodies.find((item) => item.id === 'earth')
      const earthPos = getPlanetPosition(earth!, simulationDate)
      const angle =
        (2 * Math.PI * (simulationDate.getTime() / 86400000)) / body.orbitalPeriod
      const moonRadius = body.orbitalRadius * AU_SCALE
      positions[body.id] = earthPos
        .clone()
        .add(new THREE.Vector3(Math.cos(angle) * moonRadius, 0, Math.sin(angle) * moonRadius))
    } else {
      positions[body.id] = getPlanetPosition(body, simulationDate)
    }
  })

  return positions
}
