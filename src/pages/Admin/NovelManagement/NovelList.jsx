import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllNovelsAdmin, deleteNovel } from '../../../services/API/adminMockService';
import DataTable from '../../../components/admin/DataTable/DataTable';
import styles from './NovelManagement.module.scss';

/**
 * NovelList Component
 *
 * Displays a table of all novels with:
 * - Search functionality
 * - Status filter
 * - Edit/Delete actions
 * - Create new novel button
 *
 * INTEGRATION POINTS:
 * - Replace getAllNovelsAdmin() with real API endpoint
 * - Replace deleteNovel() with real API endpoint
 * - Implement pagination when backend supports it
 */

const NovelList = () => {
  const navigate = useNavigate();
  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchNovels();
  }, [searchQuery, statusFilter]);

  const fetchNovels = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with real API call
      const response = await getAllNovelsAdmin({
        search: searchQuery,
        status: statusFilter
      });

      if (response.success) {
        setNovels(response.data.novels);
      } else {
        setError('Failed to load novels');
      }
    } catch (err) {
      console.error('Fetch novels error:', err);
      setError('An error occurred while loading novels');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (novel) => {
    navigate(`/admin/novels/edit/${novel.id}`);
  };

  const handleDelete = async (novel) => {
    // Confirm before deleting
    if (!window.confirm(`Are you sure you want to delete "${novel.title}"?`)) {
      return;
    }

    try {
      // TODO: Replace with real API call
      const response = await deleteNovel(novel.id);

      if (response.success) {
        // Refresh the list
        fetchNovels();
        alert('Novel deleted successfully');
      } else {
        alert('Failed to delete novel');
      }
    } catch (err) {
      console.error('Delete novel error:', err);
      alert('An error occurred while deleting the novel');
    }
  };

  const handleViewChapters = (novel) => {
    navigate(`/admin/chapters?novelId=${novel.id}`);
  };

  // Table columns definition
  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value) => <span className={styles.novelTitle}>{value}</span>
    },
    {
      key: 'author_name',
      label: 'Author'
    },
    {
      key: 'categories',
      label: 'Categories',
      render: (value) => (
        <div className={styles.categories}>
          {value?.slice(0, 2).map((cat, index) => (
            <span key={index} className={styles.categoryBadge}>
              {cat}
            </span>
          ))}
          {value?.length > 2 && (
            <span className={styles.categoryBadge}>+{value.length - 2}</span>
          )}
        </div>
      )
    },
    {
      key: 'total_chapters',
      label: 'Chapters',
      render: (value) => <span className={styles.chapterCount}>{value || 0}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`${styles.statusBadge} ${styles[value?.toLowerCase()]}`}>
          {value}
        </span>
      )
    },
    {
      key: 'updated_at',
      label: 'Last Updated',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading novels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Novel Management</h1>
          <p className={styles.subtitle}>
            Manage all novels in the platform
          </p>
        </div>
        <button
          className={styles.createButton}
          onClick={() => navigate('/admin/novels/create')}
        >
          <span className={styles.buttonIcon}>➕</span>
          <span>Create Novel</span>
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search novels by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Archived">Archived</option>
        </select>

        <button
          className={styles.refreshButton}
          onClick={fetchNovels}
          title="Refresh"
        >
          🔄
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className={styles.errorBanner}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
          <button onClick={fetchNovels} className={styles.retryLink}>
            Retry
          </button>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={novels}
        emptyMessage="No novels found. Create your first novel to get started!"
        actions={(novel) => (
          <>
            <button
              className={`${styles.actionButton} ${styles.view}`}
              onClick={() => handleViewChapters(novel)}
              title="View Chapters"
            >
              📖
            </button>
            <button
              className={`${styles.actionButton} ${styles.edit}`}
              onClick={() => handleEdit(novel)}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className={`${styles.actionButton} ${styles.delete}`}
              onClick={() => handleDelete(novel)}
              title="Delete"
            >
              🗑️
            </button>
          </>
        )}
      />

      {/* Results count */}
      {novels.length > 0 && (
        <div className={styles.footer}>
          <p className={styles.resultsCount}>
            Showing {novels.length} {novels.length === 1 ? 'novel' : 'novels'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NovelList;
