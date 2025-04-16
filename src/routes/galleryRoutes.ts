import express from 'express';
import GalleryPost from '../models/GalleryPost';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all gallery posts
router.get('/', async (req, res) => {
  try {
    const posts = await GalleryPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery posts', error });
  }
});

// Get featured gallery posts
router.get('/featured', async (req, res) => {
  try {
    const posts = await GalleryPost.find({ featured: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured gallery posts', error });
  }
});

// Get a single gallery post
router.get('/:id', async (req, res) => {
  try {
    const post = await GalleryPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Gallery post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery post', error });
  }
});

// Create a new gallery post (protected route)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { imageUrl, caption, description, tags, featured } = req.body;
    
    const newPost = new GalleryPost({
      imageUrl,
      caption,
      description,
      tags,
      featured,
    });
    
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating gallery post', error });
  }
});

// Update a gallery post (protected route)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { imageUrl, caption, description, tags, featured } = req.body;
    
    const updatedPost = await GalleryPost.findByIdAndUpdate(
      req.params.id,
      { imageUrl, caption, description, tags, featured },
      { new: true }
    );
    
    if (!updatedPost) {
      return res.status(404).json({ message: 'Gallery post not found' });
    }
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating gallery post', error });
  }
});

// Delete a gallery post (protected route)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedPost = await GalleryPost.findByIdAndDelete(req.params.id);
    
    if (!deletedPost) {
      return res.status(404).json({ message: 'Gallery post not found' });
    }
    
    res.json({ message: 'Gallery post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting gallery post', error });
  }
});

export default router; 