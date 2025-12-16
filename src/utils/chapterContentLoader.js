// Dynamic chapter content loader
// This loads chapter content on-demand with backend API fallback to local files

import novelService from '../services/API/novelService';
import { getNovelConfig, isValidChapter } from '../config/novelConfig';

/**
 * Dynamically imports chapter content for a specific novel
 * Tries backend API first, then falls back to local files
 * @param {number} novelId - The novel ID
 * @param {number} chapterId - The chapter ID
 * @param {string} language - The language ('tamil' or 'english')
 * @returns {Promise<Object|null>} - Chapter content or null if not found
 */
export const getChapterContent = async (novelId, chapterId, language = 'tamil') => {
  try {
    const config = getNovelConfig(novelId);

    if (!config) {
      return null;
    }

    // Validate chapter ID
    if (!isValidChapter(novelId, chapterId)) {
      return null;
    }

    // Check if language is supported
    if (!config.languages.includes(language)) {
      language = 'tamil';
    }

    // STEP 1: Try backend API first
    try {
      const apiResponse = await novelService.getChapter(novelId, chapterId, language);
      if (apiResponse && (apiResponse.content || apiResponse.title)) {
        return {
          title: apiResponse.title || `Chapter ${chapterId}`,
          content: apiResponse.content || ''
        };
      }
    } catch (apiError) {
      // Backend API unavailable, fall back to local files
    }

    // STEP 2: Fallback to local files
    let chapterModule;

    // Try new structure first (individual chapter files)
    try {
      const novelFolder = config.name;
      chapterModule = await import(`../chapters/${novelFolder}/${language}/chapter-${chapterId}.js`);

      if (chapterModule && chapterModule.CHAPTER) {
        return chapterModule.CHAPTER;
      }
    } catch (newStructureError) {
      // New structure not found, try old structure

      // Fallback to old structure for backward compatibility
      try {
        let novelModule;

        if (language === 'english') {
          if (novelId === 2) {
            novelModule = await import('./chapters/english/novel-2.js');
          }
        } else {
          // Tamil (default)
          if (novelId === 2) {
            novelModule = await import('./chapters/novel-2.js');
          }
        }

        if (!novelModule) {
          // If English version doesn't exist, fallback to Tamil
          if (language === 'english') {
            if (novelId === 2) {
              novelModule = await import('./chapters/novel-2.js');
            }
          }
        }

        const novel = novelModule?.CHAPTERS;
        if (novel && novel[chapterId]) {
          return novel[chapterId];
        }
      } catch (fallbackError) {
        // Old structure also failed
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Check if a chapter exists
 * @param {number} novelId - The novel ID
 * @param {number} chapterId - The chapter ID
 * @param {string} language - The language
 * @returns {Promise<boolean>} - True if chapter exists
 */
export const chapterExists = async (novelId, chapterId, language = 'tamil') => {
  // First check if chapter ID is in valid range
  if (!isValidChapter(novelId, chapterId)) {
    return false;
  }

  // Then check if content actually exists
  const content = await getChapterContent(novelId, chapterId, language);
  return content !== null;
};
