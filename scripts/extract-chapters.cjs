const fs = require('fs');
const chapters = require('./src/utils/chapters/novel-2.js');

for (let i = 1; i <= 6; i++) {
  const ch = chapters.CHAPTERS[i.toString()];
  fs.writeFileSync(`chapter-${i}-tamil.json`, JSON.stringify({
    title: ch.title,
    subtitle: ch.subtitle,
    content: ch.content
  }, null, 2));
  console.log(`Chapter ${i} extracted: ${ch.content.length} chars`);
}

console.log('All chapters extracted successfully!');
