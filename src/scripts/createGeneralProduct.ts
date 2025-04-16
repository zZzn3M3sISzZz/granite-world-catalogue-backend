import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';

dotenv.config();

const createGeneralProduct = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/granite-world');
    
    // Check if general product already exists
    const existingProduct = await Product.findOne({ name: 'General Inquiry' });
    
    if (existingProduct) {
      console.log('General product already exists');
      return existingProduct._id;
    }

    // Create general product
    const generalProduct = await Product.create({
      name: 'General Inquiry',
      description: 'General contact form submission',
      price: 0,
      category: 'General',
      imageUrl: '/images/general-inquiry.jpg',
    });

    console.log('General product created successfully:', generalProduct._id);
    return generalProduct._id;
  } catch (error) {
    console.error('Error creating general product:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
};

// Run the script
createGeneralProduct()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 