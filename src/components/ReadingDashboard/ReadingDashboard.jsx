import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import readingProgressService from '../../services/API/readingProgressService';
import styles from './ReadingDashboard.module.scss';

const ReadingDashboard = () => {
  const navigate = useNavigate();
  const [ongoingNovels, setOngoingNovels] = useState([]);
  const [completedNovels, setCompletedNovels] = useState([]);
  const [stats, setStats] = useState({
    totalNovels: 0,
    startedNovels: 0,
    completedNovels: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadingProgress();
  }, []);

  const fetchReadingProgress = async () => {
    try {
      setLoading(true);
      const progress = await readingProgressService.getReadingProgress();
      
      if (progress && Array.isArray(progress)) {
        const ongoing = progress.filter(p => !p.isCompleted);
        const completed = progress.filter(p => p.isCompleted);

        setOngoingNovels(ongoing);
        setCompletedNovels(completed);
        setStats({
          totalNovels: progress.length,
          startedNovels: ongoing.length,
          completedNovels: completed.length
        });
      }
    } catch (error) {
      // Silent fail - show empty dashboard
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (lastChapter, totalChapters = 27) => {
    return Math.round((lastChapter / totalChapters) * 100);
  };

  const handleContinueReading = (novel) => {
    navigate(`/novel/${novel.novelId}/chapter/${novel.lastChapter}`);
  };

  const handleViewNovel = (novelId) => {
    navigate(`/novel/${novelId}`);
  };

  if (loading) {
    return <div className={styles.loading}>Loading your reading progress...</div>;
  }

  return (
    <div className={styles.dashboard}>
      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.totalNovels}</div>
          <div className={styles.statLabel}>Total Novels</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.startedNovels}</div>
          <div className={styles.statLabel}>Started</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.completedNovels}</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
      </div>

      {/* On-Going Novels */}
      {ongoingNovels.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📖 ON-GOING</h2>
          <div className={styles.novelsGrid}>
            {ongoingNovels.map((novel) => {
              const progress = calculateProgress(novel.lastChapter);
              return (
                <div key={novel.novelId} className={styles.novelCard}>
                  <div className={styles.imageContainer}>
                    <img
                      src={novel.coverImage}
                      alt={novel.novelTitle}
                      className={styles.novelImage}
                      onError={(e) => {
                        e.target.src = '/assets/images/placeholder.jpg';
                      }}
                    />
                    <div className={styles.overlay}>
                      <button
                        className={styles.continueBtn}
                        onClick={() => handleContinueReading(novel)}
                      >
                        Continue Reading
                      </button>
                    </div>
                  </div>

                  <div className={styles.cardContent}>
                    <h3 className={styles.novelTitle}>{novel.novelTitle}</h3>
                    <p className={styles.author}>{novel.author}</p>

                    {/* Progress Bar */}
                    <div className={styles.progressSection}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className={styles.progressText}>
                        Chapter {novel.lastChapter} / 27 ({progress}%)
                      </span>
                    </div>

                    {/* Start Date */}
                    {novel.startedAt && (
                      <p className={styles.date}>
                        Started: {new Date(novel.startedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Novels */}
      {completedNovels.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>✅ COMPLETED</h2>
          <div className={styles.novelsGrid}>
            {completedNovels.map((novel) => (
              <div key={novel.novelId} className={styles.novelCard}>
                <div className={styles.imageContainer}>
                  <img
                    src={novel.coverImage}
                    alt={novel.novelTitle}
                    className={styles.novelImage}
                    onError={(e) => {
                      e.target.src = '/assets/images/placeholder.jpg';
                    }}
                  />
                  <div className={styles.overlay}>
                    <button
                      className={styles.rereadBtn}
                      onClick={() => handleViewNovel(novel.novelId)}
                    >
                      Re-read
                    </button>
                  </div>
                  <div className={styles.completedBadge}>✓ COMPLETED</div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.novelTitle}>{novel.novelTitle}</h3>
                  <p className={styles.author}>{novel.author}</p>

                  {/* Completion Dates */}
                  <div className={styles.completionDates}>
                    {novel.startedAt && (
                      <p className={styles.date}>
                        Started: {new Date(novel.startedAt).toLocaleDateString()}
                      </p>
                    )}
                    {novel.completedAt && (
                      <p className={styles.date}>
                        Completed: {new Date(novel.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Total Chapters */}
                  <p className={styles.stats}>📖 {novel.lastChapter} Chapters Read</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {ongoingNovels.length === 0 && completedNovels.length === 0 && (
        <div className={styles.emptyState}>
          <p>📚 Start reading novels to track your progress!</p>
          <button
            className={styles.browseBtn}
            onClick={() => navigate('/novels')}
          >
            Browse Novels
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadingDashboard;
