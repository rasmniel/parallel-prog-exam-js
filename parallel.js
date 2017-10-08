let
	output,
	countInput,
	lengthInput,
	runButton;

document.addEventListener('DOMContentLoaded', () => {
	countInput = document.querySelector('input.count');
	lengthInput = document.querySelector('input.length');
	output = document.querySelector('.output');
	runButton = document.querySelector('.run-button');
	syncTime = document.querySelector('.sync-time span');
	asyncTime = document.querySelector('.async-time span');

	// const data = populate(countInput.value, lengthInput.value);
	const data = populate(10000, 10000);

	runButton.addEventListener('click', () => {
		while (output.firstChild)
			output.removeChild(output.firstChild);


		setTimeout(() => {
			console.log('starting async')
			const asyncElapsed = runProcedure(data);
			asyncTime.innerHTML = asyncElapsed.toFixed(4);
			// const n = Math.min(result.length, 100);
			// for (let i = 0; i < n; i++) {
			// 	const element = document.createElement('p');
			// 	element.innerHTML = result[i];
			// 	output.append(element);
			// }
		}, 0);
		console.log('run async');

		console.log('starting sync')
		const syncElapsed = runProcedure(data);
		syncTime.innerHTML = syncElapsed.toFixed(4);
	});
});

const runProcedure = (data) => {
	const start = performance.now();
	const result = procedure(data);
	const elapsed = performance.now() - start;
	return elapsed;
};

const populate = (count, length) => {
	const arrayHolder = [];
	for (let i = 0; i < count; i++) {
		const array = [];
		for (let j = 0; j < length; j++) {
			const value = Math.random() * 9000 + 1000;
			array.push(parseInt(value));
		}
		arrayHolder.push(array);
	}
	return arrayHolder;
};

const procedure = (superArray) => {
	const sumArray = [];
	for (let i = 0; i < superArray.length; i++) {
		const subArray = superArray[i];
		for (let j = 0; j < subArray.length; j++) {
			const value = subArray[j];
			if (sumArray[j])
				sumArray[j] += value;
			else
				sumArray[j] = value;
		}
	}
	return sumArray;
};
