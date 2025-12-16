import { useState } from 'react';
import { useImageCarousel } from '../../hooks/useImageCarousel';
import { CAROUSEL_SETTINGS } from '../../utils/constants';
import Button from '../../components/common/Button/Button';
import YouTubeModal from '../../components/common/Modal/YouTubeModal';
import { ImageCarousel, WelcomeText, SocialIcons, StarsBackground } from './components';
import styles from './HomePage.module.scss';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations';

const HomePage = () => {
  const [mainSlide, setMainSlide] = useState(0);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const navigate = useNavigate(); 
  const { language } = useLanguage();
  const t = translations[language];

  // Get carousel images
  const carouselImages = [1, 2, 3, 4, 5]; // Array length for hook
  const activeImageIndex = useImageCarousel(carouselImages, CAROUSEL_SETTINGS.AUTO_ROTATE_INTERVAL);

  const handleYouTubeClick = (e) => {
    e.preventDefault();
    setShowYouTubeModal(true);
  };

  return (
    <div className={styles.heroContainer}>
      {/* SLIDE 1: Image Carousel with Ken Burns Effect */}
      <div className={`${styles.mainSlide} ${mainSlide === 0 ? styles.active : ''}`}>
        {/* Carousel Hero Section */}
        <div className={styles.carouselSection}>
          <ImageCarousel activeImageIndex={activeImageIndex} />

          {/* Dark overlay */}
          <div className={styles.overlay} />

          {/* Center Quote */}
          <div className={styles.quoteContainer}>
            <h1 className={styles.quoteText}>
              தேன்தமிழமுது தேடிப்படி
              <br />
              அள்ளி அள்ளி பருக
              <br />
              ஆசை பெருகுமே!!
            </h1>
          </div>
        </div>

        {/* 3D Read Now Button */}
        <Button
        className={styles.heroButton}
          onClick={() => navigate('/novels')}>
            READ NOW
        </Button>

        {/* WELCOME text with letter-by-letter dripping animation */}
        <WelcomeText />
      </div>

      {/* SLIDE 2: Stars Animation with Footer Content */}
      <div className={`${styles.mainSlide} ${mainSlide === 1 ? styles.active : ''}`}>
        <StarsBackground />
        <SocialIcons onYouTubeClick={handleYouTubeClick} />
      </div>

      {/* YouTube Modal */}
      <YouTubeModal isOpen={showYouTubeModal} onClose={() => setShowYouTubeModal(false)} />
    </div>
  );
};

export default HomePage;
