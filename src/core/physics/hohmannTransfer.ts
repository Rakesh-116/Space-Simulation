export interface TransferResult {
  deltaV1: number
  deltaV2: number
  totalDeltaV: number
  transferTime: number
  transferAngle: number
  launchWindows: Date[]
  synodicPeriod: number
}

const AU_METERS = 1.495978707e11
const MU_SUN = 1.327e20

export const hohmannTransfer = (
  originAU: number,
  destAU: number,
  originPeriodDays: number,
  destPeriodDays: number
): TransferResult => {
  const r1 = originAU * AU_METERS
  const r2 = destAU * AU_METERS
  const a = (r1 + r2) / 2
  const transferTimeSec = Math.PI * Math.sqrt((a ** 3) / MU_SUN)
  const transferTimeDays = transferTimeSec / 86400

  const deltaV1 =
    Math.sqrt(MU_SUN / r1) * (Math.sqrt((2 * r2) / (r1 + r2)) - 1)
  const deltaV2 =
    Math.sqrt(MU_SUN / r2) * (1 - Math.sqrt((2 * r1) / (r1 + r2)))
  const deltaV1Km = deltaV1 / 1000
  const deltaV2Km = Math.abs(deltaV2 / 1000)

  const meanMotionDest = (2 * Math.PI) / (destPeriodDays * 86400)
  const transferAngle = Math.PI - meanMotionDest * transferTimeSec

  const synodicPeriod =
    1 / Math.abs(1 / originPeriodDays - 1 / destPeriodDays)

  const now = new Date()
  const launchWindows = Array.from({ length: 5 }).map((_, idx) => {
    const offsetDays = synodicPeriod * (0.25 + idx)
    return new Date(now.getTime() + offsetDays * 86400000)
  })

  return {
    deltaV1: Number(deltaV1Km.toFixed(2)),
    deltaV2: Number(deltaV2Km.toFixed(2)),
    totalDeltaV: Number((deltaV1Km + deltaV2Km).toFixed(2)),
    transferTime: Number(transferTimeDays.toFixed(1)),
    transferAngle,
    launchWindows,
    synodicPeriod: Number(synodicPeriod.toFixed(1)),
  }
}
