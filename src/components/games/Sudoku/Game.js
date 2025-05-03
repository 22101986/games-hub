// components/games/Sudoku/Game.js
import { useState, useEffect, useCallback } from 'react';
import styles from './Sudoku.module.css';

export default function SudokuGame() {
  const emptyBoard = generateEmptyBoard();
  const [board, setBoard] = useState(emptyBoard);
  const [initialBoard, setInitialBoard] = useState(emptyBoard);
  const [selectedCell, setSelectedCell] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [hasWon, setHasWon] = useState(false);

  const startNewGame = useCallback(() => {
    const { board: newBoard, initialBoard: newInitialBoard } = generateRandomSudoku(difficulty);
    setBoard(newBoard);
    setInitialBoard(newInitialBoard);
    setSelectedCell(null);
    setHasWon(false);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (isBoardComplete(board)) {
      setHasWon(isValidSudoku(board));
    }
  }, [board]);

  const handleCellClick = (row, col) => {
    if (initialBoard[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (num) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = num;
      setBoard(newBoard);
    }
  };

  return (
    <div className={styles.sudokuContainer}>
      <h1>Sudoku</h1>
      
      <div className={styles.difficultySelector}>
        <label>Difficulté : </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
        <button onClick={startNewGame}>Nouvelle Grille</button>
      </div>
      
      <div className={styles.sudokuBoard}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.sudokuRow}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`${styles.sudokuCell} 
                  ${initialBoard[rowIndex][colIndex] !== 0 ? styles.fixed : ''}
                  ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? styles.selected : ''}
                  ${(rowIndex + 1) % 3 === 0 ? styles.thickBottom : ''}
                  ${(colIndex + 1) % 3 === 0 ? styles.thickRight : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      {hasWon && (
        <div className={styles.winMessage}>
          🎉 Félicitations ! Vous avez gagné ! 🎉
        </div>
      )}
      
      <div className={styles.numberPad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button key={num} onClick={() => handleNumberInput(num)}>{num}</button>
        ))}
        <button onClick={() => handleNumberInput(0)}>X</button>
      </div>
    </div>
  );
}

function generateEmptyBoard() {
    return Array(9).fill().map(() => Array(9).fill(0));
  }
  
  function generateRandomSudoku(difficulty) {
    const solvedBoard = generateRandomSolvedBoard();
    const cellsToRemove = getCellsToRemove(difficulty);
    const puzzleBoard = removeCells(solvedBoard, cellsToRemove);
    
    return {
      board: puzzleBoard.map(row => [...row]),
      initialBoard: puzzleBoard.map(row => [...row])
    };
  }
  
  function generateRandomSolvedBoard() {
    const board = generateEmptyBoard();
    
    for (let box = 0; box < 9; box += 3) {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      shuffleArray(numbers);
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          board[box + i][box + j] = numbers.pop();
        }
      }
    }
    
    solveSudoku(board);
    return board;
  }
  
  function removeCells(board, count) {
    const newBoard = board.map(row => [...row]);
    let cellsRemoved = 0;
    
    while (cellsRemoved < count) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (newBoard[row][col] !== 0) {
        newBoard[row][col] = 0;
        cellsRemoved++;
      }
    }
    
    return newBoard;
  }
  
  function getCellsToRemove(difficulty) {
    switch (difficulty) {
      case 'easy': return 40;
      case 'medium': return 50;
      case 'hard': return 60;
      default: return 50;
    }
  }
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          shuffleArray(nums);
          
          for (const num of nums) {
            if (isValidPlacement(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  function isValidPlacement(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }
    
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }
    
    const boxStartRow = row - row % 3;
    const boxStartCol = col - col % 3;
    
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[boxStartRow + r][boxStartCol + c] === num) return false;
      }
    }
    
    return true;
  }
  
  function isBoardComplete(board) {
    return board.every(row => row.every(cell => cell !== 0));
  }
  
  function isValidSudoku(board) {
    for (let row = 0; row < 9; row++) {
      const seen = new Set();
      for (let col = 0; col < 9; col++) {
        const num = board[row][col];
        if (num === 0 || seen.has(num)) return false;
        seen.add(num);
      }
    }
    
    for (let col = 0; col < 9; col++) {
      const seen = new Set();
      for (let row = 0; row < 9; row++) {
        const num = board[row][col];
        if (num === 0 || seen.has(num)) return false;
        seen.add(num);
      }
    }
    
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set();
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            const num = board[boxRow * 3 + row][boxCol * 3 + col];
            if (num === 0 || seen.has(num)) return false;
            seen.add(num);
          }
        }
      }
    }
    
    return true;
  }
  