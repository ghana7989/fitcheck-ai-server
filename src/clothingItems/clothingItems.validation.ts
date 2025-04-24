import Joi from 'joi';

// Schema for creating a new clothing item
export const createItemSchema = Joi.object({
  imageUrl: Joi.string().required(),
  type: Joi.string().required(),
  color: Joi.string().required(),
  fabric: Joi.string().required(),
  occasionTags: Joi.array().items(Joi.string()).optional(),
  seasonTags: Joi.array().items(Joi.string()).optional(),
  weatherFit: Joi.array().items(Joi.string()).optional(),
  styleTags: Joi.array().items(Joi.string()).optional(),
});

// Schema for item ID parameter validation
export const itemIdParamSchema = Joi.object({
  id: Joi.string().required()
});

// Schema for searching clothing items
export const searchItemsQuerySchema = Joi.object({
  type: Joi.string().optional(),
  color: Joi.string().optional(),
  fabric: Joi.string().optional(),
  occasionTags: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional(),
  seasonTags: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional(),
  weatherFit: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional(),
  styleTags: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).optional(),
}); 
