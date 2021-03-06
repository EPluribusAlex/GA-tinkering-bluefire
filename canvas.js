window.onload = function() {
	const canvas1 = document.getElementById("GA-expression");
	const ctx1 = canvas1.getContext("2d");

	const canvas2 = document.getElementById("base");
	const ctx2 = canvas2.getContext("2d");

	const GA = function(evaluate, testSet) {
		this.evaluate = evaluate;
		this.chromeLength = testSet.chromeLength;
		this.popSize = testSet.popSize;
		this.probC = testSet.probC;
		this.probM = testSet.probM;
		this.iterations = testSet.iterations;
	};

	GA.prototype.generate = function(chromeLength) {
		const arr = [];

		for(let i = 0; i < chromeLength; i++) {
			arr.push(i);
		}

		let 
			currIndex = arr.length, 
			tempVal, 
			ranIndex;

		while(currIndex !== 0) {
			ranIndex = Math.floor(Math.random() * currIndex);
			currIndex -= 1;
			tempVal = arr[currIndex];
			arr[currIndex] = arr[ranIndex];
			arr[ranIndex] = tempVal;
		}

		return arr;
	};

	GA.prototype.populate = function(popSize) {
		const arr = [];

		for(let i = 0; i < popSize; i++) {
		 const genome = this.generate(this.chromeLength);
		 const fitness = this.evaluate(genome);
		 const object = {
		 	genome: genome,
		 	fitness: fitness
		 };

		 arr.push(object);
		}

		return arr;
	};

	GA.prototype.select = function(population) {
		const arr = [];
		let max = 0;

		population.forEach(e => { 
			arr.push(e.fitness + max);
			max += e.fitness; 
		});

		const selector = (Math.random() * max);

		for(let i = 0; i < population.length; i++) {
			if(selector <= arr[i]) {
				return population[i].genome;
			}
		}
	};

	GA.prototype.crossover = function(parent1, parent2) {
		const 
			child1 = [],
			child2 = [];
		const cut1 = Math.floor(Math.random() * (this.chromeLength - 2));
		const cut2 = cut1 + 1 + Math.floor(Math.random() * (this.chromeLength - 2 - cut1));

		for(let i = 0; i < this.chromeLength; i++) {
			if(i <= cut1 || i > cut2) {
				child1.push("X");
				child2.push("X");
			} else {
				child1.push(parent2[i]);
				child2.push(parent1[i]);
			}
		}

		for(let i = 0; i < this.chromeLength; i++) {
			if(child1[i] === "X" && child1.indexOf(parent1[i]) === -1) {
				child1[i] = parent1[i];
			}

			if(child2[i] === "X" && child2.indexOf(parent2[i]) === -1) {
				child2[i] = parent2[i];
			}
		}

		for(let i = 0; i < this.chromeLength; i++) {
			if(child1[i] === "X") {
				for(let j = 0; j < this.chromeLength; j++) {
					if(child1.indexOf(j) === -1) {
						child1[i] = j;
						break;
					}
				}
			}

			if(child2[i] === "X") {
				for(let j = 0; j < this.chromeLength; j++) {
					if(child2.indexOf(j) === -1) {
						child2[i] = j;
						break;
					}
				}
			}
		}

		return [child1, child2];
	};

	GA.prototype.mutate = function(chromosome) {
		const randomSpouse = this.generate(this.chromeLength);

		const result = this.crossover(chromosome, randomSpouse);

		return result[0];
	};

	GA.prototype.selectBest = function(population) {
		let 
			highFit = 0,
			index;

		for(let i = 0; i < this.popSize; i++) {
			if(population[i].fitness > highFit) {
				highFit = population[i].fitness;
				index = i;
			}
		}

		return population[index];
	}

	GA.prototype.run = function() {
		let	population = this.populate(this.popSize);

		const evolution = [];

		for(let i = 0; i < this.iterations; i++) {
			const newPop = [];

			const elite = this.selectBest(population);

			evolution.push(elite);

			newPop.push(elite);

			while(newPop.length < this.popSize) {
				const
				 child1 = {}, 
				 child2 = {};

				const 
					parent1 = this.select(population),
					parent2 = this.select(population);

				const
					cross = Math.random() < this.probC ? true : false,
					mutate1 = Math.random() < this.probM ? true : false,
					mutate2 = Math.random() < this.probM ? true : false;

				if(cross) {
					const result = this.crossover(parent1, parent2);
					child1.genome = result[0];
					child2.genome = result[1];
				} else {
					child1.genome = parent1;
					child2.genome = parent2;
				}

				if(mutate1) {
					const result = this.mutate(child1.genome);
					child1.genome = result;
				}

				if(mutate2) {
					const result = this.mutate(child2.genome);
					child2.genome = result;
				}

				child1.fitness = this.evaluate(child1.genome);
				child2.fitness = this.evaluate(child2.genome);

				newPop.push(child1);
				if(newPop.length < this.popSize) {
					newPop.push(child2);
				}
			}

			population = newPop;
		}

		const fittest = this.selectBest(population);

		return [fittest, evolution];
	};

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

	const cities =  [ [12.3, 8.7], [5.9, -16.1], [-9.4, 17.3], [4.7, 0.7], [-3.2, -11.6], [3.8, 10.6], [-4.2, -7.1], [-4.6, 9.2], [3.5, -6.6], [15.0, 7.9], [-4.4, 2], [16.1, 13], [-19.1, 17.6], [-9.2, 5.8], [11.7, 0.4], [12.5, 10], [8.9, 4.9], [4.6, -6.2], [1, -3], [0, 0] ];

	const testSet = {
		chromeLength: cities.length,
		popSize: 500,
		probC: 0.7,
		probM: 0.02,
		iterations: 1000
	};

	const test = new GA(evaluate, testSet);

	const coordinates = function(order) {
		return {
			0: [ (cities[order[0]][0] + 20) * 15, (cities[order[0]][1] + 20) * 15 ],
			1: [ (cities[order[1]][0] + 20) * 15, (cities[order[1]][1] + 20) * 15 ],
			2: [ (cities[order[2]][0] + 20) * 15, (cities[order[2]][1] + 20) * 15 ],
			3: [ (cities[order[3]][0] + 20) * 15, (cities[order[3]][1] + 20) * 15 ],
			4: [ (cities[order[4]][0] + 20) * 15, (cities[order[4]][1] + 20) * 15 ],
			5: [ (cities[order[5]][0] + 20) * 15, (cities[order[5]][1] + 20) * 15 ],
			6: [ (cities[order[6]][0] + 20) * 15, (cities[order[6]][1] + 20) * 15 ],
			7: [ (cities[order[7]][0] + 20) * 15, (cities[order[7]][1] + 20) * 15 ],
			8: [ (cities[order[8]][0] + 20) * 15, (cities[order[8]][1] + 20) * 15 ],
			9: [ (cities[order[9]][0] + 20) * 15, (cities[order[9]][1] + 20) * 15 ],
			10: [ (cities[order[10]][0] + 20) * 15, (cities[order[10]][1] + 20) * 15 ],
			11: [ (cities[order[11]][0] + 20) * 15, (cities[order[11]][1] + 20) * 15 ],
			12: [ (cities[order[12]][0] + 20) * 15, (cities[order[12]][1] + 20) * 15 ],
			13: [ (cities[order[13]][0] + 20) * 15, (cities[order[13]][1] + 20) * 15 ],
			14: [ (cities[order[14]][0] + 20) * 15, (cities[order[14]][1] + 20) * 15 ],
			15: [ (cities[order[15]][0] + 20) * 15, (cities[order[15]][1] + 20) * 15 ],
			16: [ (cities[order[16]][0] + 20) * 15, (cities[order[16]][1] + 20) * 15 ],
			17: [ (cities[order[17]][0] + 20) * 15, (cities[order[17]][1] + 20) * 15 ],
			18: [ (cities[order[18]][0] + 20) * 15, (cities[order[18]][1] + 20) * 15 ],
			19: [ (cities[order[19]][0] + 20) * 15, (cities[order[19]][1] + 20) * 15 ]
		}
	};

	cities.forEach(e => {
		ctx2.beginPath();
		const 
			x = (e[0] + 20) * 15 - 5,
			y = (e[1] + 20) * 15 - 5;
		ctx2.fillRect(x, y, 10, 10);
	});

	const result = test.run();
	console.log(result[0], "GA result");

	ctx1.strokeStyle = "red";

	const drawPattern = function(sequence) {
		ctx1.beginPath();
		ctx1.moveTo(sequence[0][0], sequence[0][1]);
		ctx1.lineTo(sequence[1][0], sequence[1][1]);
		ctx1.lineTo(sequence[2][0], sequence[2][1]);
		ctx1.lineTo(sequence[3][0], sequence[3][1]);
		ctx1.lineTo(sequence[4][0], sequence[4][1]);
		ctx1.lineTo(sequence[5][0], sequence[5][1]);
		ctx1.lineTo(sequence[6][0], sequence[6][1]);
		ctx1.lineTo(sequence[7][0], sequence[7][1]);
		ctx1.lineTo(sequence[8][0], sequence[8][1]);
		ctx1.lineTo(sequence[9][0], sequence[9][1]);
		ctx1.lineTo(sequence[10][0], sequence[10][1]);
		ctx1.lineTo(sequence[11][0], sequence[11][1]);
		ctx1.lineTo(sequence[12][0], sequence[12][1]);
		ctx1.lineTo(sequence[13][0], sequence[13][1]);
		ctx1.lineTo(sequence[14][0], sequence[14][1]);
		ctx1.lineTo(sequence[15][0], sequence[15][1]);
		ctx1.lineTo(sequence[16][0], sequence[16][1]);
		ctx1.lineTo(sequence[17][0], sequence[17][1]);
		ctx1.lineTo(sequence[18][0], sequence[18][1]);
		ctx1.lineTo(sequence[19][0], sequence[19][1]);
		ctx1.stroke();
	};

	const sequence = [];

	function arrayEquals(a, b) {
	  return Array.isArray(a) &&
	    Array.isArray(b) &&
	    a.length === b.length &&
	    a.every((val, index) => val === b[index]);
	}

	for(let i = 0; i < result[1].length; i++) {
		if(i === 0) {
			sequence.push(result[1][0].genome);
		} else if(arrayEquals(result[1][i].genome, result[1][i - 1].genome) === false) {
			sequence.push(result[1][i].genome);
		}
	}

	if(arrayEquals(result[0].genome, sequence[sequence.length - 1]) === false) {
		sequence.push(result[0].genome);
	}

	console.log(sequence, "sequence");

	for(let i = 0; i < sequence.length; i++) {
		setTimeout(function() { 
			console.log("Iteration " + i);
			ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
			drawPattern(coordinates(sequence[i])); 
		}, 500 * i);
	}
};