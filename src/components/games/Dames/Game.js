import React, { useState, useEffect } from 'react';
import styles from './Dames.module.css';

const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

const GAME_MODES = {
  PLAYER_VS_AI: 'player-vs-ai',
  PLAYER_VS_PLAYER: 'player-vs-player'
};

const CheckersGame = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [validMoves, setValidMoves] = useState([]);
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM);
  const [gameStatus, setGameStatus] = useState('setup');
  const [playerNames, setPlayerNames] = useState({ white: 'Joueur 1', black: 'Joueur 2' });
  const [aiChainCapture, setAiChainCapture] = useState(null);

  function initializeBoard() {
    const board = Array(10).fill().map(() => Array(10).fill(null));
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 10; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { color: 'black', isKing: false };
        }
      }
    }
    
    for (let row = 6; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if ((row + col) % 2 === 1) {
          board[row][col] = { color: 'white', isKing: false };
        }
      }
    }
    
    return board;
  }

  const handleSquareClick = (row, col) => {
    if (gameStatus !== 'playing') return;
    if ((row + col) % 2 === 0) return;
    if (gameMode === GAME_MODES.PLAYER_VS_AI && currentPlayer === 'black') return;

    if (selectedPiece) {
      const move = validMoves.find(m => m.to.row === row && m.to.col === col);
      if (move) {
        makeMove(move);
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    } 
    else if (board[row][col]?.color === currentPlayer) {
      const moves = getValidMoves(board, row, col, currentPlayer);
      if (moves.length > 0) {
        setSelectedPiece({ row, col });
        setValidMoves(moves);
      }
    }
  };

  const makeMove = (move) => {
    const newBoard = [...board.map(row => [...row])];
    const { from, to, captured } = move;
    const piece = newBoard[from.row][from.col];

    newBoard[from.row][from.col] = null;
    newBoard[to.row][to.col] = { ...piece };

    if ((piece.color === 'white' && to.row === 0) || (piece.color === 'black' && to.row === 9)) {
      newBoard[to.row][to.col].isKing = true;
    }

    if (captured) {
      newBoard[captured.row][captured.col] = null;
    }

    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);

    if (captured) {
      const moreCaptures = getValidMoves(newBoard, to.row, to.col, currentPlayer)
        .filter(m => m.captured);
      
      if (moreCaptures.length > 0) {
        if (gameMode === GAME_MODES.PLAYER_VS_AI && currentPlayer === 'black') {
          return;
        } else {
          setSelectedPiece({ row: to.row, col: to.col });
          setValidMoves(moreCaptures);
          return;
        }
      }
    }

    const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
    setCurrentPlayer(nextPlayer);

    checkGameEnd(newBoard, nextPlayer);
  };

  const getValidMoves = (board, row, col, player) => {
    const piece = board[row][col];
    if (!piece || piece.color !== player) return [];
    
    const moves = [];
    
    if (piece.isKing) {
      const directions = [{dr: -1, dc: -1}, {dr: -1, dc: 1}, {dr: 1, dc: -1}, {dr: 1, dc: 1}];
      
      for (const dir of directions) {
        let i = 1;
        let captureFound = false;
        let capturePosition = null;
        
        while (true) {
          const newRow = row + dir.dr * i;
          const newCol = col + dir.dc * i;
          
          if (newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 10) break;
          
          const square = board[newRow][newCol];
          
          if (!captureFound) {
            if (!square) {
              moves.push({
                from: { row, col },
                to: { row: newRow, col: newCol }
              });
            } 
            else if (square.color !== player) {
              captureFound = true;
              capturePosition = { row: newRow, col: newCol };
            } 
            else {
              break;
            }
          } else {
            if (!square) {
              moves.push({
                from: { row, col },
                to: { row: newRow, col: newCol },
                captured: capturePosition
              });
            } else {
              break;
            }
          }
          
          i++;
        }
      }
    } else {
      const directions = piece.color === 'white' 
        ? [{dr: -1, dc: -1}, {dr: -1, dc: 1}]
        : [{dr: 1, dc: -1}, {dr: 1, dc: 1}];
      
      for (const dir of directions) {
        const newRow = row + dir.dr;
        const newCol = col + dir.dc;
        
        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
          if (board[newRow][newCol]?.color !== player && board[newRow][newCol] !== null) {
            const jumpRow = newRow + dir.dr;
            const jumpCol = newCol + dir.dc;
            if (jumpRow >= 0 && jumpRow < 10 && jumpCol >= 0 && jumpCol < 10 && !board[jumpRow][jumpCol]) {
              moves.push({ 
                from: { row, col }, 
                to: { row: jumpRow, col: jumpCol },
                captured: { row: newRow, col: newCol }
              });
            }
          }
        }
      }

      if (moves.length > 0) return moves;

      for (const dir of directions) {
        const newRow = row + dir.dr;
        const newCol = col + dir.dc;
        
        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10 && !board[newRow][newCol]) {
          moves.push({ from: { row, col }, to: { row: newRow, col: newCol } });
        }
      }
    }
    
    return moves;
  };

  const checkGameEnd = (board, player) => {
    let whitePieces = 0;
    let blackPieces = 0;
    let whiteCanMove = false;
    let blackCanMove = false;

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (board[row][col]?.color === 'white') {
          whitePieces++;
          if (getValidMoves(board, row, col, 'white').length > 0) {
            whiteCanMove = true;
          }
        } else if (board[row][col]?.color === 'black') {
          blackPieces++;
          if (getValidMoves(board, row, col, 'black').length > 0) {
            blackCanMove = true;
          }
        }
      }
    }

    if (whitePieces === 0 || !whiteCanMove) {
      setGameStatus('black-wins');
    } else if (blackPieces === 0 || !blackCanMove) {
      setGameStatus('white-wins');
    }
  };

  const executeAICaptureChain = (currentBoard, fromPosition) => {
    const moves = getValidMoves(currentBoard, fromPosition.row, fromPosition.col, 'black')
      .filter(m => m.captured);

    if (moves.length === 0) {
      setCurrentPlayer('white');
      checkGameEnd(currentBoard, 'white');
      setAiChainCapture(null);
      return;
    }

    let bestMove;
    if (difficulty === DIFFICULTY_LEVELS.EASY) {
      bestMove = moves[Math.floor(Math.random() * moves.length)];
    } else {
      bestMove = moves.reduce((best, move) => {
        const simulatedBoard = [...currentBoard.map(row => [...row])];
        const { from, to, captured } = move;
        const piece = simulatedBoard[from.row][from.col];

        simulatedBoard[from.row][from.col] = null;
        simulatedBoard[to.row][to.col] = { ...piece };

        if (to.row === 9) {
          simulatedBoard[to.row][to.col].isKing = true;
        }

        if (captured) {
          simulatedBoard[captured.row][captured.col] = null;
        }

        const score = evaluateBoard(simulatedBoard);
        return score > best.score ? { move, score } : best;
      }, { move: moves[0], score: -Infinity }).move;
    }

    const newBoard = [...currentBoard.map(row => [...row])];
    const { to, captured } = bestMove;
    const piece = newBoard[fromPosition.row][fromPosition.col];

    newBoard[fromPosition.row][fromPosition.col] = null;
    newBoard[to.row][to.col] = { ...piece };

    if (to.row === 9) {
      newBoard[to.row][to.col].isKing = true;
    }

    if (captured) {
      newBoard[captured.row][captured.col] = null;
    }

    setBoard(newBoard);

    setTimeout(() => {
      executeAICaptureChain(newBoard, { row: to.row, col: to.col });
    }, 500);
  };

  useEffect(() => {
    if (gameStatus === 'playing' && gameMode === GAME_MODES.PLAYER_VS_AI && currentPlayer === 'black') {
      const timer = setTimeout(() => {
        if (aiChainCapture) {
          executeAICaptureChain(board, aiChainCapture);
          return;
        }

        let allMoves = [];
        for (let row = 0; row < 10; row++) {
          for (let col = 0; col < 10; col++) {
            if (board[row][col]?.color === 'black') {
              const moves = getValidMoves(board, row, col, 'black');
              allMoves.push(...moves.map(m => ({ ...m, from: { row, col } })));
            }
          }
        }

        const captureMoves = allMoves.filter(m => m.captured);
        const availableMoves = captureMoves.length > 0 ? captureMoves : allMoves;

        if (availableMoves.length === 0) {
          setCurrentPlayer('white');
          checkGameEnd(board, 'white');
          return;
        }

        let move;
        switch (difficulty) {
          case DIFFICULTY_LEVELS.EASY:
            move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            break;
          
          case DIFFICULTY_LEVELS.MEDIUM:
            move = availableMoves.sort((a, b) => {
              const aScore = (a.captured ? 2 : 0) + (a.to.row === 9 ? 1 : 0);
              const bScore = (b.captured ? 2 : 0) + (b.to.row === 9 ? 1 : 0);
              return bScore - aScore;
            })[0];
            break;
          
          case DIFFICULTY_LEVELS.HARD:
            move = availableMoves.reduce((best, m) => {
              const simulatedBoard = [...board.map(row => [...row])];
              const { from, to, captured } = m;
              const piece = simulatedBoard[from.row][from.col];

              simulatedBoard[from.row][from.col] = null;
              simulatedBoard[to.row][to.col] = { ...piece };

              if (to.row === 9) {
                simulatedBoard[to.row][to.col].isKing = true;
              }

              if (captured) {
                simulatedBoard[captured.row][captured.col] = null;
              }

              const score = evaluateBoard(simulatedBoard);
              return score > best.score ? { move: m, score } : best;
            }, { move: availableMoves[0], score: -Infinity }).move;
            break;
          
          default:
            move = availableMoves[0];
        }

        if (move.captured) {
          setAiChainCapture({ row: move.from.row, col: move.from.col });
          executeAICaptureChain(board, move.from);
        } else {
          makeMove(move);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameStatus, gameMode, board, aiChainCapture]);

  const evaluateBoard = (board) => {
    let score = 0;

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const piece = board[row][col];
        if (piece) {
          const pieceValue = piece.isKing ? 3 : 1;
          const positionValue = piece.color === 'black' 
            ? (9 - row) * 0.1 
            : row * 0.1;

          score += piece.color === 'black' 
            ? pieceValue + positionValue 
            : -(pieceValue + positionValue);
        }
      }
    }

    return score;
  };

  const startGame = (mode) => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setValidMoves([]);
    setCurrentPlayer('white');
    setGameMode(mode);
    setGameStatus('playing');
    setAiChainCapture(null);
    
    if (mode === GAME_MODES.PLAYER_VS_PLAYER) {
      const whiteName = prompt("Nom du Joueur 1 (Blanc):", "Joueur 1");
      const blackName = prompt("Nom du Joueur 2 (Noir):", "Joueur 2");
      setPlayerNames({
        white: whiteName || "Joueur 1",
        black: blackName || "Joueur 2"
      });
    } else {
      setPlayerNames({
        white: "Joueur",
        black: "IA"
      });
    }
  };

  const resetGame = () => {
    setGameStatus('setup');
    setAiChainCapture(null);
  };

  const getCurrentPlayerName = () => {
    if (gameMode === GAME_MODES.PLAYER_VS_AI) {
      return currentPlayer === 'white' ? playerNames.white : playerNames.black;
    }
    return currentPlayer === 'white' ? playerNames.white : playerNames.black;
  };

  return (
    <div className={styles.container}>
      <h1>Jeu de Dames</h1>
      
      {gameStatus === 'setup' && (
        <div className={styles.gameSetup}>
          <h2>Choisissez un mode de jeu</h2>
          <div className={styles.gameOptions}>
            <button 
              className={styles.button} 
              onClick={() => startGame(GAME_MODES.PLAYER_VS_AI)}
            >
              Joueur vs IA
            </button>
            <button 
              className={styles.button} 
              onClick={() => startGame(GAME_MODES.PLAYER_VS_PLAYER)}
            >
              Joueur vs Joueur
            </button>
          </div>
          
          {gameMode === GAME_MODES.PLAYER_VS_AI && (
            <>
              <h2>Niveau de difficulté</h2>
              <div className={styles.difficultyOptions}>
                <button 
                  className={`${styles.button} ${difficulty === DIFFICULTY_LEVELS.EASY ? styles.buttonActive : ''}`}
                  onClick={() => setDifficulty(DIFFICULTY_LEVELS.EASY)}
                >
                  Facile
                </button>
                <button 
                  className={`${styles.button} ${difficulty === DIFFICULTY_LEVELS.MEDIUM ? styles.buttonActive : ''}`}
                  onClick={() => setDifficulty(DIFFICULTY_LEVELS.MEDIUM)}
                >
                  Moyen
                </button>
                <button 
                  className={`${styles.button} ${difficulty === DIFFICULTY_LEVELS.HARD ? styles.buttonActive : ''}`}
                  onClick={() => setDifficulty(DIFFICULTY_LEVELS.HARD)}
                >
                  Difficile
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {gameStatus === 'playing' && (
        <>
          <div className={styles.gameInfo}>
            <div className={`${styles.status} ${currentPlayer === 'white' ? styles.statusWhite : styles.statusBlack}`}>
              Tour: {getCurrentPlayerName()} ({currentPlayer === 'white' ? 'Blanc' : 'Noir'})
            </div>
            <button className={styles.button} onClick={resetGame}>Nouvelle partie</button>
          </div>
          
          <div className={styles.board}>
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.row}>
                {row.map((square, colIndex) => {
                  const isDark = (rowIndex + colIndex) % 2 === 1;
                  const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
                  const isValidMove = validMoves.some(m => m.to.row === rowIndex && m.to.col === colIndex);
                  
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`${styles.square} ${isDark ? styles.squareDark : styles.squareLight} 
                        ${isSelected ? styles.squareSelected : ''} 
                        ${isValidMove ? styles.squareValidMove : ''}`}
                      onClick={() => isDark && handleSquareClick(rowIndex, colIndex)}
                    >
                      {square && (
                        <div className={`${styles.piece} ${square.color === 'white' ? styles.pieceWhite : styles.pieceBlack} ${square.isKing ? styles.pieceKing : ''}`}>
                          {square.isKing && <div className={styles.kingMarker}>D</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}

      {(gameStatus === 'white-wins' || gameStatus === 'black-wins') && (
        <div className={styles.gameOver}>
          <h2>Partie terminée !</h2>
          <p>
            {gameStatus === 'white-wins' 
              ? `${playerNames.white} (Blanc) a gagné !` 
              : `${playerNames.black} (Noir) a gagné !`}
          </p>
          <button className={styles.button} onClick={resetGame}>Nouvelle partie</button>
        </div>
      )}
    </div>
  );
};

export default CheckersGame;