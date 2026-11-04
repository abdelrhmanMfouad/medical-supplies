import mongoose from 'mongoose';
import Category from '../models/Category';
import Item from '../models/Item';
import dotenv from 'dotenv';

dotenv.config();

const fixCategoryCounts = async () => {
  try {
    // ✅ الاتصال بقاعدة البيانات
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ Connected to MongoDB');

    // ✅ جلب كل الفئات
    const categories = await Category.find();
    console.log(`📊 Found ${categories.length} categories`);

    // ✅ لكل فئة، نحسب عدد الـ Items المرتبطة بها
    for (const category of categories) {
      const count = await Item.countDocuments({ categoryId: category._id });
      
      // ✅ تحديث الـ itemCount
      category.itemCount = count;
      await category.save();
      
      console.log(`✅ ${category.name}: ${count} items`);
    }

    console.log('✅ All category counts updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixCategoryCounts();