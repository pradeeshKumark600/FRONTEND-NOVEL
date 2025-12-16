import styles from './WelcomeText.module.scss';

const WelcomeText = () => {
  const letters = ['W', 'E', 'L', 'C', 'O', 'M', 'E'];
  const letterClasses = [
    styles.letterW,   // W → Drip Stretch Down
    styles.letterE1,  // E → Liquid Drop Movement
    styles.letterL,   // L → Melting Pull-down
    styles.letterC,   // C → Dripping Slide
    styles.letterO,   // O → Bottom Drip Expansion
    styles.letterM,   // M → Wobble + Drip Stretch
    styles.letterE2   // E → Soft Melt + Downward Trail
  ];

  return (
    <div className={styles.welcomeText}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className={`${styles.drippingLetter} ${letterClasses[index]}`}
          style={{ animationDelay: `${index * 0.5}s` }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

export default WelcomeText;
