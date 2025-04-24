import { Router } from 'express';
import { register, login, refreshToken } from './users.controller';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

export default router; 
