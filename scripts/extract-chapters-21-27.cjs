const fs = require('fs');
const chapters = require('./src/utils/chapters/novel-2.js');

function extractChapters() {
  const chaptersToExtract = [21, 22, 23, 24, 25, 26, 27];

  console.log('📖 Extracting Chapters 21-27 from Novel 2...\n');

  chaptersToExtract.forEach((chapterNum) => {
    const chapterKey = chapterNum.toString();
    const chapterData = chapters.CHAPTERS[chapterKey];

    if (chapterData) {
      const outputData = {
        title: chapterData.title,
        subtitle: chapterData.subtitle,
        content: chapterData.content,
        metadata: {
          chapterNumber: chapterNum,
          language: 'Tamil',
          novel: 'Novel 2 - தாலாட்டும் தாழம்பூவே',
          extractionDate: new Date().toISOString()
        }
      };

      const filename = `chapter-${chapterNum}-tamil.json`;
      fs.writeFileSync(filename, JSON.stringify(outputData, null, 2), 'utf8');
      console.log(`✅ Extracted: ${filename}`);
      console.log(`   Title: ${chapterData.title}`);
      console.log(`   Subtitle: ${chapterData.subtitle}`);
      console.log(`   Content length: ${chapterData.content.length} characters\n`);
    } else {
      console.log(`❌ Chapter ${chapterNum} not found\n`);
    }
  });

  console.log('✨ Extraction complete!');
}

extractChapters();
