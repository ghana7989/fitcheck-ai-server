import { Router } from 'express';
import { register, login, refreshToken } from './users.controller';
import { validator } from '../utils/validator';
import { 
    registerSchema, 
    loginSchema, 
    refreshTokenSchema 
} from './users.validation';

const router = Router();

// Auth routes with validation
router.post('/register', validator.body(registerSchema), register);
router.post('/login', validator.body(loginSchema), login);
router.post('/refresh-token', validator.body(refreshTokenSchema), refreshToken);

export default router; 
