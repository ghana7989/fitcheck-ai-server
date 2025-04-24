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

const router = Router();

// Apply authentication middleware to all item routes
router.use(authenticate);

// Routes
router.post('/', createClothingItem);         // Create a new item
router.get('/filters', getAvailableFilters); // Get available filters for the user
router.get('/search', searchClothingItems);  // Search items (must be before /:id)
router.get('/', getAllUserClothingItems);     // Get all items for the user
router.get('/:id', getClothingItem);        // Get a specific item by ID
router.delete('/:id', deleteClothingItem);  // Delete a specific item by ID

export default router; 
