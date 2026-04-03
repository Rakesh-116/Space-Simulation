import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useSafeTexture } from '../hooks/useSafeTexture'

const Earth = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useSafeTexture(
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    '#2c7bd9'
  )

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (Math.PI * 2) / 60
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <mesh scale={[1.06, 1.06, 1.06]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color={new THREE.Color('#4cc3ff')}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

export default Earth
