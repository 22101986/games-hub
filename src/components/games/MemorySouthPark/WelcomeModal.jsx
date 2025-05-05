import styles from './MemorySouthPark.module.css';

const WelcomeModal = ({ onClose }) => {
  return (
    <div className={styles.welcomeModalOverlay}>
      <div className={styles.welcomeModal}>
        <h2 className={styles.police}>The South-Park Memory Game!!!</h2>
        <p>
          Bienvenue dans le Colorado pour une partie de mémory pas comme les autres!!! 
          Serez-vous à la hauteur???
        </p>
        <button onClick={onClose} className={styles.btnDanger}>
          Lancer la partie
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;