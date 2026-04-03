import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useSafeTexture } from '../hooks/useSafeTexture'

interface MoonProps {
  initialAngle?: number
  orbitSpeed?: number
  orbitRadius?: number
  isPlaying?: boolean
  speedMultiplier?: number
  missionTRef?: React.MutableRefObject<number>
  missionDurationDays?: number
}

const Moon = ({
  initialAngle = 0,
  orbitSpeed = 0.08,
  orbitRadius = 3.2,
  isPlaying = true,
  speedMultiplier = 1,
  missionTRef,
  missionDurationDays = 10,
}: MoonProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const elapsedRef = useRef(0)
  const texture = useSafeTexture(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/800px-FullMoon2010.jpg',
    '#bdbdbd'
  )

  useFrame((_, delta) => {
    let angle = initialAngle
    if (missionTRef) {
      const missionDays = missionTRef.current * missionDurationDays
      const moonTravel = (missionDays / 27.3) * Math.PI * 2
      angle += moonTravel
    } else {
      if (isPlaying) {
        elapsedRef.current += delta * speedMultiplier
      }
      angle += elapsedRef.current * orbitSpeed
    }
    const x = Math.cos(angle) * orbitRadius
    const z = Math.sin(angle) * orbitRadius
    if (meshRef.current) {
      meshRef.current.position.set(x, 0, z)
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.27, 48, 48]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

export default Moon
