import * as THREE from 'three'
import { useMemo, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import Scene from '../components/Scene'
import Earth from '../components/Earth'
import Moon from '../components/Moon'
import Starfield from '../components/Starfield'
import TrajectoryPath from '../components/TrajectoryPath'
import Spacecraft from '../components/Spacecraft'
import HUD from '../overlay/HUD'
import { useMissionTime } from '../hooks/useMissionTime'
import { useArtemisEphemeris } from '../hooks/useArtemisEphemeris'

const MOON_ORBIT_RADIUS = 3.8
const ARTEMIS2_EPHEMERIS_URL: string | null =
  '/ephemeris/Artemis_II_OEM_2026_04_02_to_EI_v3.asc'
// Moon starts so that at ~day 5.5 (t ~ 0.55) it sits to the right for flyby.
const FLYBY_TARGET_ANGLE = 0
const MOON_TRAVEL_AT_FLYBY = (5.5 / 27.3) * Math.PI * 2
const MOON_INITIAL_ANGLE = FLYBY_TARGET_ANGLE - MOON_TRAVEL_AT_FLYBY
const MOON_FLYBY_POS = new THREE.Vector3(MOON_ORBIT_RADIUS, 0, 0)

// Artemis II schematic path (matches reference diagram geometry)
const controlPoints = [
  // Steps 1–8: two large tilted Earth orbits
  new THREE.Vector3(0.0, 0.0, -1.1), // 1
  new THREE.Vector3(0.9, 0.12, -1.3), // 2
  new THREE.Vector3(1.6, 0.18, -0.5), // 3
  new THREE.Vector3(2.2, 0.22, 0.4), // 4
  new THREE.Vector3(1.6, 0.18, 1.6), // 7 apogee
  new THREE.Vector3(0.3, 0.08, 1.8), // 5
  new THREE.Vector3(-1.2, 0.0, 0.6), // 6
  new THREE.Vector3(-1.6, 0.0, -0.6), // 8

  // second ellipse (slightly larger)
  new THREE.Vector3(-0.6, 0.0, -1.6),
  new THREE.Vector3(1.0, 0.12, -2.0),
  new THREE.Vector3(2.4, 0.2, -0.8),
  new THREE.Vector3(2.8, 0.22, 0.6),
  new THREE.Vector3(1.8, 0.16, 2.1),
  new THREE.Vector3(0.1, 0.06, 2.2),
  new THREE.Vector3(-1.6, 0.0, 0.8),
  new THREE.Vector3(-1.8, 0.0, -0.9),

  // Step 9: outbound sweep to Moon (down-right)
  new THREE.Vector3(0.4, 0.0, -1.4),
  new THREE.Vector3(1.8, -0.05, -2.6),
  new THREE.Vector3(3.0, -0.08, -2.2),
  new THREE.Vector3(3.6, -0.04, -0.8),

  // Step 10: lunar flyby loop (Moon inside, offset left)
  MOON_FLYBY_POS.clone().add(new THREE.Vector3(-0.2, 0.0, -0.6)),
  MOON_FLYBY_POS.clone().add(new THREE.Vector3(0.8, 0.0, 0.0)),
  MOON_FLYBY_POS.clone().add(new THREE.Vector3(0.2, 0.0, 1.0)),
  MOON_FLYBY_POS.clone().add(new THREE.Vector3(-0.6, 0.0, 0.4)),

  // Steps 11–14: return arc crossing between Earth and Moon
  new THREE.Vector3(2.6, 0.0, 1.4),
  new THREE.Vector3(1.8, 0.0, 0.2), // crossing
  new THREE.Vector3(0.4, 0.0, 1.4),
  new THREE.Vector3(-0.6, 0.0, 0.9),
]

const phaseMap = [
  { phase: 1, name: 'Launch', tStart: 0.0, tEnd: 0.04 },
  { phase: 2, name: 'Low Earth Orbit', tStart: 0.04, tEnd: 0.25 },
  { phase: 3, name: 'High Earth Orbit', tStart: 0.25, tEnd: 0.38 },
  { phase: 4, name: 'Trans-Lunar Injection', tStart: 0.38, tEnd: 0.45 },
  { phase: 5, name: 'Outbound Coast', tStart: 0.45, tEnd: 0.55 },
  { phase: 6, name: 'Lunar Flyby', tStart: 0.55, tEnd: 0.65 },
  { phase: 7, name: 'Return Coast', tStart: 0.65, tEnd: 0.92 },
  { phase: 8, name: 'Reentry & Splashdown', tStart: 0.92, tEnd: 1.0 },
]

const FollowCamera = ({
  target,
  enabled,
}: {
  target: React.MutableRefObject<THREE.Mesh | null>
  enabled: boolean
}) => {
  const { camera } = useThree()
  const offset = useMemo(() => new THREE.Vector3(0.8, 0.4, 1.8), [])
  useFrame(() => {
    if (!enabled || !target.current) return
    const desired = target.current.position.clone().add(offset)
    camera.position.lerp(desired, 0.08)
    camera.lookAt(target.current.position)
  })
  return null
}

const Artemis2 = () => {
  const { data: ephemeris, sampleAtT } = useArtemisEphemeris(ARTEMIS2_EPHEMERIS_URL)
  const ephemerisPoints = useMemo(() => {
    if (!ephemeris || !sampleAtT) return null
    const samples = 320
    return Array.from({ length: samples }, (_, i) => {
      const t = i / (samples - 1)
      return sampleAtT(t)
    }).filter(Boolean) as THREE.Vector3[]
  }, [ephemeris, sampleAtT])

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        ephemerisPoints ?? controlPoints,
        false,
        'catmullrom',
        0.5
      ),
    [ephemerisPoints]
  )
  const spacecraftRef = useRef<THREE.Mesh | null>(null)
  const {
    timeRef,
    elapsedDayRef,
    phaseRef,
    isPlaying,
    speed,
    activePhase,
    setActivePhase,
    togglePlay,
    setSpeed,
  } = useMissionTime()
  const [followEnabled, setFollowEnabled] = useState(false)

  return (
    <section className="page fullscreen-canvas">
      <Scene>
        <Starfield />
        <Earth />
        <Moon initialAngle={0} orbitRadius={MOON_ORBIT_RADIUS} orbitSpeed={0} />
        <TrajectoryPath
          curve={curve}
          controlPoints={ephemerisPoints ? [] : controlPoints}
          pathPoints={ephemerisPoints ?? undefined}
        />
        <Spacecraft
          curve={curve}
          timeRef={timeRef}
          elapsedDayRef={elapsedDayRef}
          phaseRef={phaseRef}
          isPlaying={isPlaying}
          speed={speed}
          onPhaseChange={setActivePhase}
          spacecraftRef={spacecraftRef}
          phaseMap={phaseMap}
          positionProvider={sampleAtT ?? undefined}
        />
        <FollowCamera target={spacecraftRef} enabled={followEnabled} />
      </Scene>
      <HUD
        isPlaying={isPlaying}
        speed={speed}
        activePhase={activePhase}
        onTogglePlay={togglePlay}
        onSetSpeed={setSpeed}
        followEnabled={followEnabled}
        onToggleFollow={() => setFollowEnabled((prev) => !prev)}
        elapsedDayRef={elapsedDayRef}
      />
    </section>
  )
}

export default Artemis2
