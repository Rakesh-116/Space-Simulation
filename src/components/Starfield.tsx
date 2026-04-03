import { useMemo } from 'react'
import * as THREE from 'three'

const Starfield = () => {
  const { positions } = useMemo(() => {
    const points = new Float32Array(8000 * 3)
    for (let i = 0; i < 8000; i += 1) {
      const idx = i * 3
      const radius = 80
      points[idx] = (Math.random() - 0.5) * radius
      points[idx + 1] = (Math.random() - 0.5) * radius
      points[idx + 2] = (Math.random() - 0.5) * radius
    }
    return { positions: points }
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
        size={0.08}
        color={new THREE.Color('#c7d7ff')}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  )
}

export default Starfield
