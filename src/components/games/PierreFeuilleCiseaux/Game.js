import React, { useState } from 'react';
import styles from './PierreFeuilleCiseaux.module.css';

const PierreFeuilleCiseaux = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [gameHistory, setGameHistory] = useState([]);

  const choices = [
    { id: 'pierre', emoji: '✊', name: 'Pierre' },
    { id: 'feuille', emoji: '✋', name: 'Feuille' },
    { id: 'ciseaux', emoji: '✌️', name: 'Ciseaux' }
  ];

  const handlePlayerChoice = (choice) => {
    const computerSelection = choices[Math.floor(Math.random() * choices.length)];
    
    setPlayerChoice(choices.find(c => c.id === choice));
    setComputerChoice(computerSelection);
    
    const gameResult = determineWinner(choice, computerSelection.id);
    setResult(gameResult);
    
    setGameHistory([...gameHistory, {
      player: choice,
      computer: computerSelection.id,
      result: gameResult
    }]);
  };

  const determineWinner = (player, computer) => {
    if (player === computer) {
      return 'Égalité !';
    } else if (
      (player === 'pierre' && computer === 'ciseaux') ||
      (player === 'feuille' && computer === 'pierre') ||
      (player === 'ciseaux' && computer === 'feuille')
    ) {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      return 'Vous gagnez ! 🎉';
    } else {
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
      return 'L\'ordinateur gagne ! 😢';
    }
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
  };

  return (
    <div className={styles.app}>
      <h1>✊ ✋ ✌️</h1>
      <h2>Pierre - Feuille - Ciseaux</h2>
      
      <div className={styles.scoreBoard}>
        <div className={styles.scorePlayer}>
          <h3>Vous</h3>
          <div className={styles.scoreValue}>{score.player}</div>
        </div>
        <div className={styles.scoreComputer}>
          <h3>Ordinateur</h3>
          <div className={styles.scoreValue}>{score.computer}</div>
        </div>
      </div>
      
      <div className={styles.choices}>
        {choices.map((choice) => (
          <button 
            key={choice.id} 
            onClick={() => handlePlayerChoice(choice.id)}
            className={styles.choiceBtn}
            aria-label={choice.name}
          >
            <span className={styles.emoji}>{choice.emoji}</span>
          </button>
        ))}
      </div>
      
      {playerChoice && computerChoice && (
        <div className={styles.gameResult}>
          <div className={styles.choicesDisplay}>
            <div className={styles.choiceBox}>
              <span className={`${styles.emoji} ${styles.big}`}>{playerChoice.emoji}</span>
              <p>Vous</p>
            </div>
            <div className={styles.vs}>VS</div>
            <div className={styles.choiceBox}>
              <span className={`${styles.emoji} ${styles.big}`}>{computerChoice.emoji}</span>
              <p>Ordinateur</p>
            </div>
          </div>
          
          <div className={`${styles.resultText} ${
            result.includes('gagne') ? (result.includes('Vous') ? styles.win : styles.lose) : ''
          }`}>
            {result}
          </div>
          
          <button onClick={resetGame} className={styles.resetBtn}>
            Rejouer 🔄
          </button>
        </div>
      )}
      
      {gameHistory.length > 0 && (
        <div className={styles.history}>
          <h3>Historique</h3>
          <ul>
            {gameHistory.slice().reverse().map((game, index) => (
              <li key={index}>
                {choices.find(c => c.id === game.player).emoji} vs 
                {choices.find(c => c.id === game.computer).emoji} - 
                {game.result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PierreFeuilleCiseaux;