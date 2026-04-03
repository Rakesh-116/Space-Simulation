import * as THREE from 'three'
import { AU_SCALE } from '../constants/celestialBodies'
import type { CelestialBody } from '../constants/celestialBodies'

const J2000 = new Date('2000-01-01T12:00:00Z')

export const getPlanetPosition = (body: CelestialBody, date: Date) => {
  if (body.orbitalRadius === 0) {
    return new THREE.Vector3(0, 0, 0)
  }

  const daysSinceJ2000 = (date.getTime() - J2000.getTime()) / 86400000
  const meanMotion = (2 * Math.PI) / body.orbitalPeriod
  const angle = meanMotion * daysSinceJ2000
  const r = body.orbitalRadius * AU_SCALE
  const inclination = (body.inclination * Math.PI) / 180

  return new THREE.Vector3(
    Math.cos(angle) * r,
    Math.sin(inclination) * Math.sin(angle) * r * 0.1,
    Math.sin(angle) * r
  )
}
