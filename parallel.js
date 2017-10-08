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

	runButton.addEventListener('click', () => {
		while (output.firstChild)
			output.removeChild(output.firstChild);

		const data = populate(countInput.value, lengthInput.value);
		console.time('elapsed time');
		const result = procedure(data);
		console.timeEnd('elapsed time');
		console.log(data, result);

		const n = Math.min(result.length, 100);
		for (let i = 0; i < n; i++) {
			const element = document.createElement('p');
			element.innerHTML = result[i];
			output.append(element);
		}
	});
});

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
