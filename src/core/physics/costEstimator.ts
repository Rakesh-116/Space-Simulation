import { calculateMissionCost } from './fuelCalculator'

export const estimateCostForDeltaV = (
  deltaV: number,
  payloadMass: number,
  propulsionType: 'chemical' | 'nuclear' | 'ion',
  origin: 'earth' | 'moon' | 'mars'
) => {
  return calculateMissionCost(deltaV, payloadMass, propulsionType, origin)
}
