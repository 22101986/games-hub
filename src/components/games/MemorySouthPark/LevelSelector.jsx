import styles from './MemorySouthPark.module.css';

const LevelSelector = ({ onSelectLevel }) => {
  const levels = [
    {
      name: 'Niveau 1',
      description: '6 personnages (12 cartes)',
      pairs: 6,
      cols: 4
    },
    {
      name: 'Niveau 2',
      description: '10 personnages (20 cartes)',
      pairs: 10,
      cols: 5
    }
  ];

  return (
    <div className={styles.levelSelector}>
      <h2 className={styles.police}>Choisissez un niveau de difficulté</h2>
      <div className={styles.levelsContainer}>
        {levels.map((level, index) => (
          <div 
            key={index} 
            className={styles.levelCard}
            onClick={() => onSelectLevel(level)}
          >
            <h3 className={styles.police}>{level.name}</h3>
            <p>{level.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;