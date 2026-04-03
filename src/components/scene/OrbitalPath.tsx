import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { AU_SCALE, celestialBodies } from '../../core/constants/celestialBodies'
import { useMissionStore } from '../../store/missionStore'

const OrbitalPath = () => {
  const origin = useMissionStore((s) => s.origin)
  const destination = useMissionStore((s) => s.destination)

  const rings = useMemo(() => {
    return celestialBodies
      .filter((body) => body.orbitalRadius > 0 && body.id !== 'moon')
      .map((body) => {
        const curve = new THREE.EllipseCurve(
          0,
          0,
          body.orbitalRadius * AU_SCALE,
          body.orbitalRadius * AU_SCALE,
          0,
          Math.PI * 2,
          false,
          0
        )
        const points = curve.getPoints(180).map((p) => new THREE.Vector3(p.x, 0, p.y))
        return { body, points }
      })
  }, [])

  return (
    <group>
      {rings.map(({ body, points }) => {
        const isOrigin = body.id === origin
        const isDestination = body.id === destination
        return (
          <Line
            key={body.id}
            points={points}
            color={isOrigin ? '#ff6b2b' : isDestination ? '#00d4ff' : '#9fb0c9'}
            transparent
            opacity={isOrigin || isDestination ? 0.35 : 0.15}
            lineWidth={1}
          />
        )
      })}
    </group>
  )
}

export default OrbitalPath
