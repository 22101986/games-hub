import React from 'react';
import styles from './MotsMeles.module.css';

const WordList = ({ words, foundWords }) => {
  return (
    <div className={styles.wordList}>
      <h3 className={styles.words}>Mots à trouver:</h3>
      <ul>
        {words.map((word, index) => (
          <li 
            key={index} 
            className={foundWords.includes(word) ? styles.found : ''}
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordList;