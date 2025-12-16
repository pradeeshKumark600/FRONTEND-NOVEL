import { useState, useMemo } from 'react';
import { generateStars } from '../../../../utils/generateStars';
import { CAROUSEL_SETTINGS } from '../../../../utils/constants';
import styles from './StarsBackground.module.scss';

const StarsBackground = () => {
  // Reduce star count on mobile for better performance
  const starCount = useMemo(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 360) return Math.floor(CAROUSEL_SETTINGS.TOTAL_STARS * 0.5); // 50% on ultra-low
      if (width < 480) return Math.floor(CAROUSEL_SETTINGS.TOTAL_STARS * 0.7); // 70% on low-end
      if (width < 768) return Math.floor(CAROUSEL_SETTINGS.TOTAL_STARS * 0.85); // 85% on tablet
      return CAROUSEL_SETTINGS.TOTAL_STARS; // 100% on desktop
    }
    return CAROUSEL_SETTINGS.TOTAL_STARS;
  }, []);

  const [stars] = useState(() => generateStars(starCount));

  return (
    <div className={styles.starsBackground}>
      {stars.map((star) => (
        <div
          key={star.id}
          className={styles.star}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default StarsBackground;
