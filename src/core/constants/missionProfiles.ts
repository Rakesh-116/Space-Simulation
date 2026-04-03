export interface MissionPreset {
  id: string
  name: string
  origin: string
  destination: string
  missionType: 'flyby' | 'orbit' | 'land' | 'return'
  departureDate: string
  note?: string
}

export const PRESETS: MissionPreset[] = [
  {
    id: 'artemis2',
    name: 'Artemis 2',
    origin: 'earth',
    destination: 'moon',
    missionType: 'flyby',
    departureDate: '2026-04-07',
    note: 'Uses historical figure-8 flyby path',
  },
  {
    id: 'earth-mars-2033',
    name: 'Earth → Mars 2033',
    origin: 'earth',
    destination: 'mars',
    missionType: 'land',
    departureDate: '2033-10-15',
  },
  {
    id: 'moon-mars',
    name: 'Moon → Mars',
    origin: 'moon',
    destination: 'mars',
    missionType: 'orbit',
    departureDate: '2031-06-11',
    note: 'Lower delta-v due to lunar launch',
  },
  {
    id: 'earth-jupiter',
    name: 'Earth → Jupiter',
    origin: 'earth',
    destination: 'jupiter',
    missionType: 'flyby',
    departureDate: '2031-02-05',
  },
]
