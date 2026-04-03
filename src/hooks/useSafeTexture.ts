import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'

const createSolidTexture = (color: string) => {
  const size = 8
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.fillStyle = color
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export const useSafeTexture = (url?: string, fallbackColor = '#888888') => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const fallback = useMemo(() => createSolidTexture(fallbackColor), [fallbackColor])

  useEffect(() => {
    if (!url) {
      setTexture(null)
      return
    }
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    loader.load(
      url,
      (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace
        setTexture(loaded)
      },
      undefined,
      () => {
        setTexture(null)
      }
    )
  }, [url])

  return texture ?? fallback
}
