const fs = require('fs');
const path = require('path');

// Read the current English novel file
const novelFilePath = './src/utils/chapters/english/novel-2.js';
let novelContent = fs.readFileSync(novelFilePath, 'utf8');

// Chapters to add
const chaptersToAdd = [21, 22, 23, 24, 25, 26, 27];

console.log('📖 Adding translated chapters to English novel file...\n');

// Prepare the new chapters content
let newChaptersContent = '';

chaptersToAdd.forEach((chapterNum) => {
  try {
    const translatedFile = `./translations/chapter-${chapterNum}-english.json`;
    const chapterData = JSON.parse(fs.readFileSync(translatedFile, 'utf8'));

    // Escape backticks in content for template literal
    const escapedContent = chapterData.content
      .replace(/\\/g, '\\\\')  // Escape backslashes
      .replace(/`/g, '\\`')    // Escape backticks
      .replace(/\$/g, '\\$');  // Escape dollar signs

    const chapterEntry = `,
  "${chapterNum}": {
    title: "${chapterData.title}",
    subtitle: "${chapterData.subtitle}",
    content: \`${escapedContent}\`
  }`;

    newChaptersContent += chapterEntry;
    console.log(`✅ Chapter ${chapterNum} prepared (${chapterData.content.length} characters)`);
  } catch (error) {
    console.error(`❌ Error reading chapter ${chapterNum}:`, error.message);
  }
});

// Find the closing brace of the CHAPTERS object and insert before it
const closingBraceIndex = novelContent.lastIndexOf('};');
if (closingBraceIndex === -1) {
  console.error('❌ Could not find closing brace of CHAPTERS object');
  process.exit(1);
}

// Insert the new chapters before the closing brace
const updatedContent =
  novelContent.substring(0, closingBraceIndex) +
  newChaptersContent + '\n' +
  novelContent.substring(closingBraceIndex);

// Write the updated content back to the file
fs.writeFileSync(novelFilePath, updatedContent, 'utf8');

console.log('\n✨ All chapters added successfully!');
console.log(`📝 Updated file: ${novelFilePath}`);
