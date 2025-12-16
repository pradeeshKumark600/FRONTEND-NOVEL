import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import Novel from '../models/Novel.js';
import Chapter from '../models/Chapter.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Complete data for ALL 3 novels
const novelsData = [
  {
    title: 'ராட்சசனே எனை வதைப்பதேனடா!',
    slug: 'ratsasane-enai-vathaippathena',
    author: 'Thenmozhi',
    description: {
      tamil: 'சிறுவயதில் வீட்டை விட்டு வெளியேறிய நாயகன், எட்டு வருடங்கள் கடந்து யாரும் எதிர்பார்க்காத வகையில், கையில் குழந்தையுடன் வீட்டிற்கு வருகிறான். சிறுவயது முதல் தாய், தந்தை, தங்கை, தம்பி என்று அவர்களையே தன் உலகம் என்று வாழ்ந்த நாயகிக்குத் துரோகம் இழைத்தது மட்டுமில்லாமல், அவளை "அவர்கள் வீட்டுப் பெண்ணே இல்லை" என்று கூறியதால், வீட்டை விட்டு வெளியேறி, யாரும் இல்லாமல் நிர்கதியாக நிற்கிறாள் நாயகி.',
      english: 'A hero who left home in childhood returns after eight years unexpectedly with a child. The heroine, who lived considering her mother, father, sister, and brother as her world since childhood, was not only betrayed but also told she was "not a girl of their family," leading her to leave home and stand helpless.'
    },
    genre: 'Romance',
    coverImage: '/assets/images/Novel Card/Thenmozhi Card.jpg',
    authorAvatar: '/assets/thenmozhi-avatar.png',
    totalChapters: 14,
    isCompleted: false,
    tags: ['Tamil', 'Romance', 'Drama', 'Love'],
    languages: ['tamil', 'english']
  },
  {
    title: 'தாலாட்டும் தாழம்பூவே',
    slug: 'thalaattum-thazhampuve',
    author: 'Swetha Swe',
    description: {
      tamil: 'கோயில் மலரின் அழகிய பயணம். பாரம்பரியம் மற்றும் காதல் கலந்த கதை. சிறுவயதில் வீட்டை விட்டு வெளியேறிய நாயகன், எட்டு வருடங்கள் கடந்து யாரும் எதிர்பார்க்காத வகையில், கையில் குழந்தையுடன் வீட்டிற்கு வருகிறான்.',
      english: 'The beautiful journey of the temple flower. A story blending tradition and love. A hero who left home in childhood returns after eight years unexpectedly with a child.'
    },
    genre: 'Romance',
    coverImage: '/assets/images/Novel Card/swetha card.jpg',
    authorAvatar: '/assets/swetha-avatar.png',
    totalChapters: 27,
    isCompleted: true,
    tags: ['Tamil', 'Temple', 'Romance', 'Tradition', 'Love'],
    languages: ['tamil', 'english']
  },
  {
    title: 'வந்தத்துணையே! என் வாழ்க்கைத் துணையே!',
    slug: 'vanthathunaiye-en-vaazhkkai-thunaiye',
    author: 'Mohanaamozhi',
    description: {
      tamil: 'சிறுவயதில் வீட்டை விட்டு வெளியேறிய நாயகன், எட்டு வருடங்கள் கடந்து யாரும் எதிர்பார்க்காத வகையில், கையில் குழந்தையுடன் வீட்டிற்கு வருகிறான். சிறுவயது முதல் தாய், தந்தை, தங்கை, தம்பி என்று அவர்களையே தன் உலகம் என்று வாழ்ந்த நாயகிக்குத் துரோகம் இழைத்தது மட்டுமில்லாமல், அவளை "அவர்கள் வீட்டுப் பெண்ணே இல்லை" என்று கூறியதால், வீட்டை விட்டு வெளியேறி, யாரும் இல்லாமல் நிர்கதியாக நிற்கிறாள் நாயகி.',
      english: 'Welcome! My Life Partner! A story of love, betrayal, and reunion. The protagonist returns after years with a child, while the heroine faces family betrayal.'
    },
    genre: 'Romance',
    coverImage: '/assets/images/Novel Card/Mohana card.jpg',
    authorAvatar: '/assets/mohanaamozhi-avatar.png',
    totalChapters: 27,
    isCompleted: false,
    tags: ['Tamil', 'Romance', 'Family', 'Drama', 'Love'],
    languages: ['tamil', 'english']
  }
];

// Generate sample chapters for each novel
const generateChaptersForNovel = (novelId, novelSlug, totalChapters, chapterPrefix) => {
  const chapters = [];

  for (let i = 1; i <= totalChapters; i++) {
    chapters.push({
      novel: novelId,
      chapterNumber: i,
      title: {
        tamil: `${chapterPrefix} ${i}`,
        english: `Chapter ${i}`
      },
      content: {
        tamil: `[இங்கே தமிழ் உள்ளடக்கம் வரும் - ${chapterPrefix} ${i}]\n\nஇது மாதிரி உள்ளடக்கம் உங்கள் frontend chapter files-இல் இருந்து migrate செய்யப்பட வேண்டும்.`,
        english: `[English content will come here - Chapter ${i}]\n\nThis content needs to be migrated from your frontend chapter files.`
      },
      summary: {
        tamil: `${chapterPrefix} ${i} சுருக்கம்`,
        english: `Chapter ${i} summary`
      },
      order: i,
      isPublished: true
    });
  }

  return chapters;
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting COMPLETE database seeding for ALL 3 NOVELS...\n');

    // Connect to database
    await connectDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Novel.deleteMany({});
    await Chapter.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Create demo users
    console.log('👤 Creating demo users...');
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@theantamil.com',
      password: 'admin123',
      displayName: 'Admin User',
      role: 'admin',
      preferredLanguage: 'tamil'
    });

    const demoUser = await User.create({
      username: 'demouser',
      email: 'demo@theantamil.com',
      password: 'demo123',
      displayName: 'Demo User',
      role: 'user',
      preferredLanguage: 'tamil'
    });

    console.log('✅ Demo users created');
    console.log(`   Admin: admin@theantamil.com / admin123`);
    console.log(`   User: demo@theantamil.com / demo123\n`);

    // Create ALL 3 novels
    console.log('📚 Creating ALL 3 novels...');
    const createdNovels = await Novel.insertMany(novelsData);
    console.log(`✅ ${createdNovels.length} novels created:`);
    createdNovels.forEach((novel, index) => {
      console.log(`   ${index + 1}. ${novel.title} by ${novel.author} (${novel.totalChapters} chapters)`);
    });
    console.log('');

    // Create chapters for each novel
    console.log('📖 Creating chapters for all novels...\n');

    // Novel 1: Thenmozhi - ராட்சசனே எனை வதைப்பதேனடா!
    const novel1 = createdNovels[0];
    const chapters1 = generateChaptersForNovel(novel1._id, novel1.slug, 27, 'தேன்');
    await Chapter.insertMany(chapters1);
    console.log(`✅ Novel 1 (${novel1.title}): ${chapters1.length} chapters created`);

    // Novel 2: Swetha - தாலாட்டும் தாழம்பூவே
    const novel2 = createdNovels[1];
    const chapters2 = generateChaptersForNovel(novel2._id, novel2.slug, 27, 'அத்தியாயம்');
    await Chapter.insertMany(chapters2);
    console.log(`✅ Novel 2 (${novel2.title}): ${chapters2.length} chapters created`);

    // Novel 3: Mohanaamozhi - வந்தத்துணையே!
    const novel3 = createdNovels[2];
    const chapters3 = generateChaptersForNovel(novel3._id, novel3.slug, 27, 'பாகம்');
    await Chapter.insertMany(chapters3);
    console.log(`✅ Novel 3 (${novel3.title}): ${chapters3.length} chapters created`);

    const totalChapters = chapters1.length + chapters2.length + chapters3.length;

    console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ✅ COMPLETE DATABASE SEEDING FINISHED SUCCESSFULLY!                ║
║                                                                      ║
║   📚 Novels created: ${createdNovels.length}                                                ║
║      1. ராட்சசனே எனை வதைப்பதேனடா! (Thenmozhi) - 27 chapters       ║
║      2. தாலாட்டும் தாழம்பூவே (Swetha Swe) - 27 chapters             ║
║      3. வந்தத்துணையே! என் வாழ்க்கைத் துணையே! (Mohanaamozhi) - 27 ch║
║                                                                      ║
║   📖 Total chapters created: ${totalChapters}                                       ║
║   👤 Demo users created: 2                                           ║
║   🌐 Languages supported: Tamil & English                            ║
║                                                                      ║
║   🔑 Login Credentials:                                              ║
║   Admin: admin@theantamil.com / admin123                            ║
║   User:  demo@theantamil.com / demo123                              ║
║                                                                      ║
║   💡 NEXT STEPS:                                                     ║
║   1. Run the chapter migration script to import full content        ║
║   2. Start backend: npm run dev                                     ║
║   3. Frontend will now fetch from API!                              ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
