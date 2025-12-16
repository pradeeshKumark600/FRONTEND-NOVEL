import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDatabase from '../config/database.js';
import Novel from '../models/Novel.js';
import Chapter from '../models/Chapter.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Sample data for novels
const novelsData = [
  {
    title: 'ராட்சசனே எனை வதைப்பதேனடா!',
    slug: 'ratsasane-enai-vathaippathena',
    author: 'தேன்மொழி',
    description: {
      tamil: 'ஒரு அழகான காதல் கதை. ஆதிரா மற்றும் ருத்ரனின் வாழ்க்கையில் நிகழும் சுவாரசியமான திருப்பங்கள்.',
      english: 'A beautiful love story. Interesting turns in the lives of Aadira and Ruthran.'
    },
    genre: 'Romance',
    coverImage: '/assets/Crime.png',
    authorAvatar: '/assets/thenmozhi-avatar.png',
    totalChapters: 13,
    isCompleted: false,
    tags: ['Tamil', 'Romance', 'Drama'],
    languages: ['tamil', 'english']
  },
  {
    title: 'தாளாட்டும் கோயில் மலரே',
    slug: 'thalaattum-kovil-malare',
    author: 'மோகனா',
    description: {
      tamil: 'கோயில் மலரின் அழகிய பயணம். பாரம்பரியம் மற்றும் காதல் கலந்த கதை.',
      english: 'The beautiful journey of the temple flower. A story blending tradition and love.'
    },
    genre: 'Romance',
    coverImage: '/assets/Romantic.png',
    authorAvatar: '/assets/mohanaamozhi-avatar.png',
    totalChapters: 27,
    isCompleted: true,
    tags: ['Tamil', 'Temple', 'Romance', 'Tradition'],
    languages: ['tamil', 'english']
  }
];

// Sample chapters for ராட்சசனே novel
const ratsasaneChaptersData = [
  {
    chapterNumber: 1,
    title: {
      tamil: 'அத்தியாயம் 1 - ஆரம்பம்',
      english: 'Chapter 1 - Beginning'
    },
    content: {
      tamil: 'கதை தொடங்குகிறது...',
      english: 'The story begins...'
    },
    summary: {
      tamil: 'ஆதிராவின் வாழ்க்கை மாற்றம்',
      english: 'Aadira\'s life transformation'
    },
    order: 1
  },
  {
    chapterNumber: 2,
    title: {
      tamil: 'அத்தியாயம் 2 - சந்திப்பு',
      english: 'Chapter 2 - Meeting'
    },
    content: {
      tamil: 'முதல் சந்திப்பு...',
      english: 'First meeting...'
    },
    summary: {
      tamil: 'ருத்ரன் மற்றும் ஆதிரா சந்திக்கிறார்கள்',
      english: 'Ruthran and Aadira meet'
    },
    order: 2
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Novel.deleteMany({});
    await Chapter.deleteMany({});
    await User.deleteMany({});

    console.log('✅ Existing data cleared');

    // Create demo admin user
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
    console.log(`   User: demo@theantamil.com / demo123`);

    // Create novels
    console.log('📚 Creating novels...');
    const createdNovels = await Novel.insertMany(novelsData);
    console.log(`✅ ${createdNovels.length} novels created`);

    // Create sample chapters for Ratsasane novel
    const ratsasaneNovel = createdNovels.find(n => n.slug === 'ratsasane-enai-vathaippathena');

    if (ratsasaneNovel) {
      console.log('📖 Creating sample chapters for ராட்சசனே novel...');

      const chaptersToCreate = ratsasaneChaptersData.map(chapter => ({
        ...chapter,
        novel: ratsasaneNovel._id
      }));

      const createdChapters = await Chapter.insertMany(chaptersToCreate);
      console.log(`✅ ${createdChapters.length} sample chapters created`);
    }

    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!            ║
║                                                          ║
║   📚 Novels created: ${createdNovels.length}                                    ║
║   📖 Sample chapters created                             ║
║   👤 Demo users created                                  ║
║                                                          ║
║   🔑 Login Credentials:                                  ║
║   Admin: admin@theantamil.com / admin123                ║
║   User:  demo@theantamil.com / demo123                  ║
║                                                          ║
║   💡 Note: You'll need to add the full chapter content  ║
║   from your frontend files to the database manually     ║
║   or create a migration script.                         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
