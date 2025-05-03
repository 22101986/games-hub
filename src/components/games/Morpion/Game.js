// components/games/Morpion/Game.js
import { useState, useEffect } from 'react';
import styles from './Morpion.module.css';

export default function MorpionGame() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [difficulty, setDifficulty] = useState('easy');
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('🟢');

  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    if (isMultiplayer) {
      setCurrentPlayer(currentPlayer === '🟢' ? '❌' : '🟢');
    }
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setCurrentPlayer('🟢');
  }

  function toggleDifficulty() {
    setDifficulty(prev => {
      if (prev === 'easy') return 'medium';
      if (prev === 'medium') return 'hard';
      return 'easy';
    });
  }

  function toggleMode() {
    setIsMultiplayer(prev => !prev);
    restartGame();
  }

  useEffect(() => {
    const current = history[currentMove];
    const winnerInfo = calculateWinner(current);

    if (!isMultiplayer && !winnerInfo && current.filter(Boolean).length % 2 === 1) {
      const playAI = () => {
        const nextSquares = current.slice();
        const aiMove =
          difficulty === 'easy'
            ? getVeryEasyMove(current)
            : difficulty === 'medium'
            ? getRandomMove(current)
            : getBestMove(current, '❌');

        if (aiMove !== null) {
          nextSquares[aiMove] = '❌';
          handlePlay(nextSquares);
        }
      };

      const timeout = setTimeout(playAI, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentMove, history, difficulty, isMultiplayer]);

  return (
    <div className={styles.morpionContainer}>
      <div className={styles.gameBoard}>
        <Board
          squares={currentSquares}
          onPlay={handlePlay}
          currentPlayer={currentPlayer}
          isMultiplayer={isMultiplayer}
        />
        <div className={styles.controls}>
          <button className={styles.restartButton} onClick={restartGame}>
            🔁 Recommencer
          </button>
          {!isMultiplayer && (
            <button onClick={toggleDifficulty}>
              Difficulté: {difficulty === 'easy' ? 'Facile' : difficulty === 'medium' ? 'Moyen' : 'Difficile'}
            </button>
          )}
          <button onClick={toggleMode}>
            {isMultiplayer ? 'Multijoueur' : 'Solo'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Board({ squares, onPlay, currentPlayer, isMultiplayer }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const winningSquares = winnerInfo?.line || [];

  function handleClick(i) {
    if (winner || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = currentPlayer;
    onPlay(nextSquares);
  }

  let status;
  if (winner === '🟢') {
    status = `🎉 Le joueur 🟢 a gagné !`;
  } else if (winner === '❌') {
    status = `🎉 Le joueur ❌ a gagné !`;
  } else if (!squares.includes(null)) {
    status = '🤝 Match nul !';
  } else {
    status = isMultiplayer
      ? `Tour de ${currentPlayer}`
      : '🟢MORPION❌';
  }

  return (
    <>
      <div className={styles.status}>{status}</div>
      <div className={styles.board}>
        {[0, 1, 2].map(row => (
          <div className={styles.boardRow} key={row}>
            {[0, 1, 2].map(col => {
              const i = row * 3 + col;
              return (
                <Square
                  key={i}
                  value={squares[i]}
                  onClick={() => handleClick(i)}
                  highlight={winningSquares.includes(i)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

function Square({ value, onClick, highlight }) {
  return (
    <button 
      className={`${styles.square} ${highlight ? styles.highlight : ''}`} 
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  }
  
  function getVeryEasyMove(squares) {
    const empty = squares.map((val, idx) => val === null ? idx : null).filter(i => i !== null);
    if (empty.length === 0) return null;
    return empty[Math.floor(Math.random() * empty.length)];
  }
  
  function getRandomMove(squares) {
    const empty = squares.map((val, idx) => val === null ? idx : null).filter(i => i !== null);
    for (let i of empty) {
      const copy = squares.slice();
      copy[i] = '🟢';
      if (calculateWinner(copy)?.winner === '🟢') {
        return i;
      }
    }
    if (empty.length === 0) return null;
    return empty[Math.floor(Math.random() * empty.length)];
  }
  
  function getBestMove(squares, player) {
    const opponent = player === '❌' ? '🟢' : '❌';
  
    function minimax(board, isMaximizing) {
      const winnerInfo = calculateWinner(board);
      if (winnerInfo?.winner === player) return { score: 1 };
      if (winnerInfo?.winner === opponent) return { score: -1 };
      if (!board.includes(null)) return { score: 0 };
  
      const scores = [];
      board.forEach((val, idx) => {
        if (val === null) {
          const newBoard = board.slice();
          newBoard[idx] = isMaximizing ? player : opponent;
          const result = minimax(newBoard, !isMaximizing);
          scores.push({ index: idx, score: result.score });
        }
      });
  
      const best = isMaximizing
        ? scores.reduce((a, b) => (a.score > b.score ? a : b))
        : scores.reduce((a, b) => (a.score < b.score ? a : b));
  
      return best;
    }
  
    const bestMove = minimax(squares, true);
    return bestMove.index ?? null;
  }
  
