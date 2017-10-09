let
	output,
	countInput,
	lengthInput,
	populateButton,
	procedureButton,
	syncTime,
	asyncTime,
	asyncCheck,
	killButton;

let worker;

document.addEventListener('DOMContentLoaded', () => {
	countInput = document.querySelector('input.count');
	lengthInput = document.querySelector('input.length');
	output = document.querySelector('.output');
	populateButton = document.querySelector('.populate-button');
	procedureButton = document.querySelector('.procedure-button');
	killButton = document.querySelector('.kill-button');
	syncTime = document.querySelector('.sync-time span');
	asyncTime = document.querySelector('.async-time span');
	asyncCheck = document.querySelector('.async-check');

	terminateAndCreateWorker();

	worker.onmessage = function(event) {
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
		} else {
			populate(count, length);
		}
	});

	procedureButton.addEventListener('click', () => {
		if (asyncCheck.checked) {
			worker.postMessage({
				type: 'procedure'
			});
		} else {
			const results = executeProcedure();
			displayResults(results);
		}
	});

	killButton.addEventListener('click', () => {
		terminateAndCreateWorker();
	});
});

const terminateAndCreateWorker = () => {
	if (worker) {
		worker.terminate();
		console.log('worker terminated');
	}
	worker = new Worker('js/worker.js');
};

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
