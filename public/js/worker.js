let arrayHolder = [];
let cancelled = false;

onmessage = function(event) {
	const
		type = event.data.type,
		payload = event.data.payload;

	let result = {};
	switch (type) {
		case 'populate':
			populate(payload.count, payload.length);
			break;

		case 'procedure':
			result = executeProcedure();
			break;

		case 'cancel':
			cancelled = true;
			break;
	}
	postMessage({
		type: type,
		payload: result
	});
};

// TODO Make postMessage invocations for interval prints to inform interface about progress.
const PRINT_INTERVAL = 1000;
const populate = (count, length) => {
	arrayHolder = [];
	console.log('Running populate');
	for (let i = 0; i < count; i++) {

		if (cancelled)
			return cancel();

		if (i > 0 && i % PRINT_INTERVAL === 0)
			console.log('Created ' + i + ' arrays');

		const array = [];
		for (let j = 0; j < length; j++) {
			const value = Math.random() * 9000 + 1000;
			array.push(parseInt(value));
		}
		arrayHolder.push(array);
	}
	console.log('Populated arrays', arrayHolder);
};

const executeProcedure = () => {
	const start = performance.now();
	const array = procedure();
	const elapsed = performance.now() - start;
	return {
		async: true,
		array: array,
		time: elapsed,
	};
};

const procedure = () => {
	console.log('Running adding procedure');
	const sumArray = [];
	for (let i = 0; i < arrayHolder.length; i++) {

		if (i > 0 && i % PRINT_INTERVAL === 0)
			console.log('Accumulated ' + i + ' arrays');

		const array = arrayHolder[i];
		for (let j = 0; j < array.length; j++) {
			const value = array[j];
			if (sumArray[j])
				sumArray[j] += value;
			else
				sumArray[j] = value;
		}
	}
	console.log('Finished adding array values');
	return sumArray;
};

const cancel = () => {
	postMessage({
		type: 'cancel'
	});
	setTimeout(function() {
		cancelled = false;
	}, 1000);
};
