/**
 * Provides an API to the ui that wraps calls to the worker etc with promises.
 */
import * as Comlink from 'comlink'
import { CalculateMethod, CalculateMethodAsync } from './types'

/**
 * A proxy (via comlink) to an off thread calculation method.
 */
let proxy: Comlink.Remote<CalculateMethod> | undefined

const init = (async () => {
  const Worker = (await import('worker-loader!./sort.worker.ts')).default
  const worker = new Worker()
  proxy = Comlink.wrap<CalculateMethod>(worker)
})()

const calculate: CalculateMethodAsync = async (
  type: 'sort' | 'unsort',
  name: string,
  values: number[]
) => {
  // Wait until the worker is initialised.
  await init

  console.log(`Main Thread: Deploying ${type}: ${name}`)

  const result = await (proxy as Comlink.Remote<CalculateMethod>)(
    type,
    name,
    values
  )

  console.log(`Main Thread: Received ${type} data: ${name}`)

  return result
}

export default calculate
