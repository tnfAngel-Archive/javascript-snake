let stop = false;
class Matrix {
	constructor(matrix) {
		this.matrix = matrix;
	}
	findElement(fn) {
		let result = false;
		for (const row of this.matrix) {
			for (const element of row) {
				if (fn(element)) {
					result = element;
					return result;
				}
			}
		}
		return result;
	}
	filterMatrix(fn) {
		let result = [];
		for (const row of this.matrix) {
			for (const element of row) {
				if (fn(element)) result.push(element);
			}
		}
		return result;
	}
}
class Snake {
	constructor(body, direction) {
		this.body = body;
		this.direction = direction;
		this.defaults = {
			body: body,
			direction: direction
		};
		this.boosted = false;
	}
	setDirection(direction) {
		this.direction = direction;
	}
	getPosition() {
		return { body: this.body, direction: this.direction };
	}
	setBoost(boost) {
		this.boosted = boost;
	}
	getBoost() {
		return this.boosted;
	}
	canMove(checkDirection) {
		const forbiddenDirections = {
			up: 'down',
			down: 'up',
			left: 'right',
			right: 'left'
		};

		const movements = {
			up: (direction) =>
				forbiddenDirections[direction] !== checkDirection,
			down: (direction) =>
				forbiddenDirections[direction] !== checkDirection,
			left: (direction) =>
				forbiddenDirections[direction] !== checkDirection,
			right: (direction) =>
				forbiddenDirections[direction] !== checkDirection
		};

		return movements[this.direction](this.direction);
	}
	move() {
		const movements = {
			up: () => {
				this.body[0].y = this.body[0].y - 1;
			},
			down: () => {
				this.body[0].y = this.body[0].y + 1;
			},
			left: () => {
				this.body[0].x = this.body[0].x - 1;
			},
			right: () => {
				this.body[0].x = this.body[0].x + 1;
			}
		};
		for (let index = this.body.length; index > 0; index--) {
			if (index !== this.body.length) {
				this.body[index].y = this.body[index - 1].y;
				this.body[index].x = this.body[index - 1].x;
			}
		}
		movements[this.direction]();

        for (let i = 0; i < this.body.length; i++) {
            for (let idx = 0; idx < this.body.length; idx++) {
                if (i !== idx && this.body[i].y === this.body[idx].y && this.body[i].x === this.body[idx].x) {
                    return this.die();
                }
            }
        }
	}
	die() {
        stop = true;
        alert('¡Game over!');
		window.location.reload();
	}
	addTrail() {
		this.body.push({
			x: this.body[this.body.length - 1].x,
			y: this.body[this.body.length - 1].y
		});
	}
}

class Terrain {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	getSizes() {
		return { x: this.x, y: this.y };
	}
}

class Food {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	getPosition() {
		return { x: this.x, y: this.y };
	}
	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Game {
	constructor(
		snakeConstructor,
		terrainConstructor,
		foodConstructor,
		matrixClassConstructor
	) {
		this.snake = snakeConstructor;
		this.terrain = terrainConstructor;
		this.food = foodConstructor;
		this.matrixClass = matrixClassConstructor;
	}
	getFramesDelay() {
		return this.snake.getBoost() ? 50 : 100;
	}
	generateFrame() {
		const frameTerrainSizes = terrain.getSizes();
		let frameTerrainY = -1;

		const frameMatrixClass = new Matrix(
			Array.from(new Array(frameTerrainSizes.y)).map(() => {
				frameTerrainY++;
				let terrainX = -1;
				return Array.from(new Array(frameTerrainSizes.x)).map(() => {
					terrainX++;
					return {
						type: 'TERRAIN',
						class: 'terrain',
						position: {
							x: terrainX,
							y: frameTerrainY
						}
					};
				});
			})
		);

		this.matrixClass = frameMatrixClass;
		this.preMove();

		const foodPosition = this.food.getPosition();

		if (!frameMatrixClass.findElement((e) => e.type === 'FOOD')) {
			frameMatrixClass.matrix[foodPosition.y][foodPosition.x] = {
				type: 'FOOD',
				class: 'apple',
				position: {
					x: foodPosition.x,
					y: foodPosition.y
				}
			};
		}

		this.snake.move();

		const snakePosition = this.snake.getPosition();

		let bodyIndex = 0;

		for (const bodyPosition of snakePosition.body) {
			if (
				frameMatrixClass.matrix[bodyPosition.y] &&
				frameMatrixClass.matrix[bodyPosition.y][bodyPosition.x]
			) {
				frameMatrixClass.matrix[bodyPosition.y][bodyPosition.x] = {
					type: 'PLAYER',
					class:
						bodyIndex === 0
							? 'head'
							: bodyIndex === snakePosition.body - 1
							? 'end'
							: 'body',
					position: {
						x: bodyPosition.x,
						y: bodyPosition.y
					}
				};
			} else {
				this.snake.die();
				break;
			}
			bodyIndex++;
		}
		return frameMatrixClass.matrix;
	}
	generateFood() {
		const mapTerrains = this.matrixClass.filterMatrix(
			(element) => element.type === 'TERRAIN'
		);

		if (mapTerrains.length === 0) {
            stop = true;
			alert('¡You win!');
			return window.location.reload();
		}

		const mapFoodSpawn =
			mapTerrains[~~(mapTerrains.length * Math.random())];

		this.food.setPosition(mapFoodSpawn.position.x, mapFoodSpawn.position.y);
	}
	preMove() {
		const foodPosition = this.food.getPosition();
		const snakePosition = this.snake.getPosition().body[0];
		let move = false;

		const movements = {
			up: () => {
				if (
					snakePosition.x === foodPosition.x &&
					snakePosition.y - 1 === foodPosition.y
				)
					move = true;
			},
			down: () => {
				if (
					snakePosition.x === foodPosition.x &&
					snakePosition.y + 1 === foodPosition.y
				)
					move = true;
			},
			left: () => {
				if (
					snakePosition.y === foodPosition.y &&
					snakePosition.x - 1 === foodPosition.x
				)
					move = true;
			},
			right: () => {
				if (
					snakePosition.y === foodPosition.y &&
					snakePosition.x + 1 === foodPosition.x
				)
					move = true;
			}
		};

		movements[this.snake.direction]();

		if (move) {
			this.matrixClass.matrix[foodPosition.y][foodPosition.x] = {
				type: 'TERRAIN',
				class: 'terrain',
				position: {
					x: foodPosition.x,
					y: foodPosition.y
				}
			};

			this.snake.addTrail();

			this.generateFood();
		}
	}
	printFrame(matrix) {
		document.getElementById('game').innerHTML = matrix
			.map((row) =>
				row
					.map(
						(block) =>
							`<div class="gameObject ${block.class}"></div>`
					)
					.join('')
			)
			.join('<br>');
	}
}

const terrain = new Terrain(32, 32);
const terrainSizes = terrain.getSizes();

let terrainY = -1;

const matrixClass = new Matrix(
	Array.from(new Array(terrainSizes.y)).map(() => {
		terrainY++;
		let terrainX = -1;
		return Array.from(new Array(terrainSizes.x)).map(() => {
			terrainX++;
			return {
				type: 'TERRAIN',
				class: 'terrain',
				position: {
					x: terrainX,
					y: terrainY
				}
			};
		});
	})
);

const headPosition = {
	x: ~~(terrainSizes.x / 2),
	y: ~~(terrainSizes.y / 2)
};

const snake = new Snake(
	[
		{
			x: headPosition.x,
			y: headPosition.y
		},
		{
			x: headPosition.x - 1,
			y: headPosition.y
		},
		{
			x: headPosition.x - 2,
			y: headPosition.y
		},
		{
			x: headPosition.x - 3,
			y: headPosition.y
		}
	],
	'right'
);

const terrains = matrixClass.filterMatrix(
	(element) => element.type === 'TERRAIN'
);

if (terrains.length === 0) {
    stop = true;
	alert('No space.');
	location.reload();
}

const foodSpawn = terrains[~~(terrains.length * Math.random())];
const food = new Food(foodSpawn.position.x, foodSpawn.position.y);
const game = new Game(snake, terrain, food, matrixClass);

let inputDirection = snake.getPosition().direction;

window.addEventListener(
	'keydown',
	(event) => {
		if (event.defaultPrevented) {
			return;
		}
		let direction;

		const keys = {
			ArrowDown: () => {
				direction = 'down';
			},
			ArrowUp: () => {
				direction = 'up';
			},
			ArrowLeft: () => {
				direction = 'left';
			},
			ArrowRight: () => {
				direction = 'right';
			}
		};

		if (keys[event.key]) {
			event.preventDefault();
			keys[event.key]();
			if (snake.canMove(direction)) {
				snake.setBoost(snake.getPosition().direction === direction);
				inputDirection = direction;
			}
		}
	},
	true
);

window.addEventListener(
	'keyup',
	(event) => {
		if (event.defaultPrevented) {
			return;
		}
		let direction;

		const keys = {
			ArrowDown: () => {
				direction = 'down';
			},
			ArrowUp: () => {
				direction = 'up';
			},
			ArrowLeft: () => {
				direction = 'left';
			},
			ArrowRight: () => {
				direction = 'right';
			}
		};

		if (keys[event.key]) {
			event.preventDefault();
			keys[event.key]();
            snake.setBoost(false);
		}
	},
	true
);

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

async function update() {
    if (stop) return;
    
	snake.setDirection(inputDirection);

	const matrix = game.generateFrame();

	game.printFrame(matrix);

	await wait(game.getFramesDelay());

	await update();
}

update();
