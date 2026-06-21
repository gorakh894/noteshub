const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('../models/User');
const Note = require('../models/Note');
const Discussion = require('../models/Discussion');

const connectDB = require('../config/db');

const SAMPLE_NOTES = [
  {
    title: 'DBMS Unit 3 - Normalization Complete Notes',
    description: 'Comprehensive notes on 1NF, 2NF, 3NF, BCNF with solved examples',
    subject: 'Database Management Systems',
    branch: 'IT',
    year: 'SY',
    semester: 4,
    unit: 'Unit 3',
    category: 'Lecture Notes',
    tags: ['normalization', 'DBMS', 'SQL'],
    fileUrl: 'https://sample-url.com/file.pdf',
    fileType: 'pdf',
    status: 'approved',
    downloadCount: 234,
    viewCount: 1200,
    averageRating: 4.5,
    ratingCount: 28,
    isExamImportant: true,
  },
  {
    title: 'Data Structures - Trees and Graphs Handwritten Notes',
    description: 'Handwritten notes covering BFS, DFS, BST, AVL Trees',
    subject: 'Data Structures',
    branch: 'CS',
    year: 'SY',
    semester: 3,
    unit: 'Unit 4',
    category: 'Handwritten Notes',
    tags: ['trees', 'graphs', 'BFS', 'DFS'],
    fileUrl: 'https://sample-url.com/file2.pdf',
    fileType: 'pdf',
    status: 'approved',
    downloadCount: 456,
    viewCount: 2100,
    averageRating: 4.8,
    ratingCount: 45,
  },
  {
    title: 'Computer Networks - OSI Model Cheat Sheet',
    description: 'Quick reference cheat sheet for all 7 layers of OSI model',
    subject: 'Computer Networks',
    branch: 'IT',
    year: 'TY',
    semester: 5,
    category: 'Cheat Sheet',
    tags: ['OSI', 'networking', 'protocols'],
    fileUrl: 'https://sample-url.com/file3.pdf',
    fileType: 'pdf',
    status: 'approved',
    downloadCount: 789,
    viewCount: 3400,
    averageRating: 4.9,
    ratingCount: 67,
    isExamImportant: true,
  },
  {
    title: 'Machine Learning Lab Practical File',
    description: 'Complete ML lab practicals: Linear Regression, KNN, Decision Trees',
    subject: 'Machine Learning',
    branch: 'AIDS',
    year: 'TY',
    semester: 6,
    category: 'Practical Journal',
    tags: ['ML', 'python', 'scikit-learn'],
    fileUrl: 'https://sample-url.com/file4.pdf',
    fileType: 'pdf',
    status: 'approved',
    downloadCount: 312,
    viewCount: 1800,
    averageRating: 4.3,
    ratingCount: 22,
  },
];

const SAMPLE_DISCUSSIONS = [
  {
    title: 'How to prepare for DBMS viva?',
    content: 'I have my DBMS viva next week. What are the most important topics to revise? Any tips from seniors?',
    category: 'Question',
    branch: 'IT',
    semester: 4,
    subject: 'DBMS',
    tags: ['DBMS', 'viva', 'exam'],
    views: 234,
    answers: [
      {
        content: 'Focus on normalization, transactions, ACID properties, ER diagrams, and basic SQL queries. Also prepare to explain the difference between clustered and non-clustered indexes.',
        isAccepted: true,
      }
    ]
  },
  {
    title: 'Best resources for learning React.js from scratch?',
    content: 'Can someone recommend good resources to learn React? I know JavaScript basics but never used a framework.',
    category: 'Help',
    branch: 'General',
    tags: ['react', 'javascript', 'frontend'],
    views: 567,
  }
];

const seedDB = async () => {
  await connectDB();
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Note.deleteMany({}),
      Discussion.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@enginotes.com',
      password: 'admin123',
      role: 'admin',
      branch: 'IT',
      year: 'Final',
      isEmailVerified: true,
      contributionScore: 500,
      badges: [
        { name: 'First Upload', icon: '📝' },
        { name: 'Top Contributor', icon: '🏆' },
        { name: 'Scholar', icon: '🎓' },
      ]
    });

    // Create sample students
    const students = await User.insertMany([
      { name: 'Raj Sharma', email: 'raj@example.com', password: await bcrypt.hash('password123', 12), branch: 'IT', year: 'TY', isEmailVerified: true, contributionScore: 120, uploadCount: 8 },
      { name: 'Priya Patel', email: 'priya@example.com', password: await bcrypt.hash('password123', 12), branch: 'CS', year: 'SY', isEmailVerified: true, contributionScore: 85, uploadCount: 5 },
      { name: 'Amit Kumar', email: 'amit@example.com', password: await bcrypt.hash('password123', 12), branch: 'AIDS', year: 'Final', isEmailVerified: true, contributionScore: 200, uploadCount: 15 },
    ]);

    console.log(`✅ Created ${students.length + 1} users (admin: admin@enginotes.com / admin123)`);

    // Create sample notes
    const noteData = SAMPLE_NOTES.map((note, i) => ({
      ...note,
      author: i % 2 === 0 ? students[0]._id : students[1]._id,
      approvedBy: admin._id,
      approvedAt: new Date(),
    }));

    const notes = await Note.insertMany(noteData);
    console.log(`✅ Created ${notes.length} sample notes`);

    // Create sample discussions
    const discussionData = SAMPLE_DISCUSSIONS.map(d => ({
      ...d,
      author: students[0]._id,
      answers: d.answers?.map(a => ({ ...a, author: students[1]._id })) || []
    }));

    await Discussion.insertMany(discussionData);
    console.log(`✅ Created ${discussionData.length} sample discussions`);

    console.log('\n✅ Database seeded successfully!');
    console.log('📧 Admin login: admin@enginotes.com');
    console.log('🔑 Admin password: admin123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
