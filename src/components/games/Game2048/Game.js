import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Game2048.module.css';

const GRID_SIZE = 4;
const WINNING_VALUE = 2048;

export default function Game2048() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });

  function createEmptyGrid() {
    return Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
  }

  const addRandomTile = useCallback((grid) => {
    const emptyCells = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }
    if (emptyCells.length > 0) {
      const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[i][j] = Math.random() < 0.9 ? 2 : 4;
      return true;
    }
    return false;
  }, []);

  const processRow = useCallback((row, reverse) => {
    let newRow = row.filter(cell => cell !== 0);
    let score = 0;
    let didMove = false;

    if (reverse) newRow.reverse();

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        score += newRow[i];
        if (newRow[i] === WINNING_VALUE && !won) setWon(true);
        newRow.splice(i + 1, 1);
        didMove = true;
      }
    }

    if (reverse) newRow.reverse();

    while (newRow.length < GRID_SIZE) {
      if (reverse) newRow.unshift(0);
      else newRow.push(0);
    }

    if (!didMove) {
      didMove = JSON.stringify(row) !== JSON.stringify(newRow);
    }

    return { newRow, score, didMove };
  }, [won]);

  const checkGameStatus = useCallback((grid) => {
    if (!won && grid.some(row => row.includes(WINNING_VALUE))) {
      setWon(true);
    }

    let hasEmpty = false;
    let canMove = false;

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) hasEmpty = true;
        if (i < GRID_SIZE-1 && grid[i][j] === grid[i + 1][j]) canMove = true;
        if (j < GRID_SIZE-1 && grid[i][j] === grid[i][j + 1]) canMove = true;
      }
    }

    if (!hasEmpty && !canMove) {
      setGameOver(true);
    }
  }, [won]);

  const moveTiles = useCallback(async (direction) => {
    setIsMoving(true);
    const newGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = 0;

    if (direction === 'left' || direction === 'right') {
      for (let i = 0; i < GRID_SIZE; i++) {
        const result = processRow([...newGrid[i]], direction === 'right');
        if (result.didMove) moved = true;
        newScore += result.score;
        newGrid[i] = result.newRow;
      }
    } else {
      for (let j = 0; j < GRID_SIZE; j++) {
        let column = [];
        for (let i = 0; i < GRID_SIZE; i++) {
          column.push(newGrid[i][j]);
        }
        const result = processRow(column, direction === 'down');
        if (result.didMove) moved = true;
        newScore += result.score;
        for (let i = 0; i < GRID_SIZE; i++) {
          newGrid[i][j] = result.newRow[i];
        }
      }
    }

    if (moved) {
      const updatedScore = score + newScore;
      setScore(updatedScore);
      
      if (newScore > 0 && bestScore < updatedScore) {
        const newBestScore = updatedScore;
        setBestScore(newBestScore);
        localStorage.setItem('2048_bestScore', newBestScore.toString());
      }
      
      setGrid(newGrid);
      await new Promise(resolve => setTimeout(resolve, 150));
      
      if (addRandomTile(newGrid)) {
        setGrid([...newGrid]);
      }
      
      checkGameStatus(newGrid);
    }
    
    setIsMoving(false);
  }, [grid, score, bestScore, addRandomTile, processRow, checkGameStatus]);

  const handleKeyDown = useCallback((e) => {
    if (gameOver || isMoving) return;
    
    let direction;
    switch (e.key) {
      case 'ArrowUp': direction = 'up'; break;
      case 'ArrowDown': direction = 'down'; break;
      case 'ArrowLeft': direction = 'left'; break;
      case 'ArrowRight': direction = 'right'; break;
      default: return;
    }
    
    e.preventDefault();
    moveTiles(direction);
  }, [gameOver, isMoving, moveTiles]);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches ? e.touches[0] : e;
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (gameOver || isMoving) return;

    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const touchEnd = { x: touch.clientX, y: touch.clientY };
    
    const dx = touchEnd.x - touchStart.current.x;
    const dy = touchEnd.y - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) < 30) return;

    let direction;
    if (absDx > absDy) {
      direction = dx > 0 ? 'right' : 'left';
    } else {
      direction = dy > 0 ? 'down' : 'up';
    }

    moveTiles(direction);
  }, [gameOver, isMoving, moveTiles]);

  const startGame = useCallback(() => {
    const newGrid = createEmptyGrid();
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, [addRandomTile]);

  const getTileColor = useCallback((value) => {
    const colors = {
      0: '#cdc1b4',
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };
    return colors[value] || '#3c3a32';
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScore = localStorage.getItem('2048_bestScore');
      if (savedScore) {
        setBestScore(parseInt(savedScore, 10));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('2048_bestScore', bestScore.toString());
    }
  }, [bestScore]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <h1>2048</h1>
        <div className={styles.scores}>
          <div className={styles.scoreBox}>
            <div>SCORE</div>
            <div>{score}</div>
          </div>
          <div className={styles.scoreBox}>
            <div>MEILLEUR</div>
            <div>{bestScore}</div>
          </div>
        </div>
      </div>
      
      <div className={styles.gameInfo}>
        <p>Fusionnez les tuiles pour atteindre <strong>2048!</strong></p>
        <button onClick={startGame}>Nouvelle partie</button>
      </div>
      
      <div 
        className={`${styles.gridContainer} ${isMoving ? styles.noEvents : ''}`}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.gridRow}>
            {row.map((cell, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={`${styles.gridCell} ${cell ? styles[`tile-${cell}`] : ''}`}
                style={{ 
                  backgroundColor: getTileColor(cell),
                  color: cell > 4 ? '#f9f6f2' : '#776e65',
                  fontSize: cell < 100 ? '45px' : cell < 1000 ? '40px' : '35px'
                }}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {gameOver && (
        <div className={styles.gameOverlay}>
          <div className={styles.gameOverMessage}>
            <p>Game Over!</p>
            <button onClick={startGame}>Rejouer</button>
          </div>
        </div>
      )}
      
      {won && !gameOver && (
        <div className={styles.gameOverlay}>
          <div className={styles.gameWonMessage}>
            <p>Vous avez gagné!</p>
            <div className={styles.wonButtons}>
              <button onClick={startGame}>Nouvelle partie</button>
              <button onClick={() => setWon(false)}>Continuer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}