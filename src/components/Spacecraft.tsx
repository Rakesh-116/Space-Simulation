import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

interface SpacecraftProps {
  curve?: THREE.CatmullRomCurve3
  timeRef: React.MutableRefObject<number>
  elapsedDayRef: React.MutableRefObject<number>
  phaseRef: React.MutableRefObject<number>
  isPlaying: boolean
  speed: number
  onPhaseChange: (phase: number) => void
  spacecraftRef: React.MutableRefObject<THREE.Mesh | null>
  phaseMap?: { tStart: number; tEnd: number }[]
  positionProvider?: (t: number) => THREE.Vector3 | null
}

const Spacecraft = ({
  curve,
  timeRef,
  elapsedDayRef,
  phaseRef,
  isPlaying,
  speed,
  onPhaseChange,
  spacecraftRef,
  phaseMap,
  positionProvider,
}: SpacecraftProps) => {
  const trailPointsRef = useRef<THREE.Vector3[]>([])
  const trailPositions = useMemo(() => new Float32Array(40 * 3), [])
  const trailLine = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const material = new THREE.LineBasicMaterial({ color: '#ff6b2b', transparent: true, opacity: 0.6 })
    return new THREE.Line(geometry, material)
  }, [])

  useEffect(() => {
    trailPointsRef.current = []
  }, [])

  useFrame((_, delta) => {
    if (!isPlaying) return

    const step = (delta * speed) / 30
    timeRef.current = (timeRef.current + step) % 1

    const point = positionProvider
      ? positionProvider(timeRef.current) ?? curve?.getPointAt(timeRef.current)
      : curve?.getPointAt(timeRef.current)
    if (spacecraftRef.current) {
      if (point) {
        spacecraftRef.current.position.copy(point)
      }
    }

    if (point) {
      trailPointsRef.current.push(point.clone())
    }
    if (trailPointsRef.current.length > 40) {
      trailPointsRef.current.shift()
    }

    trailPointsRef.current.forEach((p, idx) => {
      trailPositions[idx * 3] = p.x
      trailPositions[idx * 3 + 1] = p.y
      trailPositions[idx * 3 + 2] = p.z
    })

    const geometry = trailLine.geometry as THREE.BufferGeometry
    geometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
    geometry.setDrawRange(0, trailPointsRef.current.length)

    elapsedDayRef.current = Math.floor(timeRef.current * 10) + 1
    const phase = phaseMap
      ? Math.max(
          0,
          phaseMap.findIndex(
            (item) =>
              timeRef.current >= item.tStart && timeRef.current < item.tEnd
          )
        )
      : Math.floor(timeRef.current * 8)
    if (phase !== phaseRef.current) {
      phaseRef.current = phase
      onPhaseChange(phase)
    }
  })

  if (!curve && !positionProvider) return null

  return (
    <group>
      <mesh ref={spacecraftRef}>
        <sphereGeometry args={[0.04, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.6}
        />
        <pointLight intensity={0.8} color="#ffb27a" distance={3} />
      </mesh>
      <primitive object={trailLine} />
    </group>
  )
}

export default Spacecraft
