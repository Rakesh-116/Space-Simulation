import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { useSimulationTime } from '../../hooks/useSimulationTime'
import { useMissionStore } from '../../store/missionStore'
import LaunchPoint from './LaunchPoint'
import OrbitalPath from './OrbitalPath'
import PlanetSystem from './PlanetSystem'
import Spacecraft from './Spacecraft'
import Starfield from './Starfield'
import Sun from './Sun'
import TrajectoryArc from './TrajectoryArc'

const CameraRig = ({
  spacecraftRef,
}: {
  spacecraftRef: React.MutableRefObject<THREE.Mesh | null>
}) => {
  const { camera } = useThree()
  const cameraMode = useMissionStore((s) => s.cameraMode)
  const cinematicOffset = useMemo(() => new THREE.Vector3(8, 4, 8), [])

  useFrame(({ clock }) => {
    if (cameraMode === 'follow' && spacecraftRef.current) {
      const target = spacecraftRef.current.position.clone()
      const desired = target.clone().add(new THREE.Vector3(1.8, 1, 2.4))
      camera.position.lerp(desired, 0.06)
      camera.lookAt(target)
    } else if (cameraMode === 'top') {
      const desired = new THREE.Vector3(0, 60, 0)
      camera.position.lerp(desired, 0.05)
      camera.lookAt(0, 0, 0)
    } else if (cameraMode === 'cinematic') {
      const t = clock.elapsedTime * 0.1
      const desired = new THREE.Vector3(
        Math.cos(t) * cinematicOffset.x,
        cinematicOffset.y + Math.sin(t * 0.7) * 2,
        Math.sin(t) * cinematicOffset.z
      )
      camera.position.lerp(desired, 0.05)
      camera.lookAt(0, 0, 0)
    }
  })

  return null
}

const CameraAnimator = () => {
  const { camera } = useThree()
  const trajectoryPoints = useMissionStore((s) => s.trajectoryPoints)

  useEffect(() => {
    if (!trajectoryPoints.length) return
    gsap.to(camera.position, {
      x: 0,
      y: 20,
      z: 26,
      duration: 1.6,
      ease: 'power2.out',
    })
  }, [trajectoryPoints.length, camera])

  return null
}

const SimulationController = () => {
  useSimulationTime()
  return null
}

const Scene = () => {
  const showOrbits = useMissionStore((s) => s.showOrbits)
  const cameraMode = useMissionStore((s) => s.cameraMode)
  const spacecraftRef = useRef<THREE.Mesh | null>(null)

  return (
    <Canvas
      camera={{ position: [0, 8, 14], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#00000a']} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 8, 4]} intensity={1.2} />
      <SimulationController />
      <Starfield />
      <Sun />
      {showOrbits && <OrbitalPath />}
      <PlanetSystem />
      <TrajectoryArc />
      <Spacecraft spacecraftRef={spacecraftRef} />
      <LaunchPoint />
      <CameraAnimator />
      <CameraRig spacecraftRef={spacecraftRef} />
      <OrbitControls enablePan enableRotate enableZoom enabled={cameraMode === 'free'} />
    </Canvas>
  )
}

export default Scene
