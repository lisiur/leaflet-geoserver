export interface CacheConfig {
  pull?: boolean
}

export default class Cache {
  private store: Map<string, Map<string, any>>
  private defaultCache: boolean
  constructor(defaultCache: boolean) {
    this.store = new Map()
    this.defaultCache = defaultCache ?? true
  }
  cache<F extends (...params: unknown[]) => unknown, P = Parameters<F>, R = ReturnType<F>>(fn: F) {
    const defaultCache = this.defaultCache
    const fnName = fn.name
    if (!this.store.has(fnName)) {
      this.store.set(fnName, new Map())
    }
    const fnCache = this.store.get(fnName)
    return function callFnWithCache(params: P, config?: CacheConfig) {
      const cacheKey = JSON.stringify(params)
      // 未显式设置pull的值，且 defaultCache 为 false 则清空缓存
      if (config?.pull ?? !defaultCache) {
        fnCache.delete(cacheKey)
      }
      if (!fnCache.has(cacheKey)) {
        const res = fn.apply(this, params)
        fnCache.set(cacheKey, res)
      }
      return fnCache.get(cacheKey) as R
    }
  }
}
