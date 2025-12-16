const fs = require('fs');
const chapters = require('./src/utils/chapters/novel-2.js');

/**
 * Extract chapters 10-12 from Novel 2 and save them as JSON files
 */
function extractChapters() {
  const chaptersToExtract = [10, 11, 12];
  
  console.log('📖 Extracting Chapters 10-12 from Novel 2...\n');
  
  chaptersToExtract.forEach((chapterNum) => {
    try {
      const chapter = chapters.CHAPTERS[chapterNum.toString()];
      
      if (!chapter) {
        console.warn(`⚠️  Chapter ${chapterNum} not found`);
        return;
      }

      const chapterData = {
        title: chapter.title || `Chapter ${chapterNum}`,
        subtitle: chapter.subtitle || `Subtitle for Chapter ${chapterNum}`,
        content: chapter.content || '',
        metadata: {
          chapterNumber: chapterNum,
          language: 'Tamil',
          novel: 'Novel 2 - தாலாட்டும் தாழம்பூவே',
          extractionDate: new Date().toISOString()
        }
      };

      const fileName = `chapter-${chapterNum}-tamil.json`;
      fs.writeFileSync(fileName, JSON.stringify(chapterData, null, 2));

      const contentLength = chapter.content ? chapter.content.length : 0;
      console.log(`✅ Chapter ${chapterNum} extracted: ${contentLength} characters`);
      console.log(`   Saved to: ${fileName}\n`);

    } catch (error) {
      console.error(`❌ Error extracting chapter ${chapterNum}:`, error.message);
    }
  });

  console.log('✨ Extraction completed!');
}

// Run extraction
extractChapters();
