import { celestialBodies } from '../../core/constants/celestialBodies'
import { useSafeTexture } from '../../hooks/useSafeTexture'

const Sun = () => {
  const sun = celestialBodies.find((body) => body.id === 'sun')
  const texture = useSafeTexture(sun?.textureUrl, '#ffb34d')

  return (
    <mesh>
      <sphereGeometry args={[sun?.renderRadius ?? 2, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        color={sun?.color ?? '#ffb34d'}
        emissive={sun?.color ?? '#ffb34d'}
        emissiveIntensity={0.6}
      />
    </mesh>
  )
}

export default Sun
