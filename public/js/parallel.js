let
    output,
    countInput,
    lengthInput,
    populateButton,
    procedureButton,
    syncTime,
    asyncTime;

document.addEventListener('DOMContentLoaded', () => {
    countInput = document.querySelector('input.count');
    lengthInput = document.querySelector('input.length');
    output = document.querySelector('.output');
    populateButton = document.querySelector('.populate-button');
    procedureButton = document.querySelector('.procedure-button');
    syncTime = document.querySelector('.sync-time span');
    asyncTime = document.querySelector('.async-time span');

    const worker = new Worker('js/worker.js');

    worker.onmessage = function (event) {
        console.log('Received result from worker', event.data);
        const
            type = event.data.type,
            payload = event.data.payload;

        switch (type) {
            case 'populate':
                // TODO something
                break;

            case 'procedure':
                displayResults(payload);
                break;
        }
    };

    populateButton.addEventListener('click', () => {
        worker.postMessage({
            type: 'populate',
            payload: {
                count: countInput.value,
                length: lengthInput.value
            }
        });
    });

    procedureButton.addEventListener('click', () => {
        worker.postMessage({
            type: 'procedure'
        });
    });
});

const MAX_RESULTS = 1000;
const displayResults = (result) => {
    while (output.firstChild)
        output.removeChild(output.firstChild);

    const array = result.array;
    const n = Math.min(array.length, MAX_RESULTS);
    for (let i = 0; i < n; i++) {
        const element = document.createElement('p');
        element.innerHTML = array[i];
        output.append(element);
    }

    const elapsed = result.time.toFixed(4);
    if (result.async)
        asyncTime.innerHTML = elapsed;
    else
        syncTime.innerHTML = elapsed;
};
