import mongoose from 'mongoose';
import Category from '../models/Category.ts';
import dotenv from 'dotenv';

dotenv.config();
const categories = [
  { name: 'Food', icon: '🍔' },
  { name: 'Transport', icon: '🚗' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Bills', icon: '💡' },
  { name: 'Health', icon: '💊' },
  { name: 'Travel', icon: '✈️' },
  { name: 'Groceries', icon: '🛒' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Education', icon: '📚' },
  { name: 'Other', icon: '🔖' },
];

async function seedCategories() {
  await mongoose.connect(process.env.MONGO_URI || '', { dbName: 'expense-tracker' });
  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log('Categories seeded!');
  await mongoose.disconnect();
}

seedCategories().catch(console.error);
