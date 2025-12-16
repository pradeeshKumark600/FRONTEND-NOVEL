import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Header from '../../components/layout/Header/Header';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import novelService from '../../services/API/novelService';
import styles from './NovelDetailPage.module.scss';

// Import the card images
import thenmozhiCard from '../../assets/images/Novel Card/Thenmozhi Card.jpg';
import swethaCard from '../../assets/images/Novel Card/swetha card.jpg';
import mohanaCard from '../../assets/images/Novel Card/Mohana card.jpg';

// Import episode/chapter images
import thenmozhiChapterImage from '../../assets/images/episodes_card/Thenmozhi_episodes.jpg';
import swethaChapterImage from '../../assets/images/episodes_card/swetha swe episodes.jpg';
import mohanaChapterImage from '../../assets/images/episodes_card/Mohanamozhi episodes.jpg';

// Image mapping - supports both old and new paths
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

// Chapter/Episode image mapping by author
const chapterImageMapByAuthor = {
  'Thenmozhi': thenmozhiChapterImage,
  'Swetha Swe': swethaChapterImage,
  'Mohanaamozhi': mohanaChapterImage
};

const NovelDetailPage = () => {
  const { user } = useAuth();
  const { language: globalLanguage } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayLanguage, setDisplayLanguage] = useState('tamil'); // Local language state

  // Fetch novel and chapters from API
  useEffect(() => {
    const fetchNovelData = async () => {
      try {
        setLoading(true);

        // Fetch novel details
        const novelResponse = await novelService.getNovelById(id);

        // Support both { novel: {...} } and direct novel object
        const novelData = novelResponse.novel || novelResponse;
        setNovel(novelData);

        // Set display language based on novel's language
        if (novelData && novelData.language) {
          setDisplayLanguage(novelData.language); // Use novel's language
        } else {
          setDisplayLanguage('tamil'); // Default to Tamil
        }

        // Fetch chapters
        const chaptersResponse = await novelService.getNovelChapters(id);

        // Support both { chapters: [...] } and direct chapters array
        const chaptersData = Array.isArray(chaptersResponse)
          ? chaptersResponse
          : (chaptersResponse.chapters || []);
        setChapters(chaptersData);

        setError(null);
      } catch (err) {
        setError('Failed to load novel details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNovelData();
    }
  }, [id]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleChapterClick = (chapterId) => {
    setTimeout(() => {
      navigate(`/novel/${id}/chapter/${chapterId}`);
    }, 100);
  };

  const handleContinueReading = () => {
    if (chapters.length > 0) {
      const firstChapterId = chapters[0]._id || chapters[0].id || 1;
      setTimeout(() => {
        navigate(`/novel/${id}/chapter/${firstChapterId}`);
      }, 100);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      await novelService.bookmarkNovel(id);
      alert(displayLanguage === 'tamil' ? 'புக்மார்க் சேர்க்கப்பட்டது' : 'Bookmarked successfully');
    } catch (err) {
      alert(displayLanguage === 'tamil' ? 'பிழை ஏற்பட்டது' : 'Error occurred');
    }
  };

  const handleLike = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      await novelService.likeNovel(id);
      // Update novel stats locally
      if (novel) {
        setNovel(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            likes: (prev.stats?.likes || 0) + 1
          }
        }));
      }
    } catch (err) {
      // Silent fail
    }
  };

  const handleDownloadPDF = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    // Download PDF functionality coming soon
  };

  const handleShare = () => {
    // Share functionality coming soon
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.novelDetailContainer}>
        <Header onLoginClick={handleLoginClick} />
        <div className={styles.loading}>
          <p>{displayLanguage === 'tamil' ? 'ஏற்றுகிறது...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !novel) {
    return (
      <div className={styles.novelDetailContainer}>
        <Header onLoginClick={handleLoginClick} />
        <div className={styles.error}>
          <p>{error || 'Novel not found'}</p>
          <button onClick={() => navigate('/novels')}>
            {displayLanguage === 'tamil' ? 'நாவல்களுக்குத் திரும்பு' : 'Back to Novels'}
          </button>
        </div>
      </div>
    );
  }

  const coverImage = imageMap[novel.coverImage] || thenmozhiCard;
  const chapterImage = chapterImageMapByAuthor[novel.author] || thenmozhiChapterImage;

  // Remove all hardcoded chapter data below this comment
  /* const novelChapters = {
    1: [ // ராட்சசனே எனை வதைப்பதேனடா! - Thenmozhi
      { id: 1, title: 'தேன் 1', date: '05/01/2025', words: 1500 },
      { id: 2, title: 'தேன் 2', date: '06/01/2025', words: 1500 },
      { id: 3, title: 'தேன் 3', date: '07/01/2025', words: 1500 },
      { id: 4, title: 'தேன் 4', date: '08/01/2025', words: 1500 },
      { id: 5, title: 'தேன் 5', date: '09/01/2025', words: 1500 },
      { id: 6, title: 'தேன் 6', date: '10/01/2025', words: 1500 },
      { id: 7, title: 'தேன் 7', date: '11/01/2025', words: 1500 },
      { id: 8, title: 'தேன் 8', date: '12/01/2025', words: 1500 },
      { id: 9, title: 'தேன் 9', date: '13/01/2025', words: 1500 },
      { id: 10, title: 'தேன் 10', date: '14/01/2025', words: 1500 },
      { id: 11, title: 'தேன் 11', date: '15/01/2025', words: 1500 },
      { id: 12, title: 'தேன் 12', date: '16/01/2025', words: 1500 },
      { id: 13, title: 'தேன் 13', date: '17/01/2025', words: 1500 },
      { id: 14, title: 'தேன் 14', date: '18/01/2025', words: 1500 },
      { id: 15, title: 'தேன் 15', date: '19/01/2025', words: 1500 },
      { id: 16, title: 'தேன் 16', date: '20/01/2025', words: 1500 },
      { id: 17, title: 'தேன் 17', date: '21/01/2025', words: 1500 },
      { id: 18, title: 'தேன் 18', date: '22/01/2025', words: 1500 },
      { id: 19, title: 'தேன் 19', date: '23/01/2025', words: 1500 },
      { id: 20, title: 'தேன் 20', date: '24/01/2025', words: 1500 },
      { id: 21, title: 'தேன் 21', date: '25/01/2025', words: 1500 },
      { id: 22, title: 'தேன் 22', date: '26/01/2025', words: 1500 },
      { id: 23, title: 'தேன் 23', date: '27/01/2025', words: 1500 },
      { id: 24, title: 'தேன் 24', date: '28/01/2025', words: 1500 },
      { id: 25, title: 'தேன் 25', date: '29/01/2025', words: 1500 },
      { id: 26, title: 'தேன் 26', date: '30/01/2025', words: 1500 },
      { id: 27, title: 'தேன் 27', date: '31/01/2025', words: 1500 }
    ],
    2: [ // தாலாட்டும் தாழம்பூவே - Swetha Swe
      { id: 1, title: 'அத்தியாயம் 1', date: '05/01/2025', words: 1500 },
      { id: 2, title: 'அத்தியாயம் 2', date: '06/01/2025', words: 1500 },
      { id: 3, title: 'அத்தியாயம் 3', date: '07/01/2025', words: 1500 },
      { id: 4, title: 'அத்தியாயம் 4', date: '08/01/2025', words: 1500 },
      { id: 5, title: 'அத்தியாயம் 5', date: '09/01/2025', words: 1500 },
      { id: 6, title: 'அத்தியாயம் 6', date: '10/01/2025', words: 1500 },
      { id: 7, title: 'அத்தியாயம் 7', date: '11/01/2025', words: 1500 },
      { id: 8, title: 'அத்தியாயம் 8', date: '12/01/2025', words: 1500 },
      { id: 9, title: 'அத்தியாயம் 9', date: '13/01/2025', words: 1500 },
      { id: 10, title: 'அத்தியாயம் 10', date: '14/01/2025', words: 1500 },
      { id: 11, title: 'அத்தியாயம் 11', date: '15/01/2025', words: 1500 },
      { id: 12, title: 'அத்தியாயம் 12', date: '16/01/2025', words: 1500 },
      { id: 13, title: 'அத்தியாயம் 13', date: '17/01/2025', words: 1500 },
      { id: 14, title: 'அத்தியாயம் 14', date: '18/01/2025', words: 1500 },
      { id: 15, title: 'அத்தியாயம் 15', date: '19/01/2025', words: 1500 },
      { id: 16, title: 'அத்தியாயம் 16', date: '20/01/2025', words: 1500 },
      { id: 17, title: 'அத்தியாயம் 17', date: '21/01/2025', words: 1500 },
      { id: 18, title: 'அத்தியாயம் 18', date: '22/01/2025', words: 1500 },
      { id: 19, title: 'அத்தியாயம் 19', date: '23/01/2025', words: 1500 },
      { id: 20, title: 'அத்தியாயம் 20', date: '24/01/2025', words: 1500 },
      { id: 21, title: 'அத்தியாயம் 21', date: '25/01/2025', words: 1500 },
      { id: 22, title: 'அத்தியாயம் 22', date: '26/01/2025', words: 1500 },
      { id: 23, title: 'அத்தியாயம் 23', date: '27/01/2025', words: 1500 },
      { id: 24, title: 'அத்தியாயம் 24', date: '28/01/2025', words: 1500 },
      { id: 25, title: 'அத்தியாயம் 25', date: '29/01/2025', words: 1500 },
      { id: 26, title: 'அத்தியாயம் 26', date: '30/01/2025', words: 1500 },
      { id: 27, title: 'அத்தியாயம் 27', date: '31/01/2025', words: 1500 }
    ],
    3: [ // வந்தத்துணையே! என் வாழ்க்கைத் துணையே! - Mohanaamozhi
      { id: 1, title: 'பாகம் 1', date: '05/01/2025', words: 1500 },
      { id: 2, title: 'பாகம் 2', date: '06/01/2025', words: 1500 },
      { id: 3, title: 'பாகம் 3', date: '07/01/2025', words: 1500 },
      { id: 4, title: 'பாகம் 4', date: '08/01/2025', words: 1500 },
      { id: 5, title: 'பாகம் 5', date: '09/01/2025', words: 1500 },
      { id: 6, title: 'பாகம் 6', date: '10/01/2025', words: 1500 },
      { id: 7, title: 'பாகம் 7', date: '11/01/2025', words: 1500 },
      { id: 8, title: 'பாகம் 8', date: '12/01/2025', words: 1500 },
      { id: 9, title: 'பாகம் 9', date: '13/01/2025', words: 1500 },
      { id: 10, title: 'பாகம் 10', date: '14/01/2025', words: 1500 },
      { id: 11, title: 'பாகம் 11', date: '15/01/2025', words: 1500 },
      { id: 12, title: 'பாகம் 12', date: '16/01/2025', words: 1500 },
      { id: 13, title: 'பாகம் 13', date: '17/01/2025', words: 1500 },
      { id: 14, title: 'பாகம் 14', date: '18/01/2025', words: 1500 },
      { id: 15, title: 'பாகம் 15', date: '19/01/2025', words: 1500 },
      { id: 16, title: 'பாகம் 16', date: '20/01/2025', words: 1500 },
      { id: 17, title: 'பாகம் 17', date: '21/01/2025', words: 1500 },
      { id: 18, title: 'பாகம் 18', date: '22/01/2025', words: 1500 },
      { id: 19, title: 'பாகம் 19', date: '23/01/2025', words: 1500 },
      { id: 20, title: 'பாகம் 20', date: '24/01/2025', words: 1500 },
      { id: 21, title: 'பாகம் 21', date: '25/01/2025', words: 1500 },
      { id: 22, title: 'பாகம் 22', date: '26/01/2025', words: 1500 },
      { id: 23, title: 'பாகம் 23', date: '27/01/2025', words: 1500 },
      { id: 24, title: 'பாகம் 24', date: '28/01/2025', words: 1500 },
      { id: 25, title: 'பாகம் 25', date: '29/01/2025', words: 1500 },
      { id: 26, title: 'பாகம் 26', date: '30/01/2025', words: 1500 },
      { id: 27, title: 'பாகம் 27', date: '31/01/2025', words: 1500 }
    ]
  }; */

  return (
    <div className={styles.novelDetailContainer}>
      <Header onLoginClick={handleLoginClick} />

      <div className={styles.content}>
        {/* Novel Header Section */}
        <div className={styles.novelHeader}>
          <div className={styles.imageSection}>
            <img src={coverImage} alt={novel.title} className={styles.novelImage} />
          </div>

          <div className={styles.infoSection}>
            {/* Title */}
            <h1 className={styles.novelTitle}>{novel.title}</h1>

            {/* Author */}
            <div className={styles.authorSection}>
              <span className={styles.author}>{novel.author}</span>
            </div>

            {/* Genres/Tags */}
            <div className={styles.genres}>
              <span className={styles.genreTag}>{novel.genre}</span>
              {novel.tags?.slice(0, 3).map((tag, index) => (
                <span key={index} className={styles.genreTag}>{tag}</span>
              ))}
            </div>

            {/* Stats */}
            <div className={styles.novelStats}>
              <span>👁️ {novel.stats?.views || 0}</span>
              <span>❤️ {novel.stats?.likes || 0}</span>
              <span>🔖 {novel.stats?.bookmarks || 0}</span>
              <span>📖 {novel.totalChapters} {displayLanguage === 'tamil' ? 'அத்தியாயங்கள்' : 'Chapters'}</span>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.readButton} onClick={handleContinueReading}>
                {displayLanguage === 'tamil' ? 'படிக்கத் தொடங்கு' : 'Start Reading'}
              </button>
              <button className={styles.bookmarkButton} onClick={handleBookmark}>
                🔖 {displayLanguage === 'tamil' ? 'புக்மார்க்' : 'Bookmark'}
              </button>
              <button className={styles.likeButton} onClick={handleLike}>
                ❤️ {displayLanguage === 'tamil' ? 'விரும்பு' : 'Like'}
              </button>
            </div>
          </div>
        </div>

        {/* Story Summary Section */}
        <div className={styles.storySection}>
          <h2 className={styles.sectionTitle}>
            {displayLanguage === 'tamil' ? 'கதை சுருக்கம்' : 'Story Summary'}
          </h2>
          <div className={styles.storyContent}>
            <p className={styles.description}>
              {novel.description?.[language] || novel.description?.tamil || ''}
            </p>
          </div>
        </div>

        {/* Chapters Section */}
        <div className={styles.chaptersSection}>
          <h2 className={styles.sectionTitle}>
            {displayLanguage === 'tamil' ? 'அத்தியாயங்கள்' : 'Chapters'} [{chapters.length}]
          </h2>
          <div className={styles.chaptersList}>
            {chapters.map((chapter) => (
              <div
                key={chapter._id}
                className={styles.chapterCard}
                onClick={() => handleChapterClick(chapter._id)}
              >
                <div className={styles.chapterImageWrapper}>
                  <img
                    src={chapterImage}
                    alt={chapter.title?.[language] || chapter.title?.tamil}
                    className={styles.chapterImage}
                  />
                </div>
                <h3 className={styles.chapterTitle}>
                  {chapter.title?.[displayLanguage] || chapter.title?.tamil}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Login Modal */}
      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelDetailPage;
