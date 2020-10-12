/**
 * Provides an API to the ui that wraps calls to the worker etc with promises.
 */
import * as Comlink from 'comlink'
import { WorkerCalculateMethod, MainThreadCalculateMethod } from './types'
import Untracker from './Untracker'

/**
 * A proxy (via comlink) to an off thread calculation method.
 */
let proxy: Comlink.Remote<WorkerCalculateMethod> | undefined

const init = (async () => {
  const Worker = (await import('worker-loader!./sort.worker.ts')).default
  const worker = new Worker()
  proxy = Comlink.wrap<WorkerCalculateMethod>(worker)
})()

const calculate: MainThreadCalculateMethod = async (
  type: 'sort' | 'unsort',
  name: string,
  valuesToSort: number[],
  valuesToTrack: number[]
) => {
  // Wait until the worker is initialised.
  await init

  console.log(`Main Thread: Deploying ${type}: ${name}`)

  const [buffer, numMoves, calculatedValues] = await (proxy as Comlink.Remote<
    WorkerCalculateMethod
  >)(type, name, valuesToSort)

  console.log(`Main Thread: Received ${type} data: ${name}`)

  return [new Untracker(buffer, numMoves, valuesToTrack), calculatedValues]
}

export default calculate
