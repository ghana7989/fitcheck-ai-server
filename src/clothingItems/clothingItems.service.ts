import { ClothingItem } from './clothingItem.model';
import { CreateItemInput, IClothingItem, SearchQuery } from './clothingItems.types';
import { AppError } from '../middlewares/error.middleware';
import mongoose from 'mongoose';


export class ClothingItemsService {
  async createItem(userId: string, itemData: CreateItemInput): Promise<IClothingItem> {
    try {
      const newItem = await ClothingItem.create({
        ...itemData,
        userId,
      });
      return newItem;
    } catch (error: any) {
      // Handle potential validation errors etc.
      console.error('Error creating clothing item:', error);
      throw new AppError('Failed to create clothing item', 500);
    }
  }

  async getItemById(itemId: string, userId: string): Promise<IClothingItem | null> {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
       throw new AppError('Invalid item ID format', 400);
    }
    const item = await ClothingItem.findOne({ _id: itemId, userId });
    if (!item) {
      throw new AppError('Clothing item not found or access denied', 404);
    }
    return item;
  }

  async getItemsByUser(userId: string): Promise<IClothingItem[]> {
    const items = await ClothingItem.find({ userId }).sort({ createdAt: -1 });
    return items;
  }

  async deleteItem(itemId: string, userId: string): Promise<void> {
     if (!mongoose.Types.ObjectId.isValid(itemId)) {
       throw new AppError('Invalid item ID format', 400);
    }
    const result = await ClothingItem.deleteOne({ _id: itemId, userId });
    if (result.deletedCount === 0) {
      throw new AppError('Clothing item not found or access denied', 404);
    }
  }

  async searchItems(query: SearchQuery): Promise<IClothingItem[]> {
    const filter: any = { userId: query.userId };

    if (query.type) filter.type = query.type;
    if (query.color) filter.color = query.color;
    if (query.fabric) filter.fabric = query.fabric;

    // For tags, we check if the item's array contains ALL the specified tags
    if (query.occasionTags && query.occasionTags.length > 0) {
        filter.occasionTags = { $all: query.occasionTags };
    }
    if (query.seasonTags && query.seasonTags.length > 0) {
        filter.seasonTags = { $all: query.seasonTags };
    }
     if (query.weatherFit && query.weatherFit.length > 0) {
        filter.weatherFit = { $all: query.weatherFit };
    }
    if (query.styleTags && query.styleTags.length > 0) {
        filter.styleTags = { $all: query.styleTags };
    }

    const items = await ClothingItem.find(filter).sort({ createdAt: -1 });
    return items;
  }

  async getAvailableFiltersForUser(userId: string): Promise<Record<string, string[]>> {
    try {
      // Fetch distinct simple fields
      const [types, colors, fabrics] = await Promise.all([
        ClothingItem.distinct('type', { userId }),
        ClothingItem.distinct('color', { userId }),
        ClothingItem.distinct('fabric', { userId })
      ]);

      // Fetch all items to aggregate tags
      const items = await ClothingItem.find({ userId }).select('occasionTags seasonTags weatherFit styleTags');

      // Aggregate and deduplicate tags
      const occasionTags = [...new Set(items.flatMap(item => item.occasionTags || []))];
      const seasonTags = [...new Set(items.flatMap(item => item.seasonTags || []))];
      const weatherFit = [...new Set(items.flatMap(item => item.weatherFit || []))];
      const styleTags = [...new Set(items.flatMap(item => item.styleTags || []))];

      return {
        types,
        colors,
        fabrics,
        occasionTags,
        seasonTags,
        weatherFit,
        styleTags,
      };
    } catch (error: any) {
      console.error('Error fetching available filters:', error);
      throw new AppError('Failed to fetch available filters', 500);
    }
  }
} 
