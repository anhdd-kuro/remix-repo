import { wait } from "..";
import {
  ClientCache,
  ClientCacheArrayOfObjectWithId,
} from "./_clientMemoryCache";

describe("Test normal cache", () => {
  let cache: ClientCache<string>;

  const EXPIRE_TIME_SECONDS = 1;
  const EXPIRE_TIME_SPAN = 1000 * EXPIRE_TIME_SECONDS;
  beforeEach(() => {
    cache = new ClientCache({
      expireAt: 0,
      initialData: "initialData",
      expireTimeSpan: EXPIRE_TIME_SPAN,
    });
  });

  test("cache should get initial data", () => {
    expect(cache.getData()).toBe("initialData");
  });

  test("cache should set new data", () => {
    cache.update("newData");
    expect(cache.getData()).toBe("newData");
  });

  test(`cache should expire after ${EXPIRE_TIME_SECONDS} seconds`, async () => {
    cache.update("newData");
    await wait(EXPIRE_TIME_SPAN + 100);
    expect(cache.isExpired()).toBe(true);
  });

  test(`cache should not expire after ${EXPIRE_TIME_SECONDS - 1} seconds`, async () => {
    cache.update("newData");
    await wait(EXPIRE_TIME_SPAN - 100);
    expect(cache.isExpired()).toBe(false);
  });

  test("cache should be invalidated", () => {
    cache.update("newData");
    cache.invalidate();
    expect(cache.getData()).toBe("newData");
    expect(cache.isExpired()).toBe(true);
  });

  test("cache should be deleted", () => {
    cache.update("newData");
    cache.delete();
    expect(cache.getData()).toBe(null);
    expect(cache.isExpired()).toBe(true);
  });

  test("cache should be updated with new expiration time", async () => {
    cache.update("newData");
    await wait(EXPIRE_TIME_SPAN + 100);
    expect(cache.isExpired()).toBe(true);

    cache.expandCacheByTimeSpan();
    expect(cache.getData()).toBe("newData");
    expect(cache.isExpired()).toBe(false);

    await wait(EXPIRE_TIME_SPAN + 100);
    expect(cache.isExpired()).toBe(true);
  });

  test("Set new expiration time span", async () => {
    cache.setExpireTimeSpan(1200);
    cache.update("newData");
    await wait(1100);
    expect(cache.isExpired()).toBe(false);
    await wait(200);
    expect(cache.isExpired()).toBe(true);
  });
});

describe("Test array of object cache", () => {
  let cache: ClientCacheArrayOfObjectWithId<{ id: string; name: string }>;

  const EXPIRE_TIME_SECONDS = 1;
  const EXPIRE_TIME_SPAN = 1000 * EXPIRE_TIME_SECONDS;
  const testData = [{ id: "1", name: "testData" }];

  beforeEach(() => {
    cache = new ClientCacheArrayOfObjectWithId({
      expireAt: 0,
      initialData: [],
      expireTimeSpan: EXPIRE_TIME_SPAN,
    });
  });

  test("cache should get initial data", () => {
    expect(cache.getData()).toEqual([]);
  });

  test("cache should update record by id", () => {
    const newData = { id: "1", name: "newData" };
    cache.update([...testData]);
    cache.updateOneRecord(newData);
    expect(cache.getData()).toEqual([newData]);
  });

  test("cache should delete record by id", () => {
    const newData = [...testData, { id: "2", name: "newData" }];
    cache.update(newData);
    expect(cache.getData()).toEqual([...newData]);
    cache.deleteRecordById("2");
    expect(cache.getData()).toEqual(testData);
  });
});
