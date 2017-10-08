const procedure = (count, length) => {
	const arrayHolder = [];
	for (let i = 0; i < count; i++) {
		const array = [];
		for (let j = 0; j < length; j++) {
			const value = Math.random() * 9000 + 1000;
			array.push(parseInt(value));
		}
		arrayHolder.push(array);
	}

};

procedure(5, 10);
