import styles from './MemorySouthPark.module.css';

const Header = ({ resetGame }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.police}>South Park Memory Game</h1>
    </header>
  );
};

export default Header;