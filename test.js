import { cities, evaluate, GA } from './index.js';

const testSet = {
	chromeLength: cities.length,
	popSize: 500,
	probC: 0.8,
	probM: 0.01,
	iterations: 100
};

const test = new GA(evaluate, testSet);

const 
	solution1 = [1, 4, 6, 8, 3, 9, 7, 0, 5, 2],
	solution2 = [2, 5, 0, 7, 9, 3, 8, 6, 4, 1];

(function GAAccuracy() {
	function arrayEquals(a, b) {
	  return Array.isArray(a) &&
	    Array.isArray(b) &&
	    a.length === b.length &&
	    a.every((val, index) => val === b[index]);
	}

	let expected = 0;

	for(let i = 0; i < 1000; i++) {
		const result = test.findOptimal();
		console.log("TEST: " + i + ", RESULT: " + result.genome, result.fitness);
		if(arrayEquals(result.genome, solution1) || arrayEquals(result.genome, solution2)) {
			expected++;
		}
	}

	console.log("Accuracy: " + (expected / 1000) * 100 + "%");
})();
