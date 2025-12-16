import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createChapter, getAllNovelsAdmin, CHAPTER_TYPES, CHAPTER_STATUS } from '../../../services/API/adminMockService';
import styles from '../NovelManagement/NovelManagement.module.scss';

const ChapterCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const novelIdParam = searchParams.get('novelId');

  const [novels, setNovels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    novel_id: novelIdParam || '',
    chapter_number: 1,
    name: '',
    title: '',
    chapter_type: 'Regular',
    thumbnail: '',
    content: '',
    status: 'Draft'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchNovels();
  }, []);

  const fetchNovels = async () => {
    try {
      const response = await getAllNovelsAdmin();
      if (response.success) setNovels(response.data.novels);
    } catch (err) {
      console.error('Fetch novels error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.novel_id) newErrors.novel_id = 'Select a novel';
    if (!formData.chapter_number) newErrors.chapter_number = 'Chapter number required';
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (!formData.title.trim()) newErrors.title = 'Title required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await createChapter(formData.novel_id, formData);
      if (response.success) {
        alert('Chapter created!');
        navigate(`/admin/chapters?novelId=${formData.novel_id}`);
      } else {
        alert('Failed to create chapter');
      }
    } catch (err) {
      console.error('Create error:', err);
      alert('Error creating chapter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Create New Chapter</h1>
          <p className={styles.subtitle}>Add a new chapter to a novel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formCard}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Novel <span className={styles.required}>*</span>
              </label>
              <select name="novel_id" value={formData.novel_id} onChange={handleChange} className={styles.select}>
                <option value="">Select novel...</option>
                {novels.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
              </select>
              {errors.novel_id && <p className={styles.errorText}>{errors.novel_id}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Chapter Number <span className={styles.required}>*</span>
              </label>
              <input type="number" name="chapter_number" value={formData.chapter_number} onChange={handleChange} className={styles.input} min="1" />
              {errors.chapter_number && <p className={styles.errorText}>{errors.chapter_number}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Name <span className={styles.required}>*</span>
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., முதல் அத்தியாயம்" className={styles.input} />
              {errors.name && <p className={styles.errorText}>{errors.name}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Title <span className={styles.required}>*</span>
              </label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., வெள்ளம்" className={styles.input} />
              {errors.title && <p className={styles.errorText}>{errors.title}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Type</label>
              <select name="chapter_type" value={formData.chapter_type} onChange={handleChange} className={styles.select}>
                {CHAPTER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={styles.select}>
                {CHAPTER_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Thumbnail URL</label>
              <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="https://..." className={styles.input} />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Content</label>
              <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Chapter content (rich text placeholder)" className={styles.textarea} rows="10" />
              <p className={styles.helpText}>Note: For production, integrate a rich text editor</p>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={() => navigate('/admin/chapters')} className={styles.cancelButton} disabled={loading}>Cancel</button>
            <button type="submit" className={styles.submitButton} disabled={loading}>{loading ? 'Creating...' : 'Create Chapter'}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChapterCreate;
