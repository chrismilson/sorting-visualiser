export type WakeLockType = 'screen' | 'system'

export interface WakeLockSentinel<T extends WakeLockType> {
  readonly released: boolean
  readonly type: T
  release(): Promise<undefined>
  onrelease: EventHandlerNonNull
}

export interface WakeLock {
  request<T extends WakeLockType>(type: T): Promise<WakeLockSentinel<T>>
}

export interface NavigatorWakeLock {
  readonly wakeLock: WakeLock
}
