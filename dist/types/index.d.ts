export declare type BatchedPromiseCallbackFn<T extends (...args: any[]) => Promise<Awaited<ReturnType<T>>>> = (currentBatch: PromiseSettledResult<Awaited<ReturnType<T>>>[], index: number, currentResult: PromiseSettledResult<Awaited<ReturnType<T>>>[]) => void | Promise<void>;
interface BatchedPromise {
    all: <T extends (...args: any[]) => Promise<Awaited<ReturnType<T>>>>(values: T[], batchSize?: number, callback?: BatchedPromiseCallbackFn<T>) => Promise<Awaited<ReturnType<T>>[]>;
    allSettled: <T extends (...args: any[]) => Promise<Awaited<ReturnType<T>>>>(values: T[], batchSize?: number, callback?: BatchedPromiseCallbackFn<T>) => Promise<PromiseSettledResult<Awaited<ReturnType<T>>>[]>;
}
declare const BatchedPromise: BatchedPromise;
export default BatchedPromise;
