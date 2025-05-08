import { useState, useEffect, useRef } from 'react';
import styles from './Snake.module.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const gameLoopRef = useRef();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    const isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
    
    if (isOnSnake) {
      return generateFood();
    }
    
    return newFood;
  };

  const changeDirection = (newDirection) => {
    if (
      (direction === 'UP' && newDirection === 'DOWN') ||
      (direction === 'DOWN' && newDirection === 'UP') ||
      (direction === 'LEFT' && newDirection === 'RIGHT') ||
      (direction === 'RIGHT' && newDirection === 'LEFT')
    ) {
      return;
    }
    setDirection(newDirection);
  };

  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
        case ' ':
          e.preventDefault(); // Empêche le scroll
          break;
        default:
          break;
      }
    
      switch (e.key) {
        case 'ArrowUp':
          changeDirection('UP');
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isMobile]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };

        switch (direction) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
          default:
            break;
        }

        if (
          head.x < 0 || head.x >= GRID_SIZE ||
          head.y < 0 || head.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          setFood(generateFood());
          setScore(prev => prev + 1);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED - (score * 2));
    return () => clearInterval(gameLoopRef.current);
  }, [direction, food, gameOver, isPaused, score]);

  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  return (
    <div className={styles.gameContainer}>
      <h1>Snake Game</h1>
      <div className={styles.gameInfo}>
        <span>Score: {score}</span>
        <button className={styles.button} onClick={() => setIsPaused(prev => !prev)}>
          {isPaused ? 'Reprendre' : 'Pause'}
        </button>
        <button className={styles.button} onClick={restartGame}>Recommencer</button>
      </div>
      
      <div 
        className={styles.gameBoard} 
        style={{ 
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
      >
        <div 
          className={styles.food} 
          style={{ 
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE
          }}
        />
        
        {snake.map((segment, index) => (
          <div 
            key={index}
            className={`${styles.snakeSegment} ${index === 0 ? styles.snakeHead : ''}`}
            style={{ 
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE
            }}
          />
        ))}
        
        {gameOver && (
          <div className={styles.gameOver}>
            <h2>Game Over!</h2>
            <button className={styles.button} onClick={restartGame}>Rejouer</button>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div className={styles.pauseScreen}>
            <h2>Pause</h2>
          </div>
        )}
      </div>

      {isMobile && (
        <div className={styles.mobileControls}>
          <div className={styles.dPad}>
            <button 
              className={`${styles.dPadButton} ${styles.up}`} 
              onClick={() => changeDirection('UP')}
              aria-label="Up"
            >↑</button>
            <button 
              className={`${styles.dPadButton} ${styles.down}`} 
              onClick={() => changeDirection('DOWN')}
              aria-label="Down"
            >↓</button>
            <button 
              className={`${styles.dPadButton} ${styles.left}`} 
              onClick={() => changeDirection('LEFT')}
              aria-label="Left"
            >←</button>
            <button 
              className={`${styles.dPadButton} ${styles.right}`} 
              onClick={() => changeDirection('RIGHT')}
              aria-label="Right"
            >→</button>
            <div className={styles.dPadCenter}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;