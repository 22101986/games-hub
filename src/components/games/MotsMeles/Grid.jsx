import React from 'react';
import styles from './MotsMeles.module.css';

const Grid = ({ grid, selectedCells, foundWords, wordPositions, onCellClick }) => {
  const isSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isInFoundWord = (row, col) => {
    return foundWords.some(word => 
      wordPositions[word]?.some(cell => 
        cell.row === row && cell.col === col
      )
    );
  };

  return (
    <div className={styles.gridContainer}>
      <table className={styles.grid}>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => {
                const selected = isSelected(rowIndex, colIndex);
                const found = isInFoundWord(rowIndex, colIndex);
                
                let className = styles.cell;
                if (selected) className += ` ${styles.selected}`;
                if (found) className += ` ${styles.found}`;
                
                return (
                  <td 
                    key={colIndex} 
                    className={className}
                    onClick={() => onCellClick(rowIndex, colIndex)}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;