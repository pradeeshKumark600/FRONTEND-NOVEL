const fs = require('fs');
const path = require('path');

// Read the Tamil chapters
const tamilChaptersPath = path.join(__dirname, '..', 'src', 'utils', 'chapters', 'novel-2.js');
const englishChaptersPath = path.join(__dirname, '..', 'src', 'utils', 'chapters', 'english', 'novel-2.js');

console.log('Reading Tamil chapters from:', tamilChaptersPath);
console.log('Reading English chapters from:', englishChaptersPath);

// Read the files
const tamilContent = fs.readFileSync(tamilChaptersPath, 'utf-8');
const englishContent = fs.readFileSync(englishChaptersPath, 'utf-8');

// Extract the CHAPTERS object from Tamil file
const tamilMatch = tamilContent.match(/export const CHAPTERS = (\{[\s\S]*\});/);
const englishMatch = englishContent.match(/export const CHAPTERS = (\{[\s\S]*\});/);

if (!tamilMatch || !englishMatch) {
  console.error('Failed to extract CHAPTERS from files');
  process.exit(1);
}

// Parse the chapters
let tamilChapters, englishChapters;
try {
  // Use eval to parse the object (since it's a JS object, not JSON)
  tamilChapters = eval('(' + tamilMatch[1] + ')');
  englishChapters = eval('(' + englishMatch[1] + ')');
} catch (e) {
  console.error('Failed to parse chapters:', e);
  process.exit(1);
}

// Create combined chapters object
const combinedChapters = {};

// Get all chapter numbers (assuming 1-27)
const chapterNumbers = Object.keys(tamilChapters).sort((a, b) => parseInt(a) - parseInt(b));

console.log(`Found ${chapterNumbers.length} chapters`);

chapterNumbers.forEach(chapterNum => {
  const tamilChapter = tamilChapters[chapterNum];
  const englishChapter = englishChapters[chapterNum];

  if (tamilChapter && englishChapter) {
    combinedChapters[chapterNum] = {
      tamil: {
        title: tamilChapter.title,
        subtitle: tamilChapter.subtitle,
        content: tamilChapter.content
      },
      english: {
        title: englishChapter.title,
        subtitle: englishChapter.subtitle,
        content: englishChapter.content
      }
    };
    console.log(`✓ Combined chapter ${chapterNum}: ${tamilChapter.subtitle}`);
  } else {
    console.warn(`⚠ Missing data for chapter ${chapterNum}`);
  }
});

// Create the output file content
const outputContent = `// Lullaby of Temple Flower - Novel 2
// All 27 chapters in both Tamil and English
// Created on ${new Date().toLocaleDateString()}

export const LULLABY_OF_TEMPLE_FLOWER = {
${Object.keys(combinedChapters).map(chapterNum => {
  const chapter = combinedChapters[chapterNum];
  return `  "${chapterNum}": {
    tamil: {
      title: "${chapter.tamil.title}",
      subtitle: "${chapter.tamil.subtitle}",
      content: \`${chapter.tamil.content}\`
    },
    english: {
      title: "${chapter.english.title}",
      subtitle: "${chapter.english.subtitle}",
      content: \`${chapter.english.content}\`
    }
  }`;
}).join(',\n')}
};

export default LULLABY_OF_TEMPLE_FLOWER;
`;

// Write to output file
const outputPath = path.join(__dirname, '..', 'src', 'utils', 'chapters', 'Lullaby-of-Temple-Flower.js');
fs.writeFileSync(outputPath, outputContent, 'utf-8');

console.log('\n✅ Successfully created: Lullaby-of-Temple-Flower.js');
console.log(`📁 Location: ${outputPath}`);
console.log(`📚 Total chapters: ${Object.keys(combinedChapters).length}`);
