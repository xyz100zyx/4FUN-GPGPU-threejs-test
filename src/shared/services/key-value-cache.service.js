const keyValueCache = {};

class KeyValueCache {
  _cache = new Map();

  compute(computeFn, cacheKey) {
    if (this.#checkIsInCache(cacheKey)) {
      return this._cache.get(cacheKey);
    }

    const computed = computeFn();
    this.#setCacheByKey(cacheKey, computed);

    return computed;
  }

  async computeAsync(computeFn, cacheKey) {
    if (this.#checkIsInCache(cacheKey)) {
      return this._cache.get(cacheKey);
    }

    const computed = await computeFn();
    this.#setCacheByKey(cacheKey, computed);

    return computed;
  }

  #checkIsInCache(cacheKey) {
    return this._cache.has(cacheKey);
  }

  #setCacheByKey(cacheKey, value) {
    this._cache.set(cacheKey, value);
  }
}

export const KVCacheInstance = new KeyValueCache();
