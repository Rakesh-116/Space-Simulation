import { useMemo } from 'react'
import * as THREE from 'three'
import { useMissionStore } from '../store/missionStore'

export const useTrajectory = () => {
  const trajectoryPoints = useMissionStore((s) => s.trajectoryPoints)
  const curve = useMemo(() => {
    if (!trajectoryPoints.length) return null
    return new THREE.CatmullRomCurve3(trajectoryPoints)
  }, [trajectoryPoints])

  return { trajectoryPoints, curve }
}
