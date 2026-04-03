import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { ReactNode } from 'react'
import * as THREE from 'three'

interface SceneProps {
  children: ReactNode
}

const Scene = ({ children }: SceneProps) => {
  return (
    <Canvas
      camera={{ position: [1.5, 8, 2], fov: 55 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#000008']} />
      <ambientLight intensity={0.3} />
      <directionalLight
        intensity={1.1}
        position={[4, 6, 3]}
        color={new THREE.Color('#ffffff')}
      />
      {children}
      <OrbitControls enablePan enableRotate enableZoom target={[1.5, 0, 0]} />
    </Canvas>
  )
}

export default Scene
