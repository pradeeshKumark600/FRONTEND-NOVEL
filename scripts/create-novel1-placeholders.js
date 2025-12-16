// Script to create placeholder chapter files for Novel 1
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const targetDir = path.join(projectRoot, 'src/chapters/raatchasane-novel/tamil');

// Ensure directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log('Creating placeholder chapters for Novel 1 (ராட்சசனே எனை வதைப்பதேனடா!)...\n');

// Create 27 placeholder chapters
for (let i = 1; i <= 27; i++) {
  const chapterContent = `// Chapter ${i} - ராட்சசனே எனை வதைப்பதேனடா!
// Tamil version

export const CHAPTER = {
  id: ${i},
  title: "தேன் ${i}",
  subtitle: "",
  content: \`[Content for Chapter ${i} will be added here]

This is a placeholder chapter for Novel 1 - ராட்சசனே எனை வதைப்பதேனடா! (Oh Demon! Why Do You Torment Me!)

Chapter ${i}: தேன் ${i}

The actual Tamil content for this chapter will be added in the future.\`,
  metadata: {
    language: "tamil",
    novelId: 1
  }
};

export default CHAPTER;
`;

  const outputPath = path.join(targetDir, `chapter-${i}.js`);
  fs.writeFileSync(outputPath, chapterContent, 'utf-8');
  console.log(`✓ Created placeholder chapter-${i}.js (தேன் ${i})`);
}

console.log(`\n✅ Created 27 placeholder chapters for Novel 1`);
console.log('These chapters can be updated with actual content later.');
