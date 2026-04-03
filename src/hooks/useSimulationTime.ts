import { useFrame } from '@react-three/fiber'
import { useMissionStore } from '../store/missionStore'

export const useSimulationTime = () => {
  useFrame((_, delta) => {
    const state = useMissionStore.getState()
    if (!state.isPlaying) return
    const nextDate = new Date(
      state.simulationDate.getTime() + delta * state.simulationSpeed * 86400000
    )

    const nextT = (state.spacecraftT + delta * 0.02 * state.simulationSpeed) % 1
    const phase = Math.floor(nextT * 8)

    useMissionStore.setState({
      simulationDate: nextDate,
      spacecraftT: nextT,
      activePhase: phase,
    })
  })
}
