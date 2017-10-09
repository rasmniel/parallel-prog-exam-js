/*
 On DOMContentLoaded event, initialize everything.
 */

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    initWorker();
});


/*
 HTML interface initialization.
 */

let
    countInput,
    lengthInput,
    populateButton,
    procedureButton,
    progressBar,
    killButton,
    asyncCheck,
    syncPopulateTime,
    syncProcedureTime,
    asyncPopulateTime,
    asyncProcedureTime,
    output;

const initUI = () => {
    countInput = document.querySelector('input.count');
    lengthInput = document.querySelector('input.length');

    asyncCheck = document.querySelector('.async-check');
    asyncCheck.checked = true;

    populateButton = document.querySelector('.populate-button');
    procedureButton = document.querySelector('.procedure-button');

    progressBar = document.querySelector('.progress');
    killButton = document.querySelector('.kill-button');

    syncPopulateTime = document.querySelector('.sync-time .populate span');
    syncProcedureTime = document.querySelector('.sync-time .procedure span');
    asyncPopulateTime = document.querySelector('.async-time .populate span');
    asyncProcedureTime = document.querySelector('.async-time .procedure span');

    output = document.querySelector('.output');
};


/*
 DOM manipulation and UI animation.
 */

const setProgress = (progress, total) => {
    const currentProgress = (progress / total) * 100;
    progressBar.style.cssText = "width: " + currentProgress + "%;";
};

const MAX_RESULTS = 1000;
const displayResults = (array) => {
    while (output.firstChild)
        output.removeChild(output.firstChild);

    const n = Math.min(array.length, MAX_RESULTS);
    for (let i = 0; i < n; i++) {
        const element = document.createElement('p');
        element.innerHTML = array[i];
        output.append(element);
    }
};

const displayTime = (time, async, populate) => {
    const elapsed = time.toFixed(4);
    if (async) {
        if (populate)
            asyncPopulateTime.innerHTML = elapsed;
        else
            asyncProcedureTime.innerHTML = elapsed;
    }
    else {
        if (populate)
            syncPopulateTime.innerHTML = elapsed;
        else
            syncProcedureTime.innerHTML = elapsed;
    }
};


/*
 Javascript web worker functionality.
 */

let worker = null;

const initWorker = () => {
    worker = new Worker('js/worker.js');

    worker.onmessage = (event) => {
        const
            type = event.data.type,
            payload = event.data.payload;

        switch (type) {
            case 'populate':
                displayTime(payload.time, true, true);
                break;

            case 'procedure':
                displayResults(payload.array);
                displayTime(payload.time, true, false);
                break;

            case 'progress':
                setProgress(payload.progress, payload.total);
                break;
        }
    };

    populateButton.addEventListener('click', populateAction);
    procedureButton.addEventListener('click', procedureAction);
    killButton.addEventListener('click', killAction);
};

const populateAction = () => {
    setProgress(0, 1);
    const
        count = countInput.value,
        length = lengthInput.value;

    if (asyncCheck.checked) {
        worker.postMessage({
            type: 'populate',
            payload: {
                count: count,
                length: length
            }
        });
    }
    else {
        const result = executePopulate(count, length);
        displayTime(result.time, false, true);
    }
};

const procedureAction = () => {
    setProgress(0, 1);
    if (asyncCheck.checked) {
        worker.postMessage({
            type: 'procedure'
        });
    }
    else {
        const result = executeProcedure();
        displayResults(result.array);
        displayTime(result.time, false, false);
    }
};

const killAction = () => {
    populateButton.removeEventListener('click', populateAction);
    procedureButton.removeEventListener('click', procedureAction);
    killButton.removeEventListener('click', killAction);
    worker.terminate();
    console.log('Worker terminated');
    worker = null;
    initWorker();
};
