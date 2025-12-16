const fs = require('fs'); 
const chapters = require('./src/utils/chapters/novel-2.js');

for (let i = 7; i <= 12; i++) {
  const ch = chapters.CHAPTERS[i.toString()];
  fs.writeFileSync(`chapter-${i}-tamil.json`, JSON.stringify({
    title: ch.title,
    subtitle: ch.subtitle,
    content: ch.content
  }, null, 2));
  console.log(`Chapter ${i} extracted: ${ch.content.length} chars`);
}

console.log('Chapters 7-12 extracted successfully!');
