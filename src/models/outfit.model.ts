import mongoose from 'mongoose';
import { IOutfit } from '../types';

const outfitSchema = new mongoose.Schema<IOutfit>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClothingItem',
    required: true,
  }],
  occasionPrompt: {
    type: String,
    required: [true, 'Occasion prompt is required'],
    trim: true,
  },
  explanation: {
    type: String,
    required: [true, 'AI explanation is required'],
  },
}, {
  timestamps: true,
});

// Index for faster queries
outfitSchema.index({ userId: 1, createdAt: -1 });

export const Outfit = mongoose.model<IOutfit>('Outfit', outfitSchema); 
