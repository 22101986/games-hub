import { useState, useEffect } from 'react';
import Grid from './Grid';
import WordList from './WordList';
import Controls from './Controls';
import styles from './MotsMeles.module.css';

const FRENCH_WORDS = {
  maison: ['MAISON', 'JARDIN', 'CUISINE', 'SALON', 'CHAMBRE', 'TOITURE', 'ESCALIER', 'GARAGE', 'FENETRE', 'PORTE', 'MUR', 'PLAFOND', 'CARREAUX', 'CHEMINEE', 'TERRASSE', 'BALCON', 'DOUCHE', 'BAIGNOIRE', 'LAVABO', 'CANAPE'],
  nature: ['ARBRE', 'FLEUR', 'RIVIERE', 'MONTAGNE', 'FORET', 'HERBE', 'SABLE', 'NUAGE', 'PLUIE', 'VENT', 'SOLEIL', 'LUNE', 'ETOILE', 'OCEAN', 'LAC', 'ROCHER', 'CAILLOU', 'ORAGE', 'TONNERRE', 'ECLAIR'],
  animaux: ['CHAT', 'CHIEN', 'OISEAU', 'POISSON', 'LAPIN', 'SERPENT', 'TORTUE', 'SOURIS', 'ELEPHANT', 'LION', 'TIGRE', 'GIRAFE', 'SINGE', 'CHEVAL', 'VACHE', 'COCHON', 'MOUTON', 'POULE', 'COQ', 'CANARD'],
  nourriture: ['PAIN', 'FROMAGE', 'FRUIT', 'LEGUME', 'VIANDE', 'POISSON', 'LAIT', 'OEUF', 'RIZ', 'PATE', 'SOUPE', 'SALADE', 'DESSERT', 'GATEAU', 'CHOCOLAT', 'GLACE', 'CAFE', 'THE', 'BIERE', 'VIN'],
  corps: ['MAIN', 'PIED', 'TETE', 'BRAS', 'JAMBE', 'DOIGT', 'OREILLE', 'NEZ', 'BOUCHE', 'DENT', 'LANGUE', 'CHEVEUX', 'YEUX', 'COU', 'EPAULE', 'VENTRE', 'DOS', 'GENOU', 'COUDE', 'POITRINE'],
  villes: ['PARIS', 'LYON', 'MARSEILLE', 'TOULOUSE', 'NICE', 'NANTES', 'STRASBOURG', 'MONTPELLIER', 'BORDEAUX', 'LILLE', 'RENNES', 'REIMS', 'LEHAVRE', 'SAINTETIENNE', 'TOULON', 'GRENOBLE', 'DIJON', 'ANGERS', 'VILLENEUVE', 'CLERMONT'],
  sports: ['FOOT', 'RUGBY', 'TENNIS', 'GOLF', 'NATATION', 'COURSE', 'BASKET', 'HAND', 'VOLLEY', 'JUDO', 'BOXE', 'CYCLISME', 'SKI', 'PATIN', 'EQUITATION', 'ATHLETISME', 'BADMINTON', 'ESCALADE', 'AVIRON', 'TIR'],
  pays: ['FRANCE', 'ALLEMAGNE', 'ESPAGNE', 'ITALIE', 'ANGLETERRE', 'PORTUGAL', 'SUISSE', 'BELGIQUE', 'CANADA', 'BRESIL', 'ARGENTINE', 'MEXIQUE', 'JAPON', 'CHINE', 'INDE', 'RUSSIA', 'AUTRICHE', 'GRECE', 'EGYPTE', 'MAROC'],
  metiers: ['DOCTEUR', 'INFIRMIER', 'PROFESSEUR', 'POLICIER', 'POMPIER', 'BOULANGER', 'CUISINIER', 'MENUISIER', 'PEINTRE', 'MECANICIEN', 'JARDINIER', 'COIFFEUR', 'BANQUIER', 'VENDEUR', 'CHAUFFEUR', 'PLOMBIER', 'ELECTRICIEN', 'ARCHITECTE', 'AVOCAT', 'JUGE'],
  arts: ['MUSIQUE', 'PEINTURE', 'CINEMA', 'THEATRE', 'DANSE', 'SCULPTURE', 'PHOTO', 'LITTERATURE', 'POESIE', 'OPERA', 'BALLET', 'DESSIN', 'GRAVURE', 'CERAMIQUE', 'ARCHITECTURE', 'CHANT', 'VIOLON', 'PIANO', 'GUITARE', 'HARPE']
};

export default function MotsMelesGame() {
  const [words, setWords] = useState([]);
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [gridSize, setGridSize] = useState(12);
  const [difficulty, setDifficulty] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [wordPositions, setWordPositions] = useState({});
  const [theme, setTheme] = useState('maison');

  const difficultySettings = {
    easy: { wordCount: 12, minLength: 4, maxLength: 6, gridSize: 12 },
    medium: { wordCount: 18, minLength: 5, maxLength: 8, gridSize: 15 },
    hard: { wordCount: 24, minLength: 6, maxLength: 10, gridSize: 20 }
  };

  const generateGrid = (wordList) => {
    const size = difficultySettings[difficulty].gridSize;
    const newGrid = Array(size).fill().map(() => Array(size).fill(''));
    const positions = {};
    const frenchLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    wordList.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 200) {
        attempts++;
        const direction = Math.floor(Math.random() * 8);
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        
        if (canPlaceWord(newGrid, word, row, col, direction)) {
          const wordCells = placeWord(newGrid, word, row, col, direction);
          positions[word] = wordCells;
          placed = true;
        }
      }
    });

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = frenchLetters[Math.floor(Math.random() * frenchLetters.length)];
        }
      }
    }

    setGrid(newGrid);
    setWordPositions(positions);
    setFoundWords([]);
    setSelectedCells([]);
  };

  const canPlaceWord = (grid, word, row, col, direction) => {
    const size = grid.length;
    const dx = [0, 1, 1, 1, 0, -1, -1, -1][direction];
    const dy = [-1, -1, 0, 1, 1, 1, 0, -1][direction];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dy;
      const newCol = col + i * dx;
      
      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size || 
          (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i])) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid, word, row, col, direction) => {
    const dx = [0, 1, 1, 1, 0, -1, -1, -1][direction];
    const dy = [-1, -1, 0, 1, 1, 1, 0, -1][direction];
    const cells = [];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dy;
      const newCol = col + i * dx;
      grid[newRow][newCol] = word[i];
      cells.push({ row: newRow, col: newCol });
    }
    
    return cells;
  };

  const handleCellClick = (row, col) => {
    if (selectedCells.some(cell => cell.row === row && cell.col === col)) return;
    
    const newSelectedCells = [...selectedCells, { row, col }];
    setSelectedCells(newSelectedCells);
    
    if (newSelectedCells.length > 1) {
      checkForWord(newSelectedCells);
    }
  };

  const checkForWord = (cells) => {
    if (!areCellsAligned(cells)) {
      setSelectedCells([]);
      return;
    }
    
    const word = cells.map(cell => grid[cell.row][cell.col]).join('');
    
    if (words.includes(word) && !foundWords.includes(word)) {
      if (isOriginalWordPosition(word, cells)) {
        setFoundWords([...foundWords, word]);
        setSelectedCells([]);
      } else {
        setSelectedCells([]);
      }
    } else if (cells.length >= Math.max(...words.map(w => w.length))) {
      setSelectedCells([]);
    }
  };

  const areCellsAligned = (cells) => {
    if (cells.length < 2) return true;
    
    const deltaRow = cells[1].row - cells[0].row;
    const deltaCol = cells[1].col - cells[0].col;
    
    return cells.every((cell, i) => {
      if (i === 0) return true;
      return cell.row === cells[i-1].row + deltaRow && 
             cell.col === cells[i-1].col + deltaCol;
    });
  };

  const isOriginalWordPosition = (word, cells) => {
    const originalCells = wordPositions[word];
    if (!originalCells || originalCells.length !== cells.length) return false;
    
    const originalDir = {
      row: originalCells[1].row - originalCells[0].row,
      col: originalCells[1].col - originalCells[0].col
    };
    
    const currentDir = {
      row: cells[1].row - cells[0].row,
      col: cells[1].col - cells[0].col
    };
    
    return originalDir.row === currentDir.row && 
           originalDir.col === currentDir.col;
  };

  const startNewGame = () => {
    setIsLoading(true);
    const { wordCount } = difficultySettings[difficulty];
    const themeWords = FRENCH_WORDS[theme] || FRENCH_WORDS.maison;
    const selectedWords = [...themeWords]
      .sort(() => 0.5 - Math.random())
      .slice(0, wordCount)
      .map(word => word.toUpperCase());
    
    setWords(selectedWords);
    generateGrid(selectedWords);
    setIsLoading(false);
  };

  useEffect(() => {
    startNewGame();
  }, [difficulty, theme]);

  return (
    <div className={styles.app}>
      <h1 className='title'>Mots Mêlés</h1>
      <h2 className='title'>Thème: {theme.toUpperCase()}</h2>
      
      <Controls 
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        onNewGame={startNewGame}
      />
      
      <div className={styles.themeSelector}>
        <label>Choisir un thème: </label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          {Object.keys(FRENCH_WORDS).map(themeKey => (
            <option key={themeKey} value={themeKey}>
              {themeKey.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      
      {isLoading ? (
        <div className={styles.loading}>Création de la grille...</div>
      ) : (
        <>
          <div className={styles.gameArea}>
            <Grid 
              grid={grid} 
              selectedCells={selectedCells}
              foundWords={foundWords}
              wordPositions={wordPositions}
              onCellClick={handleCellClick}
            />
            <WordList 
              words={words} 
              foundWords={foundWords} 
            />
          </div>
          <div className={styles.gameStatus}>
            Progression: {foundWords.length}/{words.length} mots trouvés
          </div>
        </>
      )}
    </div>
  );
}