import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { unzipSync } from 'fflate'

export interface EphemerisPoint {
  t: number
  position: THREE.Vector3
}

interface EphemerisData {
  points: EphemerisPoint[]
  tStart: number
  tEnd: number
}

const EARTH_RADIUS_KM = 6371

const parseOem = (text: string): EphemerisData | null => {
  const lines = text.split(/\r?\n/)
  const points: EphemerisPoint[] = []
  let inData = false

  for (const line of lines) {
    if (line.startsWith('DATA_START')) {
      inData = true
      continue
    }
    if (line.startsWith('DATA_STOP')) {
      break
    }
    if (!inData || !line.trim()) continue

    const parts = line.trim().split(/\s+/)
    if (parts.length < 4) continue
    const time = Date.parse(parts[0])
    if (Number.isNaN(time)) continue
    const x = Number(parts[1])
    const y = Number(parts[2])
    const z = Number(parts[3])
    if ([x, y, z].some((v) => Number.isNaN(v))) continue

    points.push({
      t: time,
      position: new THREE.Vector3(x / EARTH_RADIUS_KM, y / EARTH_RADIUS_KM, z / EARTH_RADIUS_KM),
    })
  }

  if (!points.length) return null
  return {
    points,
    tStart: points[0].t,
    tEnd: points[points.length - 1].t,
  }
}

export const useArtemisEphemeris = (url: string | null) => {
  const [data, setData] = useState<EphemerisData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`Failed to load ephemeris (${res.status})`)
        }
        const buffer = await res.arrayBuffer()
        const zipped = new Uint8Array(buffer)
        const files = unzipSync(zipped)
        const oemEntry = Object.keys(files).find((name) => name.endsWith('.oem')) ?? ''
        if (!oemEntry) {
          throw new Error('No OEM file found in ephemeris ZIP')
        }
        const text = new TextDecoder().decode(files[oemEntry])
        const parsed = parseOem(text)
        if (!parsed) {
          throw new Error('No ephemeris data found in OEM file')
        }
        if (!cancelled) {
          setData(parsed)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Ephemeris load failed')
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [url])

  const sampleAtT = useMemo(() => {
    if (!data) return null
    return (t: number) => {
      const targetTime = data.tStart + (data.tEnd - data.tStart) * t
      const points = data.points
      let low = 0
      let high = points.length - 1
      while (low < high) {
        const mid = Math.floor((low + high) / 2)
        if (points[mid].t < targetTime) low = mid + 1
        else high = mid
      }
      const idx = Math.max(1, low)
      const prev = points[idx - 1]
      const next = points[idx]
      const span = next.t - prev.t || 1
      const alpha = (targetTime - prev.t) / span
      return prev.position.clone().lerp(next.position, alpha)
    }
  }, [data])

  return { data, sampleAtT, error }
}
