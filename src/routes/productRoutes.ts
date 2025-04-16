import express from 'express';
import Product from '../models/Product';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all products
router.get('/', async (req, res) => {
  try {
    // Exclude the general inquiry product from the main products list
    const products = await Product.find({ name: { $ne: 'General Inquiry' } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get featured products (limited to 5)
router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ 
      featured: true,
      name: { $ne: 'General Inquiry' } 
    }).limit(5);
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured products' });
  }
});

// Get general product
router.get('/general', async (req, res) => {
  try {
    const generalProduct = await Product.findOne({ name: 'General Inquiry' });
    if (!generalProduct) {
      return res.status(404).json({ message: 'General product not found' });
    }
    res.json(generalProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching general product' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product' });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router; 