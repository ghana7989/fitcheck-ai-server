import { Document } from 'mongoose';
import { IUser } from '../users/users.types';

export interface IClothingItem extends Document {
  userId: IUser['_id'];
  imageUrl: string;
  type: string;
  color: string;
  fabric: string;
  occasionTags: string[];
  seasonTags: string[];
  weatherFit: string[];
  styleTags: string[];
  createdAt: Date;
}

export interface IOutfit extends Document {
  userId: IUser['_id'];
  items: IClothingItem['_id'][];
  occasionPrompt: string;
  explanation: string;
  createdAt: Date;
} 


export interface CreateItemInput {
  imageUrl: string;
  type: string;
  color: string;
  fabric: string;
  occasionTags?: string[];
  seasonTags?: string[];
  weatherFit?: string[];
  styleTags?: string[];
}

export interface SearchQuery {
  userId: string;
  type?: string;
  color?: string;
  fabric?: string;
  occasionTags?: string[];
  seasonTags?: string[];
  weatherFit?: string[];
  styleTags?: string[];
}
