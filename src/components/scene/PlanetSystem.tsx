import { celestialBodies } from '../../core/constants/celestialBodies'
import { usePlanetPositions } from '../../hooks/usePlanetPositions'
import Planet from './Planet'

const PlanetSystem = () => {
  const positions = usePlanetPositions()

  return (
    <group>
      {celestialBodies
        .filter((body) => body.id !== 'sun')
        .map((body) => (
          <Planet key={body.id} body={body} position={positions[body.id]} />
        ))}
    </group>
  )
}

export default PlanetSystem
