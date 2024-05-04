/**
 * This class represents a client-side cache for a single item of type T.
 * The cache has an expiration time, after which the data is considered stale.
 * ? See more: https://remix.run/docs/en/main/guides/client-data
 */
export class ClientCache<T> {
  private data: T | null = null;
  private expireAt: number = 0;
  private expireTimeSpan: number = 1000 * 60 * 5; // default to 5 minutes

  /**
   * Constructs a new ClientCache object.
   * @param {Object} params - The parameters for the cache.
   * @param {T} params.initialData - The initial data to be stored in the cache.
   * @param {number} params.expireAt - The timestamp (in milliseconds since the Unix Epoch) at which the data should expire.
   * @param {number} [params.expireTimeSpan] - The time span (in milliseconds) after which the data should expire. Defaults to 5 minutes.
   */
  constructor({
    initialData,
    expireAt,
    expireTimeSpan,
  }: {
    initialData: T;
    expireAt: number;
    expireTimeSpan?: number;
  }) {
    this.data = initialData;
    this.expireAt = expireAt;
    this.expireTimeSpan = expireTimeSpan || this.expireTimeSpan;
  }

  /**
   * Updates the data in the cache and extends the expiration time.
   * @param {T} data - The new data to be stored in the cache.
   * @param {number} [expireAt] - The new expiration time. If not provided, the expiration time span will be used.
   */
  public update(data: T, expireAt?: number) {
    this.data = data;
    this.expandCacheByTimeSpan(expireAt);
  }

  /**
   * Retrieves the data from the cache.
   * @returns {T | null} The data in the cache, or null if the cache is empty.
   */
  public getData() {
    return this.data;
  }

  /**
   * Checks if the data in the cache has expired.
   * @returns {boolean} True if the data has expired, false otherwise.
   */
  public isExpired() {
    return this.expireAt < Date.now();
  }

  /**
   * Sets a new expiration time span.
   * @param {number} time - The new expiration time span (in milliseconds).
   */
  public setExpireTimeSpan(time: number) {
    this.expireTimeSpan = time;
  }

  /**
   * Extends the expiration time by the given time span or the default time span if no time is provided.
   * @param {number} [time] - The time span (in milliseconds) by which to extend the expiration time.
   */
  public expandCacheByTimeSpan(time?: number) {
    this.expireAt = time ? Date.now() + time : Date.now() + this.expireTimeSpan;
  }

  /**
   * Invalidates the data in the cache by setting its expiration time to 0.
   */
  public invalidate() {
    this.expireAt = 0;
  }

  /**
   * Deletes the data in the cache and sets its expiration time to 0.
   */
  public delete() {
    this.data = null;
    this.expireAt = 0;
  }
}

/**
 * This class extends ClientCache to handle specific case of an array of objects with an 'id' property.
 * It provides methods to update a single record and delete a record by its 'id'.
 * ? See more: https://remix.run/docs/en/main/guides/client-data
 */
export class ClientCacheArrayOfObjectWithId<
  T extends Record<string, unknown> & { id: number | string },
> extends ClientCache<Array<T>> {
  /**
   * Updates a single record in the cache. If the record does not exist, it is added.
   * If the cache is empty, it is initialized with the provided record.
   * @param {T} data - The record to be updated or added.
   */
  public updateOneRecord(data: T) {
    const cache = this.getData();
    if (!cache) {
      this.update([data]);
      return;
    }

    const index = cache.findIndex((record) => record.id === data.id);
    if (index === -1) {
      this.update([...cache, data]);
      return;
    }

    cache[index] = data;
    this.update(cache);
  }

  /**
   * Deletes a record from the cache by its 'id'.
   * If the cache is empty, no action is taken.
   * @param {number | string} id - The 'id' of the record to be deleted.
   */
  public deleteRecordById(id: number | string) {
    const cache = this.getData();
    if (!cache) {
      return;
    }

    this.update(cache.filter((record) => "id" in record && record.id !== id));
  }
}
