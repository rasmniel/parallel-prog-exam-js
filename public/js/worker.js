let arrayHolder = [];

// scope.document can be used to determine whether this is actually a worker thread.
const scope = this;

onmessage = function (event) {
    const
        type = event.data.type,
        payload = event.data.payload;

    let result = {};
    switch (type) {
        case 'populate':
            result = executePopulate(payload.count, payload.length);
            break;

        case 'procedure':
            result = executeProcedure();
            break;
    }
    postMessage({
        type: type,
        payload: result
    });
};

const populate = (count, length) => {
    arrayHolder = [];
    console.log('Running populate');
    for (let i = 0; i < count; i++) {
        postProgress(i, count);

        const array = [];
        for (let j = 0; j < length; j++) {
            const value = Math.random() * 9000 + 1000;
            array.push(parseInt(value));
        }
        arrayHolder.push(array);
    }
    console.log('Populated arrays', arrayHolder);
};

const procedure = () => {
    console.log('Running adding procedure');
    const n = arrayHolder.length;
    const sumArray = [];
    for (let i = 0; i < n; i++) {
        postProgress(i, n);

        const array = arrayHolder[i];
        for (let j = 0; j < array.length; j++) {
            const value = array[j];
            if (sumArray[j])
                sumArray[j] += value;
            else
                sumArray[j] = value;
        }
    }
    console.log('Finished adding array values', sumArray);
    return sumArray;
};

const PROGRESS_INTERVAL = 1000;
const postProgress = (progress, total) => {
    if (scope.document) return;
    if (progress === total - 1 || progress % PROGRESS_INTERVAL === 0) {
        console.log('Progress: ', progress + ' / ' + total);
        postMessage({
            type: 'progress',
            payload: {
                progress: progress,
                total: total
            }
        });
    }
};

const executePopulate = (count, length) => {
    const start = performance.now();
    populate(count, length);
    const elapsed = performance.now() - start;
    return {
        time: elapsed,
    };
};

const executeProcedure = () => {
    const start = performance.now();
    const array = procedure();
    const elapsed = performance.now() - start;
    return {
        array: array,
        time: elapsed,
    };
};