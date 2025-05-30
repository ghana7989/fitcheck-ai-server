import { NextFunction, Request, Response } from 'express';
import { AppError } from '../middlewares/error.middleware';
import { ClothingItemsService } from './clothingItems.service';

const clothingItemsService = new ClothingItemsService();

// Assumes an authentication middleware adds req.user = { userId: string, ... }

export const createClothingItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }
    // Joi has already validated the request body
    const newItem = await clothingItemsService.createItem(userId, req.body);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

export const getClothingItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const itemId = req.params.id;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }
    const item = await clothingItemsService.getItemById(itemId, userId);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const getAllUserClothingItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }
    const items = await clothingItemsService.getItemsByUser(userId);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const deleteClothingItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const itemId = req.params.id;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }
    await clothingItemsService.deleteItem(itemId, userId);
    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};

export const searchClothingItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    // Joi has already validated the query parameters
    // We'll still need to map req.query to a searchQuery object
    const { type, color, fabric, occasionTags, seasonTags, weatherFit, styleTags } = req.query;

    // Prepare search query for the service
    const searchQuery = {
      userId,
      ...(type && { type: type as string }),
      ...(color && { color: color as string }),
      ...(fabric && { fabric: fabric as string }),
      ...(occasionTags && { occasionTags: (Array.isArray(occasionTags) ? occasionTags : [occasionTags]).filter(tag => typeof tag === 'string') as string[] }),
      ...(seasonTags && { seasonTags: (Array.isArray(seasonTags) ? seasonTags : [seasonTags]).filter(tag => typeof tag === 'string') as string[] }),
      ...(weatherFit && { weatherFit: (Array.isArray(weatherFit) ? weatherFit : [weatherFit]).filter(tag => typeof tag === 'string') as string[] }),
      ...(styleTags && { styleTags: (Array.isArray(styleTags) ? styleTags : [styleTags]).filter(tag => typeof tag === 'string') as string[] }),
    };

    const items = await clothingItemsService.searchItems(searchQuery);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getAvailableFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('Authentication required', 401);
    }

    const filters = await clothingItemsService.getAvailableFiltersForUser(userId);
    res.json(filters);
  } catch (error) {
    next(error);
  }
}; 
