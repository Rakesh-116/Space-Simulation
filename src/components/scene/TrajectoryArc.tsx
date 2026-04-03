import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import { useTrajectory } from '../../hooks/useTrajectory'

const TrajectoryArc = () => {
  const { trajectoryPoints } = useTrajectory()

  const markerPoints = useMemo(() => {
    if (!trajectoryPoints.length) return []
    const markers = []
    for (let i = 0; i <= 10; i += 1) {
      const index = Math.floor((trajectoryPoints.length - 1) * (i / 10))
      markers.push(trajectoryPoints[index])
    }
    return markers
  }, [trajectoryPoints])

  if (!trajectoryPoints.length) return null

  return (
    <group>
      <Line
        points={trajectoryPoints}
        color="#ffffff"
        dashed
        dashSize={0.6}
        gapSize={0.3}
        lineWidth={1.2}
        transparent
        opacity={0.8}
      />
      {markerPoints.map((point, idx) => (
        <mesh key={idx} position={point}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={idx === 0 ? '#ff6b2b' : '#00d4ff'} />
        </mesh>
      ))}
    </group>
  )
}

export default TrajectoryArc
