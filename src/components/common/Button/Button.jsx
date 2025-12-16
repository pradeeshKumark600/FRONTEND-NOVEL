import styles from './ReadNowButton.module.scss';

const Button = ({ children, onClick, className = '', type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.readNowButton} ${className}`}
    >
      <span className={styles.buttonText}>{children}</span>
    </button>
  );
};

export default Button;
