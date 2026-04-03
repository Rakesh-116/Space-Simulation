import { useMemo } from 'react'
import * as THREE from 'three'

const Starfield = () => {
  const positions = useMemo(() => {
    const points = new Float32Array(6000 * 3)
    for (let i = 0; i < 6000; i += 1) {
      const idx = i * 3
      const radius = 160
      points[idx] = (Math.random() - 0.5) * radius
      points[idx + 1] = (Math.random() - 0.5) * radius
      points[idx + 2] = (Math.random() - 0.5) * radius
    }
    return points
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color={new THREE.Color('#b6d0ff')}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  )
}

export default Starfield
