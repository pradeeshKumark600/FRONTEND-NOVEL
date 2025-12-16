// Script to split monolithic chapter files into individual chapter files
// This helps with code splitting and maintainability

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Split chapters for a given novel and language
 * @param {string} sourceFile - Path to the source chapter file
 * @param {string} targetDir - Directory to write individual chapter files
 * @param {number} novelId - The novel ID
 * @param {string} language - The language (tamil or english)
 * @param {string} novelTitle - The novel title for comments
 */
async function splitChapters(sourceFile, targetDir, novelId, language, novelTitle) {
  console.log(`\nProcessing ${sourceFile}...`);

  try {
    // Import the chapter data dynamically
    const sourceUrl = `file:///${sourceFile.replace(/\\/g, '/')}`;
    const { CHAPTERS } = await import(sourceUrl);

    if (!CHAPTERS) {
      console.error(`Could not find CHAPTERS export in ${sourceFile}`);
      return;
    }

    const chapterIds = Object.keys(CHAPTERS);
    console.log(`Found ${chapterIds.length} chapters`);

    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Process each chapter
    for (const chapterId of chapterIds) {
      const chapter = CHAPTERS[chapterId];

      // Extract chapter data
      const title = chapter.title || `Chapter ${chapterId}`;
      const subtitle = chapter.subtitle || '';
      const content = chapter.content || '';

      // Escape backticks in content for template literal
      const escapedContent = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');

      // Create individual chapter file
      const fileContent = `// Chapter ${chapterId} - ${novelTitle}
// ${language.charAt(0).toUpperCase() + language.slice(1)} version

export const CHAPTER = {
  id: ${chapterId},
  title: "${title}",
  subtitle: "${subtitle}",
  content: \`${escapedContent}\`,
  metadata: {
    language: "${language}",
    novelId: ${novelId}
  }
};

export default CHAPTER;
`;

      // Write the file
      const outputPath = path.join(targetDir, `chapter-${chapterId}.js`);
      fs.writeFileSync(outputPath, fileContent, 'utf-8');
      console.log(`✓ Created chapter-${chapterId}.js (${title})`);
    }

    console.log(`\n✅ Completed splitting ${chapterIds.length} chapters for ${language}`);
  } catch (error) {
    console.error(`Error processing ${sourceFile}:`, error.message);
  }
}

// Main execution
async function main() {
  const projectRoot = path.join(__dirname, '..');

  console.log('Starting chapter splitting process...\n');

  // Split Novel 2 Tamil chapters
  await splitChapters(
    path.join(projectRoot, 'src/utils/chapters/novel-2.js'),
    path.join(projectRoot, 'src/chapters/thaalaattum-novel/tamil'),
    2,
    'tamil',
    'தாலாட்டும் தாழம்பூவே'
  );

  // Split Novel 2 English chapters
  await splitChapters(
    path.join(projectRoot, 'src/utils/chapters/english/novel-2.js'),
    path.join(projectRoot, 'src/chapters/thaalaattum-novel/english'),
    2,
    'english',
    'The Lullaby of the Temple Flower'
  );

  console.log('\n✅ Chapter splitting completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Verify the generated chapter files');
  console.log('2. Update chapterContentLoader.js to use the new structure (already done)');
  console.log('3. Test chapter loading in the application');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
