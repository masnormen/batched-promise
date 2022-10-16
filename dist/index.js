const makeBatch = (arr, batchSize) => {
    return arr.reduce((batches, el, i) => {
        if (i % batchSize === 0) {
            batches.push([el]);
        }
        else {
            batches[batches.length - 1].push(el);
        }
        return batches;
    }, []);
};
const all = async (values, batchSize = values.length, callback) => {
    const batches = makeBatch(values, batchSize);
    const allResult = [];
    for (let index = 0; index < batches.length; index++) {
        const currentBatchResult = await Promise.all(batches[index].map((fn) => fn()));
        allResult.push(...currentBatchResult);
        if (callback) {
            await callback(currentBatchResult, index, allResult);
        }
    }
    return allResult;
};
const allSettled = async (values, batchSize = values.length, callback) => {
    const batches = makeBatch(values, batchSize);
    const allResult = [];
    for (let index = 0; index < batches.length; index++) {
        const currentBatchResult = await Promise.allSettled(batches[index].map((fn) => fn()));
        allResult.push(...currentBatchResult);
        if (callback) {
            await callback(currentBatchResult, index, allResult);
        }
    }
    return allResult;
};
const BatchedPromise = {
    all,
    allSettled,
};
export default BatchedPromise;
