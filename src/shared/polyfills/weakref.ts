// WeakRef polyfill — must load before React Navigation (which uses WeakRef internally).
// Modern Hermes/JSC implement WeakRef; this is a safe no-op shim for environments that don't.
if (typeof (globalThis as { WeakRef?: unknown }).WeakRef === 'undefined') {
  class WeakRefShim<T extends object> {
    private readonly value: T
    constructor(value: T) {
      this.value = value
    }
    deref(): T | undefined {
      return this.value
    }
  }
  ;(globalThis as { WeakRef?: unknown }).WeakRef = WeakRefShim
}
export {}
