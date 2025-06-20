  class TicTacToe {
            constructor() {
                this.board = Array(9).fill('');
                this.currentPlayer = 'X';
                this.gameMode = 'ai';
                this.gameActive = true;
                this.scores = { X: 0, O: 0, draw: 0 };
                this.gameStarted = false;
                
                this.winningCombinations = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
                    [0, 4, 8], [2, 4, 6] 
                ];

                this.initializeGame();
            }

            initializeGame() {
                this.bindEvents();
                this.updateDisplay();
            }

            bindEvents() {
                // Start button
                document.getElementById('startBtn').addEventListener('click', () => {
                    this.startGame();
                });

                // Back button
                document.getElementById('backBtn').addEventListener('click', () => {
                    this.backToMenu();
                });

                // Game board clicks
                document.getElementById('gameBoard').addEventListener('click', (e) => {
                    if (e.target.classList.contains('cell')) {
                        this.handleCellClick(e.target);
                    }
                });

                // Reset button
                document.getElementById('resetBtn').addEventListener('click', () => {
                    this.resetGame();
                });

                // Mode selection buttons
                document.querySelectorAll('.mode-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.switchMode(e.target.dataset.mode);
                    });
                });
            }

            startGame() {
                this.gameStarted = true;
                document.getElementById('startScreen').classList.add('hidden');
                document.getElementById('gameContent').classList.add('visible');
                this.resetGame();
            }

            backToMenu() {
                this.gameStarted = false;
                document.getElementById('startScreen').classList.remove('hidden');
                document.getElementById('gameContent').classList.remove('visible');
                
                this.scores = { X: 0, O: 0, draw: 0 };
                this.updateScoreboard();
            }

            switchMode(mode) {
                this.gameMode = mode;
                document.querySelectorAll('.mode-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
                
                if (this.gameStarted) {
                    this.resetGame();
                }
            }

            handleCellClick(cell) {
                const index = parseInt(cell.dataset.index);
                
                if (this.board[index] !== '' || !this.gameActive) return;

                this.makeMove(index, this.currentPlayer);
                
                if (this.gameActive && this.gameMode === 'ai' && this.currentPlayer === 'O') {
                    this.showThinking();
                    setTimeout(() => this.makeAIMove(), 800);
                }
            }

            makeMove(index, player) {
                this.board[index] = player;
                const cell = document.querySelector(`[data-index="${index}"]`);
                cell.textContent = player;
                cell.classList.add(player.toLowerCase());
                
                if (this.checkWinner()) {
                    this.handleGameEnd(player);
                } else if (this.board.every(cell => cell !== '')) {
                    this.handleGameEnd('draw');
                } else {
                    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                    this.updateDisplay();
                }
            }

            makeAIMove() {
                if (!this.gameActive) return;
                
                const bestMove = this.getBestMove();
                this.makeMove(bestMove, 'O');
            }

            getBestMove() {
                // Check if AI can win
                for (let i = 0; i < 9; i++) {
                    if (this.board[i] === '') {
                        this.board[i] = 'O';
                        if (this.checkWinnerForBoard(this.board)) {
                            this.board[i] = '';
                            return i;
                        }
                        this.board[i] = '';
                    }
                }

                // Check if AI needs to block player
                for (let i = 0; i < 9; i++) {
                    if (this.board[i] === '') {
                        this.board[i] = 'X';
                        if (this.checkWinnerForBoard(this.board)) {
                            this.board[i] = '';
                            return i;
                        }
                        this.board[i] = '';
                    }
                }

                // Take center if available
                if (this.board[4] === '') return 4;

                // Take corners
                const corners = [0, 2, 6, 8];
                const availableCorners = corners.filter(i => this.board[i] === '');
                if (availableCorners.length > 0) {
                    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
                }

                // Take any available space
                const available = this.board.map((cell, index) => cell === '' ? index : null).filter(i => i !== null);
                return available[Math.floor(Math.random() * available.length)];
            }

            checkWinner() {
                return this.checkWinnerForBoard(this.board);
            }

            checkWinnerForBoard(board) {
                return this.winningCombinations.some(combination => {
                    const [a, b, c] = combination;
                    return board[a] && board[a] === board[b] && board[a] === board[c];
                });
            }

            handleGameEnd(result) {
                this.gameActive = false;
                
                if (result === 'draw') {
                    this.scores.draw++;
                    document.getElementById('gameInfo').textContent = "It's a draw! 🤝";
                } else {
                    this.scores[result]++;
                    const winner = result === 'X' ? 'Player X' : (this.gameMode === 'ai' ? 'AI' : 'Player O');
                    document.getElementById('gameInfo').textContent = `${winner} wins! 🎉`;
                    this.highlightWinningCells();
                }
                
                this.updateScoreboard();
            }

            highlightWinningCells() {
                this.winningCombinations.forEach(combination => {
                    const [a, b, c] = combination;
                    if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                        [a, b, c].forEach(index => {
                            document.querySelector(`[data-index="${index}"]`).classList.add('winner');
                        });
                    }
                });
            }

            showThinking() {
                document.getElementById('gameInfo').innerHTML = '<span class="thinking">AI is thinking... 🤔</span>';
            }

            updateDisplay() {
                if (this.gameActive) {
                    const currentPlayerName = this.currentPlayer === 'X' ? 'Your' : 
                        (this.gameMode === 'ai' ? 'AI\'s' : 'Player O\'s');
                    document.getElementById('gameInfo').textContent = `${currentPlayerName} turn`;
                }
            }

            updateScoreboard() {
                document.getElementById('scoreX').textContent = this.scores.X;
                document.getElementById('scoreO').textContent = this.scores.O;
                document.getElementById('scoreDraw').textContent = this.scores.draw;
            }

            resetGame() {
                this.board = Array(9).fill('');
                this.currentPlayer = 'X';
                this.gameActive = true;
                
                document.querySelectorAll('.cell').forEach(cell => {
                    cell.textContent = '';
                    cell.classList.remove('x', 'o', 'winner');
                });
                
                this.updateDisplay();
            }
        }

        // Initialize the game when the page loads
        window.addEventListener('DOMContentLoaded', () => {
            new TicTacToe();
        });