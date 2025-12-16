const translate = require('google-translate-api-x');
const fs = require('fs');
const path = require('path');

// Configuration
const CHAPTERS_TO_TRANSLATE = [21, 22, 23, 24, 25, 26, 27];
const SOURCE_LANG = 'ta'; // Tamil
const TARGET_LANG = 'en'; // English
const OUTPUT_DIR = './translations';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Translate text from Tamil to English
 * @param {string} text - The text to translate
 * @returns {Promise<string>} - Translated text
 */
async function translateText(text) {
  try {
    const result = await translate(text, {
      from: SOURCE_LANG,
      to: TARGET_LANG,
    });
    return result.text;
  } catch (error) {
    console.error('Translation error:', error.message);
    throw error;
  }
}

/**
 * Split text into chunks for better translation quality
 * @param {string} text - The text to split
 * @param {number} maxChunkSize - Maximum characters per chunk
 * @returns {string[]} - Array of text chunks
 */
function splitIntoChunks(text, maxChunkSize = 4500) {
  const chunks = [];
  let currentChunk = '';

  const paragraphs = text.split('\n\n');

  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      if (paragraph.length > maxChunkSize) {
        const sentences = paragraph.split('।').filter(s => s.trim());
        for (const sentence of sentences) {
          if ((currentChunk + sentence).length > maxChunkSize) {
            if (currentChunk) {
              chunks.push(currentChunk.trim());
              currentChunk = '';
            }
          }
          currentChunk += sentence + '। ';
        }
      } else {
        currentChunk = paragraph;
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Get chapter content from the existing chapter files
 * @param {number} chapterNum - Chapter number
 * @returns {Promise<object>} - Chapter data with title, subtitle, and content
 */
async function getChapterContent(chapterNum) {
  try {
    const filePath = `./chapter-${chapterNum}-tamil.json`;
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return null;
    }

    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading chapter ${chapterNum}:`, error.message);
    return null;
  }
}

/**
 * Translate a chapter
 * @param {number} chapterNum - Chapter number to translate
 */
async function translateChapter(chapterNum) {
  console.log(`\n📖 Translating Chapter ${chapterNum}...`);

  const chapterData = await getChapterContent(chapterNum);
  if (!chapterData) {
    console.error(`Could not read chapter ${chapterNum}`);
    return;
  }

  try {
    // Translate title
    console.log('   Translating title...');
    const titleTranslated = await translateText(chapterData.title);

    // Translate subtitle
    console.log('   Translating subtitle...');
    const subtitleTranslated = await translateText(chapterData.subtitle);

    // Split content into chunks and translate
    console.log('   Translating content (this may take a moment)...');
    const contentChunks = splitIntoChunks(chapterData.content);
    const translatedChunks = [];

    for (let i = 0; i < contentChunks.length; i++) {
      console.log(`   - Processing chunk ${i + 1}/${contentChunks.length}...`);
      try {
        const translatedChunk = await translateText(contentChunks[i]);
        translatedChunks.push(translatedChunk);
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`   Error translating chunk ${i + 1}:`, error.message);
        translatedChunks.push(contentChunks[i]); // Keep original if translation fails
      }
    }

    const contentTranslated = translatedChunks.join('\n\n');

    // Create output structure
    const translatedData = {
      title: titleTranslated,
      subtitle: subtitleTranslated,
      content: contentTranslated,
      metadata: {
        originalLanguage: 'Tamil',
        translatedLanguage: 'English',
        chapterNumber: chapterNum,
        translationDate: new Date().toISOString(),
        translationTool: 'Google Translate API'
      }
    };

    // Save translated chapter
    const outputPath = path.join(OUTPUT_DIR, `chapter-${chapterNum}-english.json`);
    fs.writeFileSync(outputPath, JSON.stringify(translatedData, null, 2), 'utf8');

    console.log(`✅ Chapter ${chapterNum} translated successfully!`);
    console.log(`   Saved to: ${outputPath}`);
    console.log(`   - Title: ${titleTranslated.substring(0, 50)}...`);
    console.log(`   - Content length: ${contentTranslated.length} characters`);

  } catch (error) {
    console.error(`❌ Error translating chapter ${chapterNum}:`, error.message);
  }
}

/**
 * Main translation function
 */
async function main() {
  console.log('🚀 Starting Tamil to English Translation...');
  console.log(`📚 Chapters to translate: ${CHAPTERS_TO_TRANSLATE.join(', ')}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  for (const chapterNum of CHAPTERS_TO_TRANSLATE) {
    await translateChapter(chapterNum);
  }

  console.log('\n✨ Translation completed!');
  console.log(`📂 All translated files are in the "${OUTPUT_DIR}" folder`);
}

// Run the translation
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
