import { Algorithm } from '../types'

export const combine = (...algorithms: Algorithm[]): Algorithm => (tracker) => {
  algorithms.forEach((algorithm) => algorithm(tracker))
}

export const repeat = (algorithm: Algorithm, times: number): Algorithm => (
  tracker
) => {
  for (let i = 0; i < times; i++) algorithm(tracker)
}
