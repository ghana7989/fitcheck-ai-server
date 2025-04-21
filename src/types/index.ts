import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

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

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
} 
