import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

interface TrajectoryPathProps {
  curve?: THREE.CatmullRomCurve3
  controlPoints?: THREE.Vector3[]
  pathPoints?: THREE.Vector3[]
}

const TrajectoryPath = ({ curve, controlPoints = [], pathPoints }: TrajectoryPathProps) => {
  const { outboundPoints, flybyPoints, returnPoints, arrowData } = useMemo(() => {
    const points = pathPoints ?? curve?.getPoints(200) ?? []
    const outbound = points.slice(0, 110)
    const flyby = points.slice(110, 130)
    const ret = points.slice(130)

    const arrows: { pos: THREE.Vector3; dir: THREE.Vector3; color: string }[] = []
    if (curve) {
      for (let t = 0.1; t < 1.0; t += 0.15) {
        const pos = curve.getPointAt(t)
        const dir = curve.getTangentAt(t).normalize()
        const color = t < 0.55 ? '#8b9a2e' : t < 0.65 ? '#1a3a8a' : '#cc2e8a'
        arrows.push({ pos, dir, color })
      }
    }

    return { outboundPoints: outbound, flybyPoints: flyby, returnPoints: ret, arrowData: arrows }
  }, [curve, pathPoints])

  return (
    <group>
      <Line
        points={outboundPoints}
        color="#8b9a2e"
        lineWidth={1.2}
        dashed
        dashSize={0.05}
        gapSize={0.03}
        transparent
        opacity={0.85}
      />
      <Line
        points={flybyPoints}
        color="#1a3a8a"
        lineWidth={1.4}
        dashed
        dashSize={0.05}
        gapSize={0.03}
        transparent
        opacity={0.9}
      />
      <Line
        points={returnPoints}
        color="#cc2e8a"
        lineWidth={1.2}
        dashed
        dashSize={0.05}
        gapSize={0.03}
        transparent
        opacity={0.85}
      />
      {controlPoints.map((point, idx) => (
        <mesh key={idx} position={point}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {arrowData.map((arrow, idx) => {
        const quaternion = new THREE.Quaternion()
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrow.dir)
        return (
          <mesh key={idx} position={arrow.pos} quaternion={quaternion}>
            <coneGeometry args={[0.04, 0.12, 12]} />
            <meshBasicMaterial color={arrow.color} />
          </mesh>
        )
      })}
    </group>
  )
}

export default TrajectoryPath
