import styles from './StatCard.module.scss';

/**
 * StatCard Component
 *
 * Reusable card for displaying dashboard statistics
 *
 * Props:
 * - title: Card title (e.g., "Total Novels")
 * - value: Statistic value (e.g., 42)
 * - icon: Emoji or icon character
 * - color: Theme color ('blue', 'green', 'purple', 'orange')
 * - trend: Optional trend indicator (e.g., "+12%")
 */

const StatCard = ({ title, value, icon, color = 'blue', trend }) => {
  const colorClasses = {
    blue: styles.blue,
    green: styles.green,
    purple: styles.purple,
    orange: styles.orange
  };

  return (
    <div className={`${styles.statCard} ${colorClasses[color]}`}>
      <div className={styles.iconContainer}>
        <span className={styles.icon}>{icon}</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.valueRow}>
          <p className={styles.value}>{value?.toLocaleString() || '0'}</p>
          {trend && (
            <span className={`${styles.trend} ${trend.startsWith('+') ? styles.positive : styles.negative}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
