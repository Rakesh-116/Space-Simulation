import { create } from 'zustand'
import * as THREE from 'three'
import { celestialBodies, AU_SCALE } from '../core/constants/celestialBodies'
import type { CelestialBody } from '../core/constants/celestialBodies'
import { hohmannTransfer } from '../core/physics/hohmannTransfer'
import { calculateMissionCost } from '../core/physics/fuelCalculator'
import type { MissionCost } from '../core/physics/fuelCalculator'
import { getPlanetPosition } from '../core/physics/planetaryEphemeris'
import type { TransferResult } from '../core/physics/hohmannTransfer'

interface MissionState {
  origin: string
  destination: string
  departureDate: Date
  payloadMassKg: number
  propulsionType: 'chemical' | 'nuclear' | 'ion'
  missionType: 'flyby' | 'orbit' | 'land' | 'return'
  trajectory: TransferResult | null
  cost: MissionCost | null
  trajectoryPoints: THREE.Vector3[]
  launchWindows: Date[]
  simulationDate: Date
  simulationSpeed: number
  isPlaying: boolean
  spacecraftT: number
  activePhase: number
  selectedBody: string | null
  cameraMode: 'free' | 'follow' | 'cinematic' | 'top'
  showOrbits: boolean
  showGrid: boolean
  setOrigin: (id: string) => void
  setDestination: (id: string) => void
  setDepartureDate: (date: Date) => void
  setPayloadMass: (mass: number) => void
  setPropulsionType: (type: 'chemical' | 'nuclear' | 'ion') => void
  setMissionType: (type: 'flyby' | 'orbit' | 'land' | 'return') => void
  computeMission: () => void
  setSimulationSpeed: (speed: number) => void
  togglePlay: () => void
  selectBody: (id: string | null) => void
  setCameraMode: (mode: 'free' | 'follow' | 'cinematic' | 'top') => void
  setSpacecraftT: (t: number) => void
  setSimulationDate: (date: Date) => void
  setActivePhase: (phase: number) => void
}

const getBody = (id: string) => celestialBodies.find((body) => body.id === id) as CelestialBody

const getBodyPosition = (body: CelestialBody, date: Date) => {
  if (body.id === 'moon') {
    const earth = getBody('earth')
    const earthPos = getPlanetPosition(earth, date)
    const moonAngle = (2 * Math.PI * (date.getTime() / 86400000)) / body.orbitalPeriod
    const moonRadius = body.orbitalRadius * AU_SCALE
    return earthPos
      .clone()
      .add(new THREE.Vector3(Math.cos(moonAngle) * moonRadius, 0, Math.sin(moonAngle) * moonRadius))
  }
  return getPlanetPosition(body, date)
}

export const useMissionStore = create<MissionState>((set, get) => ({
  origin: 'earth',
  destination: 'mars',
  departureDate: new Date(),
  payloadMassKg: 20000,
  propulsionType: 'chemical',
  missionType: 'orbit',
  trajectory: null,
  cost: null,
  trajectoryPoints: [],
  launchWindows: [],
  simulationDate: new Date(),
  simulationSpeed: 10,
  isPlaying: true,
  spacecraftT: 0,
  activePhase: 0,
  selectedBody: null,
  cameraMode: 'free',
  showOrbits: true,
  showGrid: false,
  setOrigin: (id) => set({ origin: id }),
  setDestination: (id) => set({ destination: id }),
  setDepartureDate: (date) => set({ departureDate: date }),
  setPayloadMass: (mass) => set({ payloadMassKg: mass }),
  setPropulsionType: (type) => set({ propulsionType: type }),
  setMissionType: (type) => set({ missionType: type }),
  computeMission: () => {
    const state = get()
    const originBody = getBody(state.origin)
    const destBody = getBody(state.destination)
    const transfer = hohmannTransfer(
      originBody.orbitalRadius,
      destBody.orbitalRadius,
      originBody.orbitalPeriod,
      destBody.orbitalPeriod
    )
    const cost = calculateMissionCost(
      transfer.totalDeltaV,
      state.payloadMassKg,
      state.propulsionType,
      state.origin as 'earth' | 'moon' | 'mars'
    )

    const originPos = getBodyPosition(originBody, state.departureDate)
    const destDate = new Date(state.departureDate.getTime() + transfer.transferTime * 86400000)
    const destPos = getBodyPosition(destBody, destDate)
    const mid = originPos
      .clone()
      .add(destPos)
      .multiplyScalar(0.5)
      .add(new THREE.Vector3(0, originPos.length() * 0.15 + 1, 0))

    const curve = new THREE.CatmullRomCurve3([originPos, mid, destPos])
    const points = curve.getPoints(120)

    set({
      trajectory: transfer,
      cost,
      trajectoryPoints: points,
      launchWindows: transfer.launchWindows,
      spacecraftT: 0,
    })
  },
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  selectBody: (id) => set({ selectedBody: id }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setSpacecraftT: (t) => set({ spacecraftT: t }),
  setSimulationDate: (date) => set({ simulationDate: date }),
  setActivePhase: (phase) => set({ activePhase: phase }),
}))
