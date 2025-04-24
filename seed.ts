import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { User } from './src/users/user.model'; // Adjust path if needed
import { ClothingItem } from './src/clothingItems/clothingItem.model'; // Adjust path if needed
import { IClothingItem, CreateItemInput } from './src/clothingItems/clothingItems.types'; // Adjust path if needed
import { IUser } from './src/users/users.types'; // Reverted, removed CreateUserInput
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '.env'),
}); // Load environment variables from .env file

const SALT_ROUNDS = 10; // Consistent with your auth setup hopefully

const seedDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGO_URI environment variable is not set.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // --- Clear existing data (Use with caution!) ---
    console.log('Clearing existing Users...');
    await User.deleteMany({});
    console.log('Clearing existing Clothing Items...');
    await ClothingItem.deleteMany({});
    console.log('Existing data cleared.');

    // --- Create Sample Users ---
    console.log('Creating sample users...');
    const hashedPasswordTest = await bcrypt.hash('password123', SALT_ROUNDS);
    const hashedPasswordJane = await bcrypt.hash('anotherpassword', SALT_ROUNDS);

    const usersToCreate: Partial<IUser>[] = [
      { name: 'Test User', email: 'test@example.com', password: hashedPasswordTest },
      { name: 'Jane Doe', email: 'jane.doe@example.com', password: hashedPasswordJane },
    ];

    const createdUsers = await User.insertMany(usersToCreate);
    console.log(`Created ${createdUsers.length} users.`);

    const testUser = createdUsers.find(u => u.email === 'test@example.com');
    const janeUser = createdUsers.find(u => u.email === 'jane.doe@example.com');

    if (!testUser || !janeUser) {
        throw new Error('Failed to retrieve created users.');
    }

    // --- Create Sample Clothing Items ---
    console.log('Creating sample clothing items...');
    const clothingItemsToCreate: (Omit<CreateItemInput, 'userId'> & { userId: mongoose.Types.ObjectId })[] = [
      // Items for Test User
      {
        userId: testUser._id,
        imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80', // Example image
        type: 'T-Shirt',
        color: 'Black',
        fabric: 'Cotton',
        occasionTags: ['Casual', 'Everyday'],
        seasonTags: ['Spring', 'Summer', 'Autumn'],
        weatherFit: ['Warm', 'Mild'],
        styleTags: ['Basic', 'Minimalist'],
      },
      {
        userId: testUser._id,
        imageUrl: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80', // Example image
        type: 'Jeans',
        color: 'Blue',
        fabric: 'Denim',
        occasionTags: ['Casual', 'Everyday', 'Weekend'],
        seasonTags: ['All'],
        weatherFit: ['Mild', 'Cool'],
        styleTags: ['Classic'],
      },
      // Items for Jane Doe
       {
        userId: janeUser._id,
        imageUrl: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80', // Example image
        type: 'Sweater',
        color: 'Grey',
        fabric: 'Wool',
        occasionTags: ['Casual', 'Work', 'Weekend'],
        seasonTags: ['Autumn', 'Winter'],
        weatherFit: ['Cool', 'Cold'],
        styleTags: ['Cozy', 'Classic'],
      },
      {
        userId: janeUser._id,
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Example image
        type: 'Dress',
        color: 'Red',
        fabric: 'Silk',
        occasionTags: ['Formal', 'Party'],
        seasonTags: ['Spring', 'Summer'],
        weatherFit: ['Warm'],
        styleTags: ['Elegant', 'Bold'],
      },
    ];

    const createdItems = await ClothingItem.insertMany(clothingItemsToCreate);
    console.log(`Created ${createdItems.length} clothing items.`);

    console.log('Database seeding completed successfully.');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedDatabase();
