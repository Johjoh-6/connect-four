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

    public getPosFromNumber(num: number): { row: number, column: number } {
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
                if(historic){
                    this.setHistoric(`Player ${this.currentPlayer} : ${row} - ${column}`);
                }
                if (this.checkWin(row, column) && !this.IA) {
                    this.setHistoric(`Player ${this.currentPlayer} wins`);
                    this.gameOver = true;
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
        return this.checkHorizontal(row, column) || this.checkVertical(row, column) || this.checkDiagonalTopLeftBotRight(row, column) || this.checkDiagonalTopRightBotLeft(row, column);
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
        while (col < this.columns && r < this.rows && this.board[r][col] === player) {
            count++;
            col++;
            r++;
        }

        if (count >= 4) {
            console.info('diagonal top left to bottom right');
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
            console.info('diagonal top right to bottom left');
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
        if (!this.IA || this.gameOver) {
            return;
          }
          console.info('IA turn');
          const depth = 4;
          const bestMove = this.getBestMove(depth, -Infinity, +Infinity, true);
        
          if (bestMove !== -1) {
            const validMove = this.play(bestMove);
            console.log(validMove);
            if(validMove && this.checkWin(this.rows - 1, bestMove)){
                this.setHistoric('The IA wins');
                this.gameOver = true;
            }
            this.switchPlayer();
          }
        }
        
        private getBestMove(depth: number, alpha: number, beta: number, maximizingPlayer: boolean): number {
          let bestMove = -1;
          let bestScore = maximizingPlayer ? -Infinity : +Infinity;
        
          for (let i = 0; i < this.columns; i++) {
            if (this.play(i, false)) {
              const score = this.minimax(depth - 1, alpha, beta, !maximizingPlayer);
              this.undoMove(i);
        
              if ((maximizingPlayer && score > bestScore) || (!maximizingPlayer && score < bestScore)) {
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
        
        private minimax(depth: number, alpha: number, beta: number, maximizingPlayer: boolean): number {
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
          // Implement your evaluation function here
          // This function should return a score indicating the desirability of the current game state for the AI player
          // You can assign positive scores for favorable positions and negative scores for unfavorable positions
        
          // Example evaluation function (very simple):
          if (this.checkWin(this.rows - 1, this.columns - 1)) {
            // AI wins
            return 100;
          } else if (this.checkWin(this.rows - 1, 0)) {
            // Human wins
            return -100;
          } else {
            // No winner
            return 0;
          }
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