export interface MissionCost {
  fuelMassKg: number
  launchCostUSD: number
  totalMissionCostUSD: number
  breakdownByPhase: {
    earthLaunch: number
    transitionBurn: number
    midCourseCorrectionBudget: number
    orbitalInsertion: number
    landing?: number
    returnMission?: number
  }
  costPerKgToDestination: number
  comparisonCosts: {
    apolloEquivalent: number
    starshipEstimate: number
  }
}

const ISP_MAP: Record<'chemical' | 'nuclear' | 'ion', number> = {
  chemical: 450,
  nuclear: 900,
  ion: 3000,
}

const G0 = 9.80665

export const calculateMissionCost = (
  deltaV: number,
  payloadMass: number,
  propulsionType: 'chemical' | 'nuclear' | 'ion',
  origin: 'earth' | 'moon' | 'mars'
): MissionCost => {
  const isp = ISP_MAP[propulsionType]
  const deltaVMps = deltaV * 1000
  const massRatio = Math.exp(deltaVMps / (isp * G0))
  const fuelMass = payloadMass * (massRatio - 1)

  const launchCostPerKg = origin === 'moon' ? 800 : origin === 'mars' ? 1200 : 2500
  const launchCost = payloadMass * launchCostPerKg
  const transitionBurn = fuelMass * 120
  const midCourse = transitionBurn * 0.15
  const orbitalInsertion = transitionBurn * 0.25

  const totalMissionCost =
    launchCost + transitionBurn + midCourse + orbitalInsertion

  return {
    fuelMassKg: Math.round(fuelMass),
    launchCostUSD: Math.round(launchCost),
    totalMissionCostUSD: Math.round(totalMissionCost),
    breakdownByPhase: {
      earthLaunch: Math.round(launchCost),
      transitionBurn: Math.round(transitionBurn),
      midCourseCorrectionBudget: Math.round(midCourse),
      orbitalInsertion: Math.round(orbitalInsertion),
    },
    costPerKgToDestination: Math.round(totalMissionCost / payloadMass),
    comparisonCosts: {
      apolloEquivalent: Math.round(totalMissionCost * 1.6),
      starshipEstimate: Math.round(totalMissionCost * 0.35),
    },
  }
}
