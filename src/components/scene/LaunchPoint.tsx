import { useMemo } from 'react'
import * as THREE from 'three'
import { usePlanetPositions } from '../../hooks/usePlanetPositions'
import { useMissionStore } from '../../store/missionStore'

const LaunchPoint = () => {
  const origin = useMissionStore((s) => s.origin)
  const positions = usePlanetPositions()

  const position = useMemo(() => positions[origin] ?? new THREE.Vector3(), [origin, positions])

  return (
    <mesh position={position}>
      <coneGeometry args={[0.2, 0.4, 12]} />
      <meshStandardMaterial color="#ff6b2b" emissive="#ff6b2b" emissiveIntensity={0.6} />
    </mesh>
  )
}

export default LaunchPoint
