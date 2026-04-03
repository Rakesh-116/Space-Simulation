export interface CelestialBody {
  id: string
  name: string
  radius: number
  renderRadius: number
  mass: number
  color: string
  textureUrl?: string
  orbitalRadius: number
  orbitalPeriod: number
  inclination: number
  SOI: number
  surfaceGravity: number
  atmosphereDensity: number
  launchCapable: boolean
  parent?: string
}

const PLANET_SCALE = 0.08
const SUN_SCALE = 0.5

export const celestialBodies: CelestialBody[] = [
  {
    id: 'sun',
    name: 'Sun',
    radius: 696340,
    renderRadius: 2.5 * SUN_SCALE,
    mass: 1.9885e30,
    color: '#ffb34d',
    textureUrl: 'https://unpkg.com/three-globe/example/img/earth-night.jpg',
    orbitalRadius: 0,
    orbitalPeriod: 0,
    inclination: 0,
    SOI: 0,
    surfaceGravity: 274,
    atmosphereDensity: 0,
    launchCapable: false,
  },
  {
    id: 'mercury',
    name: 'Mercury',
    radius: 2439.7,
    renderRadius: 0.38 * PLANET_SCALE,
    mass: 3.301e23,
    color: '#b1a69b',
    orbitalRadius: 0.387,
    orbitalPeriod: 87.97,
    inclination: 7,
    SOI: 112000,
    surfaceGravity: 3.7,
    atmosphereDensity: 0,
    launchCapable: false,
  },
  {
    id: 'venus',
    name: 'Venus',
    radius: 6051.8,
    renderRadius: 0.95 * PLANET_SCALE,
    mass: 4.867e24,
    color: '#c9b37e',
    orbitalRadius: 0.723,
    orbitalPeriod: 224.7,
    inclination: 3.39,
    SOI: 616000,
    surfaceGravity: 8.87,
    atmosphereDensity: 0.9,
    launchCapable: false,
  },
  {
    id: 'earth',
    name: 'Earth',
    radius: 6371,
    renderRadius: 1 * PLANET_SCALE,
    mass: 5.972e24,
    color: '#4cc3ff',
    textureUrl: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    orbitalRadius: 1,
    orbitalPeriod: 365.25,
    inclination: 0,
    SOI: 924000,
    surfaceGravity: 9.81,
    atmosphereDensity: 1,
    launchCapable: true,
  },
  {
    id: 'moon',
    name: 'Moon',
    radius: 1737,
    renderRadius: 0.27 * PLANET_SCALE * 1.2,
    mass: 7.342e22,
    color: '#c9c9c9',
    textureUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/800px-FullMoon2010.jpg',
    orbitalRadius: 0.00257,
    orbitalPeriod: 27.3,
    inclination: 5.1,
    SOI: 66000,
    surfaceGravity: 1.62,
    atmosphereDensity: 0,
    launchCapable: true,
    parent: 'earth',
  },
  {
    id: 'mars',
    name: 'Mars',
    radius: 3389.5,
    renderRadius: 0.53 * PLANET_SCALE,
    mass: 6.417e23,
    color: '#d95b33',
    textureUrl:
      'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
    orbitalRadius: 1.524,
    orbitalPeriod: 687,
    inclination: 1.85,
    SOI: 577000,
    surfaceGravity: 3.71,
    atmosphereDensity: 0.2,
    launchCapable: true,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    radius: 69911,
    renderRadius: 11.2 * PLANET_SCALE * 0.6,
    mass: 1.898e27,
    color: '#f3d2a3',
    textureUrl:
      'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
    orbitalRadius: 5.203,
    orbitalPeriod: 4331,
    inclination: 1.3,
    SOI: 48200000,
    surfaceGravity: 24.79,
    atmosphereDensity: 0.9,
    launchCapable: false,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    radius: 58232,
    renderRadius: 9.45 * PLANET_SCALE * 0.55,
    mass: 5.683e26,
    color: '#e7d3a1',
    orbitalRadius: 9.539,
    orbitalPeriod: 10747,
    inclination: 2.49,
    SOI: 54800000,
    surfaceGravity: 10.44,
    atmosphereDensity: 0.8,
    launchCapable: false,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    radius: 25362,
    renderRadius: 4.0 * PLANET_SCALE * 0.55,
    mass: 8.681e25,
    color: '#8fe0ff',
    orbitalRadius: 19.18,
    orbitalPeriod: 30589,
    inclination: 0.77,
    SOI: 51800000,
    surfaceGravity: 8.69,
    atmosphereDensity: 0.6,
    launchCapable: false,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    radius: 24622,
    renderRadius: 3.9 * PLANET_SCALE * 0.55,
    mass: 1.024e26,
    color: '#4f6cff',
    orbitalRadius: 30.07,
    orbitalPeriod: 59800,
    inclination: 1.77,
    SOI: 86600000,
    surfaceGravity: 11.15,
    atmosphereDensity: 0.6,
    launchCapable: false,
  },
]

export const AU_SCALE = 30
export const PLANET_SCALE_FACTOR = PLANET_SCALE
export const SUN_SCALE_FACTOR = SUN_SCALE
