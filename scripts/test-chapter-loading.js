// Test script to verify chapter loading works correctly
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('Testing Chapter Loading Functionality\n');
console.log('======================================\n');

async function testChapterLoad(novelId, chapterId, language, novelName) {
  try {
    const novelFolders = {
      1: 'raatchasane-novel',
      2: 'thaalaattum-novel'
    };

    const novelFolder = novelFolders[novelId];
    const chapterPath = path.join(projectRoot, `src/chapters/${novelFolder}/${language}/chapter-${chapterId}.js`);
    const chapterUrl = `file:///${chapterPath.replace(/\\/g, '/')}`;

    const { CHAPTER } = await import(chapterUrl);

    console.log(`✅ Novel ${novelId} (${novelName}) - Chapter ${chapterId} (${language})`);
    console.log(`   Title: ${CHAPTER.title}`);
    console.log(`   Subtitle: ${CHAPTER.subtitle || '(none)'}`);
    console.log(`   Content length: ${CHAPTER.content.length} characters`);
    console.log(`   Metadata: novelId=${CHAPTER.metadata.novelId}, language=${CHAPTER.metadata.language}`);
    console.log('');
    return true;
  } catch (error) {
    console.log(`❌ Failed to load Novel ${novelId} - Chapter ${chapterId} (${language})`);
    console.log(`   Error: ${error.message}`);
    console.log('');
    return false;
  }
}

async function runTests() {
  let passedTests = 0;
  let totalTests = 0;

  console.log('Test 1: Novel 1 (ராட்சசனே எனை வதைப்பதேனடா!) - Tamil Chapter 1');
  console.log('-----------------------------------------------------------');
  totalTests++;
  if (await testChapterLoad(1, 1, 'tamil', 'ராட்சசனே எனை வதைப்பதேனடா!')) passedTests++;

  console.log('Test 2: Novel 1 - Tamil Chapter 27');
  console.log('-----------------------------------');
  totalTests++;
  if (await testChapterLoad(1, 27, 'tamil', 'ராட்சசனே எனை வதைப்பதேனடா!')) passedTests++;

  console.log('Test 3: Novel 2 (தாலாட்டும் தாழம்பூவே) - Tamil Chapter 1');
  console.log('----------------------------------------------------------');
  totalTests++;
  if (await testChapterLoad(2, 1, 'tamil', 'தாலாட்டும் தாழம்பூவே')) passedTests++;

  console.log('Test 4: Novel 2 - Tamil Chapter 27');
  console.log('-----------------------------------');
  totalTests++;
  if (await testChapterLoad(2, 27, 'tamil', 'தாலாட்டும் தாழம்பூவே')) passedTests++;

  console.log('Test 5: Novel 2 - English Chapter 1');
  console.log('------------------------------------');
  totalTests++;
  if (await testChapterLoad(2, 1, 'english', 'The Lullaby of the Temple Flower')) passedTests++;

  console.log('Test 6: Novel 2 - English Chapter 27');
  console.log('-------------------------------------');
  totalTests++;
  if (await testChapterLoad(2, 27, 'english', 'The Lullaby of the Temple Flower')) passedTests++;

  console.log('======================================');
  console.log(`Test Results: ${passedTests}/${totalTests} passed`);
  console.log('======================================\n');

  if (passedTests === totalTests) {
    console.log('✅ All tests passed! Chapter loading is working correctly.\n');
    console.log('The new chapter folder structure is ready to use.');
    console.log('You can now start the dev server with `npm run dev` to test in the browser.');
  } else {
    console.log('⚠️  Some tests failed. Please review the errors above.');
  }
}

runTests().catch(error => {
  console.error('Fatal error during testing:', error);
  process.exit(1);
});
