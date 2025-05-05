import Image from 'next/image';
import styles from './MemorySouthPark.module.css';

const Card = ({ id, content, isFlipped, onClick }) => {
  return (
    <div 
      className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
      onClick={() => onClick(id)}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <Image 
            src="/images/South_Park.png" 
            alt="South Park Logo"
            width={80}
            height={80}
            unoptimized
          />
        </div>
        <div className={styles.cardBack}>
          <Image 
            src={content} 
            alt="South Park Character" 
            width={80}
            height={80}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default Card;