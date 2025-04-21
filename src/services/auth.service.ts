import jwt, { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { User } from '../models/user.model';
import { config } from '../config';
import { TokenPayload, AuthResponse } from '../types';
import { AppError } from '../middlewares/error.middleware';

export class AuthService {
  private generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(
      payload,
      config.jwt.accessSecret as jwt.Secret,
      { expiresIn: config.jwt.accessExpiration } as SignOptions
    );

    const refreshToken = jwt.sign(
      payload,
      config.jwt.refreshSecret as jwt.Secret,
      { expiresIn: config.jwt.refreshExpiration } as SignOptions
    );

    return { accessToken, refreshToken };
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user._id) {
      throw new AppError('Error creating user', 500);
    }

    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const { accessToken, refreshToken } = this.generateTokens(payload);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await User.findOne({ email });
    if (!user || !user._id) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const { accessToken, refreshToken } = this.generateTokens(payload);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret as jwt.Secret) as TokenPayload;
      const user = await User.findById(decoded.userId);

      if (!user || !user._id || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      const payload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
      };

      const accessToken = jwt.sign(
        payload,
        config.jwt.accessSecret as jwt.Secret,
        { expiresIn: config.jwt.accessExpiration } as SignOptions
      );

      return { accessToken };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }
} 
