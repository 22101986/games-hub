import React from 'react';
import styles from './MotsMeles.module.css';

const Controls = ({ difficulty, setDifficulty, onNewGame }) => {
  return (
    <div className={styles.controls}>      
      <div className={styles.controlGroup}>
        <label>Difficulté:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Facile (12x12)</option>
          <option value="medium">Moyen (15x15)</option>
          <option value="hard">Difficile (20x20)</option>
        </select>
      </div>
      
      <button onClick={onNewGame}>Nouvelle partie</button>
    </div>
  );
};

export default Controls;