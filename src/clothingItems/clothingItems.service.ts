import { ClothingItem } from './clothingItem.model';
import { CreateItemInput, IClothingItem, SearchQuery } from './clothingItems.types';
import { AppError } from '../middlewares/error.middleware';
import mongoose, { FilterQuery } from 'mongoose';


export class ClothingItemsService {
  async createItem(userId: string, itemData: CreateItemInput): Promise<IClothingItem> {
    try {
      // Normalize fields to lowercase
      const normalizedData = {
        ...itemData,
        type: itemData.type.toLowerCase(),
        color: itemData.color.toLowerCase(),
        fabric: itemData.fabric.toLowerCase(),
        occasionTags: itemData.occasionTags?.map(tag => tag.toLowerCase()),
        seasonTags: itemData.seasonTags?.map(tag => tag.toLowerCase()),
        weatherFit: itemData.weatherFit?.map(tag => tag.toLowerCase()),
        styleTags: itemData.styleTags?.map(tag => tag.toLowerCase()),
        userId, // Add userId here as well
      };
      console.log(normalizedData);
      const newItem = await ClothingItem.create(normalizedData);
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
    const filter: FilterQuery<IClothingItem> = {
      userId: query.userId};
    if (query.type) filter.type = query.type.toLowerCase();
    if (query.color) filter.color = query.color.toLowerCase();
    if (query.fabric) filter.fabric = query.fabric.toLowerCase();

    // For tags, we check if the item's array contains ALL the specified tags
    if (query.occasionTags && query.occasionTags.length > 0) {
        filter.occasionTags = { $all: query.occasionTags.map(tag => tag.toLowerCase()) };
    }
    if (query.seasonTags && query.seasonTags.length > 0) {
        filter.seasonTags = { $all: query.seasonTags.map(tag => tag.toLowerCase()) };
    }
    if (query.weatherFit && query.weatherFit.length > 0) {
        filter.weatherFit = { $all: query.weatherFit.map(tag => tag.toLowerCase()) };
    }
    if (query.styleTags && query.styleTags.length > 0) {
        filter.styleTags = { $all: query.styleTags.map(tag => tag.toLowerCase()) };
    }

    const items = await ClothingItem.find(filter).sort({ createdAt: -1 });
    return items;
  }

  async getAvailableFiltersForUser(userId: string): Promise<Record<string, string[]>> {
    try {
      // Fetch distinct simple fields
      let [types, colors, fabrics]: string[][] = await Promise.all([
        ClothingItem.distinct('type', { userId }),
        ClothingItem.distinct('color', { userId }),
        ClothingItem.distinct('fabric', { userId })
      ]);

      types = [...new Set(types.map(tag => tag.toLowerCase()))];
      colors = [...new Set(colors.map(tag => tag.toLowerCase()))];
      fabrics = [...new Set(fabrics.map(tag => tag.toLowerCase()))];

      // Fetch all items to aggregate tags
      const items = await ClothingItem.find({ userId }).select('occasionTags seasonTags weatherFit styleTags');

      // Aggregate and deduplicate tags
      const occasionTags = [...new Set(items.flatMap(item => item.occasionTags || []).map(tag => tag.toLowerCase()))];
      const seasonTags = [...new Set(items.flatMap(item => item.seasonTags || []).map(tag => tag.toLowerCase()))];
      const weatherFit = [...new Set(items.flatMap(item => item.weatherFit || []).map(tag => tag.toLowerCase()))];
      const styleTags = [...new Set(items.flatMap(item => item.styleTags || []).map(tag => tag.toLowerCase()))];

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
