import * as THREE from 'three'

interface LambertResult {
  v1: THREE.Vector3
  v2: THREE.Vector3
}

const stumpffC = (z: number) => {
  if (z > 0) {
    return (1 - Math.cos(Math.sqrt(z))) / z
  }
  if (z < 0) {
    return (1 - Math.cosh(Math.sqrt(-z))) / z
  }
  return 0.5
}

const stumpffS = (z: number) => {
  if (z > 0) {
    const sz = Math.sqrt(z)
    return (sz - Math.sin(sz)) / (sz ** 3)
  }
  if (z < 0) {
    const sz = Math.sqrt(-z)
    return (Math.sinh(sz) - sz) / (sz ** 3)
  }
  return 1 / 6
}

export const solveLambert = (
  r1: THREE.Vector3,
  r2: THREE.Vector3,
  tofSeconds: number,
  mu: number
): LambertResult => {
  const r1Mag = r1.length()
  const r2Mag = r2.length()
  const cosDeltaNu = r1.dot(r2) / (r1Mag * r2Mag)
  const sinDeltaNu = Math.sqrt(Math.max(0, 1 - cosDeltaNu ** 2))
  const A = sinDeltaNu * Math.sqrt((r1Mag * r2Mag) / (1 - cosDeltaNu))

  let z = 0
  let zUpper = 4 * Math.PI ** 2
  let zLower = -4 * Math.PI ** 2

  for (let i = 0; i < 100; i += 1) {
    const C = stumpffC(z)
    const S = stumpffS(z)
    const y = r1Mag + r2Mag + (A * (z * S - 1)) / Math.sqrt(C)

    if (A > 0 && y < 0) {
      z += 0.1
      continue
    }

    const x = Math.sqrt(y / C)
    const tof = (x ** 3 * S + A * Math.sqrt(y)) / Math.sqrt(mu)

    if (Math.abs(tof - tofSeconds) < 1e-6) {
      break
    }

    if (tof <= tofSeconds) {
      zLower = z
    } else {
      zUpper = z
    }
    z = (zUpper + zLower) / 2
  }

  const C = stumpffC(z)
  const S = stumpffS(z)
  const y = r1Mag + r2Mag + (A * (z * S - 1)) / Math.sqrt(C)
  const f = 1 - y / r1Mag
  const g = A * Math.sqrt(y / mu)
  const gDot = 1 - y / r2Mag

  const v1 = r2.clone().sub(r1.clone().multiplyScalar(f)).divideScalar(g)
  const v2 = r2.clone().multiplyScalar(gDot).sub(r1).divideScalar(g)

  return { v1, v2 }
}
