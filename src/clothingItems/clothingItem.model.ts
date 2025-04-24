import mongoose from 'mongoose';
import { IClothingItem } from './clothingItems.types';

const clothingItemSchema = new mongoose.Schema<IClothingItem>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  type: {
    type: String,
    required: [true, 'Clothing type is required'],
    trim: true,
  },
  color: {
    type: String,
    required: [true, 'Color is required'],
    trim: true,
  },
  fabric: {
    type: String,
    required: [true, 'Fabric type is required'],
    trim: true,
  },
  occasionTags: [{
    type: String,
    trim: true,
  }],
  seasonTags: [{
    type: String,
    trim: true,
  }],
  weatherFit: [{
    type: String,
    trim: true,
  }],
  styleTags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

// Index for faster queries
clothingItemSchema.index({ userId: 1, type: 1 });
clothingItemSchema.index({ userId: 1, occasionTags: 1 });
clothingItemSchema.index({ userId: 1, seasonTags: 1 });

export const ClothingItem = mongoose.model<IClothingItem>('ClothingItem', clothingItemSchema); 
