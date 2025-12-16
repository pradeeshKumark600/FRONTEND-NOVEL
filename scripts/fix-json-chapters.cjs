const fs = require('fs');

// Chapters to fix
const chaptersToFix = [22, 27];

chaptersToFix.forEach(chapterNum => {
  try {
    const fileName = `chapter-${chapterNum}-tamil.json`;

    // Try to read the existing file
    const fileContent = fs.readFileSync(fileName, 'utf8');

    // Parse it (this might fail, but we'll try)
    let chapterData;
    try {
      chapterData = JSON.parse(fileContent);
      console.log(`✅ Chapter ${chapterNum} is already valid JSON`);
      return;
    } catch (parseError) {
      console.log(`❌ Chapter ${chapterNum} has JSON errors, attempting to fix...`);

      // Extract the content manually by finding the content field
      const contentMatch = fileContent.match(/"content":\s*"([\s\S]*)",\s*"metadata"/);
      if (!contentMatch) {
        console.log(`⚠️  Could not extract content from chapter ${chapterNum}`);
        return;
      }

      // Unescape the content (since it's already escaped in the file)
      let content = contentMatch[1];
      // Replace escaped newlines with actual newlines
      content = content.replace(/\\n/g, '\n');
      // Replace escaped quotes with actual quotes
      content = content.replace(/\\"/g, '"');

      // Create proper chapter data
      chapterData = {
        title: `அத்தியாயம் ${chapterNum}`,
        subtitle: "தொடர்ச்சி",
        content: content,
        metadata: {
          chapterNumber: chapterNum,
          language: "Tamil",
          novel: "Novel 2 - தாலாட்டும் தாழம்பூவே",
          extractionDate: new Date().toISOString()
        }
      };

      // Write the properly formatted JSON
      fs.writeFileSync(fileName, JSON.stringify(chapterData, null, 2), 'utf8');
      console.log(`✅ Chapter ${chapterNum} fixed and saved`);
    }
  } catch (error) {
    console.error(`❌ Error fixing chapter ${chapterNum}:`, error.message);
  }
});

console.log('\n✨ JSON fix completed!');
