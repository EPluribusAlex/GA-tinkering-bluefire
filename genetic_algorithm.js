// There are 10 cities on a coordinate plane. Shorter distance means higher fitness.

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

GA.prototype.findOptimal = function() {
	let	population = this.populate(this.popSize);

	for(let i = 0; i < this.iterations; i++) {
		const newPop = [];

		const elite = this.selectBest(population);

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
	return fittest;
};

export { GA };