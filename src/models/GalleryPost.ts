import mongoose from 'mongoose';

const galleryPostSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
  }],
  likes: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
galleryPostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const GalleryPost = mongoose.model('GalleryPost', galleryPostSchema);

export default GalleryPost; 