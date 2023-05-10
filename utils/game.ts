export default class Game {
	public board: number[][];
	public currentPlayer: number;
	public rows: number;
	public columns: number;
	public gameOver: boolean = false;
	public historic: string[] = [];
	protected IA = false;

	constructor(rows: number = 6, columns: number = 7) {
		this.rows = rows;
		this.columns = columns;
		this.board = [];
		this.currentPlayer = 1;
	}

	public getBoard(): number[] {
		return this.board.flat();
	}

	public getCurrentPlayer(): number {
		return this.currentPlayer;
	}

	public getPosFromNumber(num: number): { row: number; column: number } {
		const row = Math.floor(num / this.columns);
		const column = num % this.columns;
		return { row, column };
	}

	public initBoard(): void {
		for (let i = 0; i < this.rows; i++) {
			this.board[i] = [];
			for (let j = 0; j < this.columns; j++) {
				this.board[i][j] = 0;
			}
		}
	}

	/**
	 * make a play in the given column
	 * @param column number
	 * @returns <boolean> true if the play is valid, false otherwise
	 */
	public play(column: number, historic: boolean = true): boolean {
		// Check if column is valid
		if (column < 0 || column >= this.columns) {
			return false;
		}

		// row - 1 because the board is 0 indexed
		let row = this.rows - 1;

		while (row >= 0) {
			if (this.board[row][column] === 0) {
				this.board[row][column] = this.currentPlayer;
				if (historic) {
					this.setHistoric(`Player ${this.currentPlayer} : ${row} - ${column}`);
					if (this.checkWin(row, column)) {
						this.setHistoric(`Player ${this.currentPlayer} wins`);
						this.gameOver = true;
					} else {
						this.switchPlayer();
					}
				}
				return true;
			}
			row--;
		}
		// return false if the column is full
		return false;
	}

	public switchPlayer(): void {
		this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
	}

	public checkWin(row: number, column: number): boolean {
		return (
			this.checkHorizontal(row, column) ||
			this.checkVertical(row, column) ||
			this.checkDiagonalTopLeftBotRight(row, column) ||
			this.checkDiagonalTopRightBotLeft(row, column)
		);
	}

	private checkHorizontal(row: number, column: number): boolean {
		let count = 0;
		const player = this.board[row][column];
		for (let i = 0; i < this.columns; i++) {
			if (this.board[row][i] === player) {
				count++;
				if (count === 4) {
					return true;
				}
			} else {
				count = 0;
			}
		}
		return false;
	}

	private checkVertical(row: number, column: number): boolean {
		let count = 0;
		const player = this.board[row][column];
		for (let i = 0; i < this.rows; i++) {
			if (this.board[i][column] === player) {
				count++;
				if (count === 4) {
					return true;
				}
			} else {
				count = 0;
			}
		}
		return false;
	}

	private checkDiagonalTopLeftBotRight(row: number, column: number): boolean {
		let count = 0;
		const player = this.board[row][column];

		let col = column;
		let r = row;

		// check diagonal from top left to bottom right

		// go up and left
		while (col >= 0 && r >= 0 && this.board[r][col] === player) {
			count++;
			col--;
			r--;
		}

		// reset position
		col = column + 1;
		r = row + 1;

		// go down and right
		while (
			col < this.columns &&
			r < this.rows &&
			this.board[r][col] === player
		) {
			count++;
			col++;
			r++;
		}

		if (count >= 4) {
			console.info("diagonal top left to bottom right");
			return true;
		}
		return false;
	}

	private checkDiagonalTopRightBotLeft(row: number, column: number): boolean {
		let count = 0;
		const player = this.board[row][column];

		let col = column;
		let r = row;

		// check diagonal from top right to bottom left

		// go up and right
		while (col < this.columns && r >= 0 && this.board[r][col] === player) {
			count++;
			col++;
			r--;
		}

		// reset position
		col = column - 1;
		r = row + 1;

		// go down and right
		while (col >= 0 && r < this.rows && this.board[r][col] === player) {
			count++;
			col--;
			r++;
		}

		if (count >= 4) {
			console.info("diagonal top right to bottom left");
			return true;
		}
		return false;
	}

	public isGameOver(): boolean {
		return this.gameOver;
	}

	public reset(): void {
		this.initBoard();
		this.historic = [];
		this.gameOver = false;
		this.currentPlayer = 1;
		this.IA = false;
	}

	public getWinner(): number {
		return this.currentPlayer;
	}

	public getHistoric(): string[] {
		return this.historic;
	}

	public setHistoric(v: string): void {
		this.historic.push(v);
	}

	public boardFull(): boolean {
		for (let i = 0; i < this.columns; i++) {
			if (this.board[0][i] === 0) {
				return false;
			}
		}
		return true;
	}

	// IA part
	public startIa(): void {
		this.IA = true;
	}

	public playIA(): void {
		if (!this.IA || this.isGameOver()) {
			return;
		}
		console.info("IA turn");
		const depth = 6;
		const bestMove = this.getBestMove(depth, -Infinity, +Infinity, true);

		if (bestMove !== -1) {
			this.play(bestMove);
			if (this.checkWin(this.rows - 1, bestMove)) {
				this.setHistoric("The IA wins");
				this.gameOver = true;
			}
		}
	}

	private getBestMove(
		depth: number,
		alpha: number,
		beta: number,
		maximizingPlayer: boolean,
	): number {
		let bestMove = -1;
		let bestScore = maximizingPlayer ? -Infinity : +Infinity;

		for (let i = 0; i < this.columns; i++) {
			if (this.play(i, false)) {
				const score = this.minimax(depth - 1, alpha, beta, !maximizingPlayer);
				this.undoMove(i);

				if (
					(maximizingPlayer && score > bestScore) ||
					(!maximizingPlayer && score < bestScore)
				) {
					bestMove = i;
					bestScore = score;
				}

				if (maximizingPlayer) {
					alpha = Math.max(alpha, bestScore);
				} else {
					beta = Math.min(beta, bestScore);
				}

				if (alpha >= beta) {
					break;
				}
			}
		}

		return bestMove;
	}

	private minimax(
		depth: number,
		alpha: number,
		beta: number,
		maximizingPlayer: boolean,
	): number {
		if (depth === 0 || this.gameOver) {
			return this.evaluate();
		}

		if (maximizingPlayer) {
			let maxEval = -Infinity;

			for (let i = 0; i < this.columns; i++) {
				if (this.play(i, false)) {
					const evaluation = this.minimax(depth - 1, alpha, beta, false);
					this.undoMove(i);
					maxEval = Math.max(maxEval, evaluation);
					alpha = Math.max(alpha, evaluation);
					if (beta <= alpha) {
						break;
					}
				}
			}

			return maxEval;
		} else {
			let minEval = +Infinity;

			for (let i = 0; i < this.columns; i++) {
				if (this.play(i, false)) {
					const evaluation = this.minimax(depth - 1, alpha, beta, true);
					this.undoMove(i);
					minEval = Math.min(minEval, evaluation);
					beta = Math.min(beta, evaluation);
					if (beta <= alpha) {
						break;
					}
				}
			}

			return minEval;
		}
	}

	private evaluate(): number {
		let score = 0;

		// Evaluate horizontal lines
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col <= this.columns - 4; col++) {
				score += this.evaluateLine(row, col, 0, 1); // Evaluate consecutive cells in the same row
			}
		}

		// Evaluate vertical lines
		for (let col = 0; col < this.columns; col++) {
			for (let row = 0; row <= this.rows - 4; row++) {
				score += this.evaluateLine(row, col, 1, 0); // Evaluate consecutive cells in the same column
			}
		}

		// Evaluate diagonal lines (top left to bottom right)
		for (let row = 0; row <= this.rows - 4; row++) {
			for (let col = 0; col <= this.columns - 4; col++) {
				score += this.evaluateLine(row, col, 1, 1); // Evaluate consecutive cells in the diagonal
			}
		}

		// Evaluate diagonal lines (top right to bottom left)
		for (let row = 0; row <= this.rows - 4; row++) {
			for (let col = 3; col < this.columns; col++) {
				score += this.evaluateLine(row, col, 1, -1); // Evaluate consecutive cells in the diagonal
			}
		}
		return score;
	}

	private evaluateLine(
		row: number,
		col: number,
		rowIncrement: number,
		colIncrement: number,
	): number {
		const player = this.currentPlayer;
		let score = 0;
		let opponentCount = 0; // Number of opponent's pieces in the line
		let emptyCount = 0; // Number of empty cells in the line

		for (let i = 0; i < 4; i++) {
			const cell = this.board[row + i * rowIncrement][col + i * colIncrement];

			if (cell === player) {
				score++;
			} else if (cell === 0) {
				emptyCount++;
			} else {
				opponentCount++;
			}
		}

		// Assign scores based on the number of player's pieces, opponent's pieces, and empty cells
		if (score === 4) {
			// Player wins
			return 10000;
		} else if (score === 3 && emptyCount === 1) {
			// Three consecutive player's pieces with an empty cell
			return 100;
		} else if (score === 2 && emptyCount === 2) {
			// Two consecutive player's pieces with two empty cells
			return 10;
		} else if (opponentCount === 3 && emptyCount === 1) {
			// Three consecutive opponent's pieces with an empty cell
			return -1000;
		} else if (opponentCount === 2 && emptyCount === 2) {
			// Two consecutive opponent's pieces with two empty cells
			return -100;
		}

		return 0; // The line does not contribute to the score
	}

	// Remove the last move. Used for the minimax algorithm
	private undoMove(column: number): void {
		for (let row = 0; row < this.rows; row++) {
			if (this.board[row][column] !== 0) {
				this.board[row][column] = 0;
				break;
			}
		}
	}
}
