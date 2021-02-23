// Import city data for interpeting chromosome
// Measure the distamce from one city to the next in the order given by the chromosome. Distance of 0 is equivalent to fitness 1, and infinite distance is fitness 0. Fitness is logarithmic? 
// Distance is sqr-rt[(X2 - X1)^2 + (Y2 - Y1)^2]

import { cities } from './index.js';

let evaluate = function(input) {
	function distance(X1, Y1, X2, Y2) {
		return ((X2 - X1) ** 2 + (Y2 - Y1) ** 2) ** (1 / 2);
	}

	let distanceSum = 0;

	for(let i = 0; i < input.length - 1; i++) {
		const 
			start = input[i],
			finish = input[i + 1];

		const 
			X1 = cities[start][0],
			Y1 = cities[start][1],
			X2 = cities[finish][0],
			Y2 = cities[finish][1];

		distanceSum += distance(X1, Y1, X2, Y2);
	}

	return ( input.length / (distanceSum + input.length) );
}

export { evaluate };