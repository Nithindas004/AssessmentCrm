// scripts/seed.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Configure dotenv to use the .env.local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Adjust the path to your User model
// Assuming User model is at 'src/models/User.ts'
import User from '../src/models/User';

const users = [
  {
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    fullName: 'Sales Person',
    email: 'sales@example.com',
    password: 'password123',
    role: 'salesperson',
  },
];

const seedDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in your .env.local file");
    }

    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing users to prevent duplicates
    await User.deleteMany({});
    console.log('Existing users cleared.');

    // Hash passwords and create user documents
    const createdUsers = await Promise.all(
      users.map(async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return new User({
          ...userData,
          password: hashedPassword,
        });
      })
    );

    await User.insertMany(createdUsers);
    console.log('Database has been seeded successfully!');

  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedDB();