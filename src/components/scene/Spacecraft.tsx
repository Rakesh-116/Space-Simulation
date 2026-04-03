import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useTrajectory } from '../../hooks/useTrajectory'
import { useMissionStore } from '../../store/missionStore'

interface SpacecraftProps {
  spacecraftRef?: React.MutableRefObject<THREE.Mesh | null>
}

const Spacecraft = ({ spacecraftRef }: SpacecraftProps) => {
  const localRef = useRef<THREE.Mesh>(null)
  const meshRef = spacecraftRef ?? localRef
  const { curve } = useTrajectory()
  const spacecraftT = useMissionStore((s) => s.spacecraftT)

  useFrame(() => {
    if (!curve || !meshRef.current) return
    const point = curve.getPointAt(spacecraftT)
    meshRef.current.position.copy(point)
  })

  if (!curve) return null

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.12, 24, 24]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ff6b2b"
        emissiveIntensity={0.8}
      />
      <pointLight intensity={1.2} color="#ff6b2b" distance={8} />
    </mesh>
  )
}

export default Spacecraft
