export const randomNormal = (mean = 0, stddev = 1): number => {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  const normal = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  return normal * stddev + mean
}

export const boundAndRound = (
  min: number,
  target: number,
  max: number
): number => {
  return Math.max(min, Math.min(max, Math.round(target)))
}
