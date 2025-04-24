import { Router } from 'express';
import { 
    createClothingItem, 
    getClothingItem, 
    getAllUserClothingItems, 
    deleteClothingItem,
    searchClothingItems,
    getAvailableFilters
} from './clothingItems.controller';
import { authenticate } from '../middlewares/auth.middleware'; // Assuming this exists
import { validator } from '../utils/validator';
import { 
    createItemSchema, 
    itemIdParamSchema, 
    searchItemsQuerySchema 
} from './clothingItems.validation';

const router = Router();

// Apply authentication middleware to all item routes
router.use(authenticate);

// Routes with validation
router.post('/', validator.body(createItemSchema), createClothingItem);
router.get('/filters', getAvailableFilters);
router.get('/search', validator.query(searchItemsQuerySchema), searchClothingItems);
router.get('/', getAllUserClothingItems);
router.get('/:id', validator.params(itemIdParamSchema), getClothingItem);
router.delete('/:id', validator.params(itemIdParamSchema), deleteClothingItem);

export default router; 
