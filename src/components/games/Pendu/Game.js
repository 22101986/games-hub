import React, { useState, useEffect } from 'react';
import styles from './Pendu.module.css';

const WORDS = [
  'REACT', 'NEXTJS', 'COMPONENT', 'HOOKS', 'STATE', 
  'PROPS', 'CONTEXT', 'ROUTER', 'SERVER', 'CLIENT',
  'RENDERING', 'SSR', 'CSR', 'ISR', 'API',
  'USEEFFECT', 'USESTATE', 'USECONTEXT', 'USEREDUCER', 'USECALLBACK',
  'USEMEMO', 'USEREF', 'CUSTOMHOOK', 'DYNAMIC', 'OPTIMIZATION'
];
const MAX_ERRORS = 6;

export default function PenduGame() {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [errorCount, setErrorCount] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (!word) return;
    const hasWon = [...word].every(letter => guessedLetters.includes(letter));
    if (hasWon) {
      setGameStatus('won');
    } else if (errorCount >= MAX_ERRORS) {
      setGameStatus('lost');
    }
  }, [guessedLetters, errorCount, word]);

  const startNewGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setErrorCount(0);
    setGameStatus('playing');
  };

  const handleGuess = (letter) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;
    setGuessedLetters(prev => [...prev, letter]);
    if (!word.includes(letter)) {
      setErrorCount(prev => prev + 1);
    }
  };

  const renderWord = () => (
    <div className={styles.wordDisplay}>
      {word.split('').map((letter, index) => (
        <span key={index} className={styles.letter}>
          {guessedLetters.includes(letter) || gameStatus === 'lost' ? letter : '_'}
        </span>
      ))}
    </div>
  );

  const renderAlphabet = () =>
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
      <button
        key={letter}
        onClick={() => handleGuess(letter)}
        disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
        className={`${styles.letterBtn} ${
          guessedLetters.includes(letter)
            ? word.includes(letter)
              ? styles.correct
              : styles.incorrect
            : ''
        }`}
      >
        {letter}
      </button>
    ));

  const renderHangman = () => (
    <div className={styles.hangmanDrawing}>
      <div className={styles.standTop}></div>
      <div className={styles.standVertical}></div>
      <div className={styles.supportDiagonal}></div>
      <div className={styles.standBase}></div>
      <div className={styles.rope}></div>

      {errorCount > 0 && <div className={styles.head}></div>}
      {errorCount > 1 && <div className={styles.body}></div>}
      {errorCount > 2 && <div className={styles.leftArm}></div>}
      {errorCount > 3 && <div className={styles.rightArm}></div>}
      {errorCount > 4 && <div className={styles.leftLeg}></div>}
      {errorCount > 5 && <div className={styles.rightLeg}></div>}
    </div>
  );

  return (
    <div className={styles.hangmanGame}>
      <h1>PenduNext</h1>

      {renderHangman()}
      {renderWord()}

      <div className={styles.status}>
        Erreurs : {errorCount}/{MAX_ERRORS}
        {gameStatus === 'won' && <div className={`${styles.message} ${styles.won}`}>🎉 Bravo ! Vous avez gagné !</div>}
        {gameStatus === 'lost' && <div className={`${styles.message} ${styles.lost}`}>💀 Perdu ! Le mot était : {word}</div>}
      </div>

      <div className={styles.alphabet}>{renderAlphabet()}</div>

      <button className={styles.resetBtn} onClick={startNewGame}>
        Nouvelle partie
      </button>
    </div>
  );
}