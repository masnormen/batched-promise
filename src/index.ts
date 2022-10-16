export type BatchedPromiseCallbackFn<T extends (...args: any[]) => Promise<Awaited<ReturnType<T>>>> = (
  currentBatch: PromiseSettledResult<Awaited<ReturnType<T>>>[],
  index: number,
  currentResult: PromiseSettledResult<Awaited<ReturnType<T>>>[]
) => void | Promise<void>;

interface BatchedPromise {
  all: <T extends (...args: any[]) => Promise<Awaited<ReturnType<T>>>>(
    values: T[],
    batchSize?: number,
    callback?: BatchedPromiseCallbackFn<T>
  ) => Promise<Awaited<ReturnType<T>>[]>;
  allSettled: <T extends (...args: any[]) => Promise<Awaited<ReturnType<T>>>>(
    values: T[],
    batchSize?: number,
    callback?: BatchedPromiseCallbackFn<T>
  ) => Promise<PromiseSettledResult<Awaited<ReturnType<T>>>[]>;
}

/**
 * Creates an array in batches with size of batchSize
 * @param arr An array.
 * @param batchSize The maximum size of each batched array.
 * @returns An array containing batched arrays.
 */
const makeBatch = <T>(arr: T[], batchSize: number): T[][] => {
  return arr.reduce((batches: T[][], el, i) => {
    if (i % batchSize === 0) {
      batches.push([el]);
    } else {
      batches[batches.length - 1].push(el);
    }
    return batches;
  }, []);
};

/**
 * Creates a batched Promise that is resolved with an array of results when all of the provided Async Functions
 * returns a resolved Promise, or rejected when any of the function returns a rejected Promise.
 * @param values An array of Asynchronous Functions.
 * @returns A new Promise.
 */
const all: BatchedPromise["all"] = async <T extends () => Promise<Awaited<ReturnType<T>>>>(
  values: T[],
  batchSize = values.length,
  callback?: (
    currentBatch: Awaited<ReturnType<T>>[],
    index: number,
    currentResult: Awaited<ReturnType<T>>[]
  ) => void | Promise<void>
): Promise<Awaited<ReturnType<T>>[]> => {
  const batches = makeBatch(values, batchSize);
  const allResult: Awaited<ReturnType<T>>[] = [];
  for (let index = 0; index < batches.length; index++) {
    const currentBatchResult = await Promise.all(batches[index].map((fn) => fn()));
    allResult.push(...currentBatchResult);
    if (callback) {
      await callback(currentBatchResult, index, allResult);
    }
  }
  return allResult;
};

/**
 * Creates a batched Promise that is resolved with an array of results when all of the provided Async Functions
 * returns a resolved or rejected Promise
 * @param values An array of Asyncchronous Functions.
 * @returns A new Promise.
 */
const allSettled: BatchedPromise["allSettled"] = async <T extends () => Promise<Awaited<ReturnType<T>>>>(
  values: T[],
  batchSize = values.length,
  callback?: (
    batch: PromiseSettledResult<Awaited<ReturnType<T>>>[],
    index: number,
    currentResult: PromiseSettledResult<Awaited<ReturnType<T>>>[]
  ) => void | Promise<void>
): Promise<PromiseSettledResult<Awaited<ReturnType<T>>>[]> => {
  const batches = makeBatch(values, batchSize);
  const allResult: PromiseSettledResult<Awaited<ReturnType<T>>>[] = [];
  for (let index = 0; index < batches.length; index++) {
    const currentBatchResult = await Promise.allSettled(batches[index].map((fn) => fn()));
    allResult.push(...currentBatchResult);
    if (callback) {
      await callback(currentBatchResult, index, allResult);
    }
  }
  return allResult;
};

const BatchedPromise: BatchedPromise = {
  all,
  allSettled,
};

export default BatchedPromise;
