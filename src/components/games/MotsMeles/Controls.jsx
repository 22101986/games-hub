import React from 'react';
import styles from './MotsMeles.module.css';

const Controls = ({ gridSize, setGridSize, difficulty, setDifficulty, onNewGame }) => {
  return (
    <div className={styles.controls}>
      <div className={styles.controlGroup}>
        <label>Taille de la grille:</label>
        <select value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value))}>
          <option value="12">12x12</option>
          <option value="15">15x15</option>
          <option value="20">20x20</option>
        </select>
      </div>
      
      <div className={styles.controlGroup}>
        <label>Difficulté:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
      </div>
      
      <button onClick={onNewGame}>Nouvelle partie</button>
    </div>
  );
};

export default Controls;