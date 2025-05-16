import Joi from "joi";

export const createCouponSchema = Joi.object({
  code: Joi.string()
    .required()
    .pattern(/^[A-Z0-9_-]+$/)
    .messages({
      'string.pattern.base': 'Coupon code can only contain uppercase letters, numbers, hyphens and underscores'
    }),
  description: Joi.string().required().min(10),
  discountType: Joi.string().valid('PERCENTAGE', 'FIXED', 'FREE_SHIPPING').required(),
  discountValue: Joi.number()
    .required()
    .when('discountType', {
      is: 'PERCENTAGE',
      then: Joi.number().min(0).max(100)
    }),
  minOrderValue: Joi.number().required().min(0),
  startDate: Joi.date().greater('now').required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  usageLimit: Joi.number().integer().min(1).required(),
  userUsageLimit: Joi.number().integer().min(1).required(),
  productCategories: Joi.array()
    .items(Joi.string().valid('RETROFIT', 'SMARTSWITCH', 'SECURITY'))
    .min(1)
    .required(),
  isActive: Joi.boolean().default(true),
});

export const updateCouponSchema = createCouponSchema.keys({
  id: Joi.string().required()
});
