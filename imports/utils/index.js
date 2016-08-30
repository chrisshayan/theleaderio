export const IDValidator = {
	_id: {
		type: String,
		regEx: SimpleSchema.RegEx.Id
	}
};

export const getErrors = err => {
	let error = {};
	try {
		if (err.details) {
			if (_.isObject(err.details)) {
				details = err.details;
			} else {
				details = JSON.parse(err.details);
			}
			_.each(details, e => error[e.name] = e.reason);
		} else {
			error.GENERAL = err.reason;
		}
	} catch (e) {
		error.GENERAL = e.toString();
	}
	return error;
}


export const getRandomColor = () => {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

export const arraySum = (array) => {
	if(_.isEmpty(array)) {
		return 0;
	}
	return array.reduce(function(a, b){return a+b;});
}

export const addMonths = (date, months) => {
	date.setMonth(date.getMonth() + months);
	return date;
}


