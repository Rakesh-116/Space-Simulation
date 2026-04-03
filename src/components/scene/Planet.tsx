import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { CelestialBody } from '../../core/constants/celestialBodies'
import { useMissionStore } from '../../store/missionStore'
import { useSafeTexture } from '../../hooks/useSafeTexture'

const createProceduralTexture = (color: string) => {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.fillStyle = color
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 2000; i += 1) {
    const x = Math.random() * size
    const y = Math.random() * size
    const radius = Math.random() * 2 + 0.5
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.25})`
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  return new THREE.CanvasTexture(canvas)
}

interface PlanetProps {
  body: CelestialBody
  position: THREE.Vector3
}

const Planet = ({ body, position }: PlanetProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const origin = useMissionStore((s) => s.origin)
  const destination = useMissionStore((s) => s.destination)
  const selectBody = useMissionStore((s) => s.selectBody)
  const texture = useSafeTexture(body.textureUrl, body.color)
  const proceduralTexture = useMemo(
    () => (body.textureUrl ? null : createProceduralTexture(body.color)),
    [body.color, body.textureUrl]
  )

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    if (body.id === origin) {
      meshRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.05)
    } else if (body.id === destination) {
      meshRef.current.scale.setScalar(1 + Math.cos(clock.elapsedTime * 3) * 0.05)
    } else {
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1)
    }
  })

  const isOrigin = body.id === origin
  const isDestination = body.id === destination
  const glowColor = isOrigin ? '#ff6b2b' : isDestination ? '#00d4ff' : body.color

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => selectBody(body.id)}
      >
        <sphereGeometry args={[body.renderRadius, 48, 48]} />
        <meshStandardMaterial
          map={body.textureUrl ? texture ?? undefined : proceduralTexture ?? undefined}
          color={body.color}
          emissive={glowColor}
          emissiveIntensity={isOrigin || isDestination ? 0.6 : 0.15}
        />
      </mesh>
      {(hovered || isOrigin || isDestination) && (
        <Html center>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: '#ffffff',
              background: 'rgba(0,0,0,0.6)',
              padding: '4px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.15)',
              whiteSpace: 'nowrap',
            }}
          >
            {body.name}
          </div>
        </Html>
      )}
    </group>
  )
}

export default Planet
