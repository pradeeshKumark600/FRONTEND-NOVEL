import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useReadingProgress } from '../../context/ReadingProgressContext';
import { translations } from '../../translations';
import Header from '../../components/layout/Header/Header';
import Carousel from '../../components/common/Carousel/Carousel';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import novelService from '../../services/API/novelService';
import styles from './NovelsPage.module.scss';

// Import novel card images
import thenmozhiCard from '../../assets/images/Novel Card/Thenmozhi Card.jpg';
import swethaCard from '../../assets/images/Novel Card/swetha card.jpg';
import mohanaCard from '../../assets/images/Novel Card/Mohana card.jpg';

// Image mapping - supports both old and new image paths
const imageMap = {
  'Novel Card/Thenmozhi Card.jpg': thenmozhiCard,
  'Novel Card/swetha card.jpg': swethaCard,
  'Novel Card/Mohana card.jpg': mohanaCard,
  '/assets/images/Novel Card/Thenmozhi Card.jpg': thenmozhiCard,
  '/assets/images/Novel Card/swetha card.jpg': swethaCard,
  '/assets/images/Novel Card/Mohana card.jpg': mohanaCard,
  '/assets/images/novel-cards/Thenmozhi Card.jpg': thenmozhiCard,
  '/assets/images/novel-cards/swetha card.jpg': swethaCard,
  '/assets/images/novel-cards/Mohana card.jpg': mohanaCard
};

const NovelsPage = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { ongoingNovels, completedNovels, getLastChapter } = useReadingProgress();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = translations[language];

  // Fetch novels from API
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching novels from service...');
        
        const response = await novelService.getAllNovels();
        console.log('Service response:', response);
        
        const novelsList = response.novels || response || [];
        
        if (Array.isArray(novelsList) && novelsList.length > 0) {
          setNovels(novelsList);
          console.log('Loaded', novelsList.length, 'novels');
        } else {
          console.warn('No novels in response');
          setNovels([]);
        }
      } catch (err) {
        console.error('Error fetching novels:', err);
        setError('Unable to load novels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleNovelClick = (novelId) => {
    navigate(`/novel/${novelId}`);
  };

  return (
    <div className={styles.novelsContainer}>
      <Header onLoginClick={handleLoginClick} />
      <Carousel />

      {/* Continue Reading - Novel Grid Section */}
      <div className={styles.continueReadingSection}>
        <h2 className={styles.sectionHeader}>
          Continue Reading
        </h2>
      </div>

      {/* All Novels Grid Section */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            <p>{language === 'tamil' ? 'ஏற்றுகிறது...' : 'Loading...'}</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              {language === 'tamil' ? 'மீண்டும் முயற்சிக்கவும்' : 'Retry'}
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {novels.map(novel => {
              const novelId = novel._id || novel.id; // Support both _id and id
              return (
              <div className={styles.novelCard} key={novelId} onClick={() => handleNovelClick(novelId)}>
                <div className={styles.cardImage}>
                  {novel.coverImage && imageMap[novel.coverImage] ? (
                    <img
                      src={imageMap[novel.coverImage]}
                      alt={novel.title}
                      className={styles.novelImage}
                    />
                  ) : (
                    <span className={styles.placeholder}>Novel Cover</span>
                  )}
                </div>
                <h3 className={styles.novelTitle}>
                  {novel.title}
                </h3>
                <p className={styles.novelAuthor}>by {novel.author}</p>
                <div className={styles.novelStats}>
                  <span>📖 {novel.totalChapters} {language === 'tamil' ? 'அத்தியாயங்கள்' : 'Chapters'}</span>
                  <span>👁️ {novel.stats?.views || novel.views || 0}</span>
                </div>
                <button
                  className={styles.readNowButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNovelClick(novelId);
                  }}
                >
                  {language === 'tamil' ? 'இப்போது படியுங்கள்' : 'READ NOW'}
                </button>
              </div>
            );
            })}
          </div>
        )}
      </div>

      {/* Ongoing Novels Section */}
      {ongoingNovels.length > 0 && (
        <div className={styles.continueReadingSection}>
          <h2 className={styles.sectionHeader}>
            📖 ON-GOING
          </h2>
          <div className={styles.content}>
            <div className={styles.grid}>
              {ongoingNovels.map(novel => (
                <div
                  className={styles.novelCard}
                  key={novel.novelId}
                  onClick={() => navigate(`/novel/${novel.novelId}/chapter/${novel.lastChapter}`)}
                >
                  <div className={styles.cardImage}>
                    {novel.coverImage && imageMap[novel.coverImage] ? (
                      <img
                        src={imageMap[novel.coverImage]}
                        alt={novel.novelTitle}
                        className={styles.novelImage}
                      />
                    ) : (
                      <span className={styles.placeholder}>Novel Cover</span>
                    )}
                  </div>
                  <h3 className={styles.novelTitle}>{novel.novelTitle}</h3>
                  <p className={styles.novelAuthor}>by {novel.author}</p>
                  <div className={styles.novelStats}>
                    <span>📖 Chapter {novel.lastChapter}</span>
                  </div>
                  <button
                    className={styles.readNowButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/novel/${novel.novelId}/chapter/${novel.lastChapter}`);
                    }}
                  >
                    Continue Reading
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completed Novels Section */}
      {completedNovels.length > 0 && (
        <div className={styles.continueReadingSection}>
          <h2 className={styles.sectionHeader}>
            ✅ COMPLETED
          </h2>
          <div className={styles.content}>
            <div className={styles.grid}>
              {completedNovels.map(novel => (
                <div
                  className={styles.novelCard}
                  key={novel.novelId}
                  onClick={() => navigate(`/novel/${novel.novelId}`)}
                >
                  <div className={styles.cardImage}>
                    {novel.coverImage && imageMap[novel.coverImage] ? (
                      <img
                        src={imageMap[novel.coverImage]}
                        alt={novel.novelTitle}
                        className={styles.novelImage}
                      />
                    ) : (
                      <span className={styles.placeholder}>Novel Cover</span>
                    )}
                  </div>
                  <h3 className={styles.novelTitle}>{novel.novelTitle}</h3>
                  <p className={styles.novelAuthor}>by {novel.author}</p>
                  <div className={styles.novelStats}>
                    <span>✓ Completed</span>
                  </div>
                  <button
                    className={styles.readNowButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/novel/${novel.novelId}`);
                    }}
                  >
                    Read Again
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Login Modal */}
      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelsPage;
