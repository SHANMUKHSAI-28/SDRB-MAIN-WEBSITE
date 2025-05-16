import mongoose from "mongoose";

// Define a schema for coupon usage tracking
const CouponUsageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  usedAt: {
    type: Date,
    default: Date.now
  },
  discountAmount: {
    type: Number,
    required: true
  }
});

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  discountType: {
    type: String,
    enum: {
      values: ['PERCENTAGE', 'FIXED', 'FREE_SHIPPING'],
      message: '{VALUE} is not a valid discount type'
    },
    required: [true, 'Discount type is required']
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative'],
    validate: {
      validator: function(v) {
        return this.discountType !== 'PERCENTAGE' || v <= 100;
      },
      message: 'Percentage discount cannot exceed 100%'
    }
  },
  minOrderValue: {
    type: Number,
    required: [true, 'Minimum order value is required'],
    min: [0, 'Minimum order value cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(v) {
        return v >= new Date();
      },
      message: 'Start date must be in the future'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(v) {
        return !this.startDate || v > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  usageLimit: {
    type: Number,
    required: [true, 'Usage limit is required'],
    min: [1, 'Usage limit must be at least 1']
  },
  userUsageLimit: {
    type: Number,
    required: [true, 'Per user usage limit is required'],
    min: [1, 'Per user usage limit must be at least 1']
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  productCategories: [{
    type: String,
    enum: {
      values: ['RETROFIT', 'SMARTSWITCH', 'SECURITY'],
      message: '{VALUE} is not a valid product category'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  usage: [CouponUsageSchema]
}, {
  timestamps: true
});

// Virtual field to check if coupon is expired
CouponSchema.virtual('isExpired').get(function() {
  return this.endDate < new Date();
});

// Virtual field to check if coupon has reached usage limit
CouponSchema.virtual('isMaxedOut').get(function() {
  return this.usedCount >= this.usageLimit;
});

// Instance method to validate a coupon for a specific order
CouponSchema.methods.validateForOrder = function(orderValue, userId, productCategories) {
  if (!this.isActive) {
    throw new Error('This coupon is not active');
  }

  if (this.isExpired) {
    throw new Error('This coupon has expired');
  }

  if (this.isMaxedOut) {
    throw new Error('This coupon has reached its usage limit');
  }

  if (orderValue < this.minOrderValue) {
    throw new Error(`Order must be at least ₹${this.minOrderValue} to use this coupon`);
  }

  // Check if user has already used this coupon maximum times
  const userUsageCount = this.usage.filter(u => u.user.toString() === userId.toString()).length;
  if (userUsageCount >= this.userUsageLimit) {
    throw new Error(`You have already used this coupon ${this.userUsageLimit} times`);
  }

  // Check if at least one product category matches
  if (this.productCategories.length > 0 && productCategories.length > 0) {
    const hasMatchingCategory = this.productCategories.some(category => 
      productCategories.includes(category)
    );
    if (!hasMatchingCategory) {
      throw new Error('This coupon is not valid for the selected products');
    }
  }

  return true;
};

// Calculate discount amount
CouponSchema.methods.calculateDiscount = function(orderValue) {
  switch (this.discountType) {
    case 'PERCENTAGE':
      return (orderValue * this.discountValue) / 100;
    case 'FIXED':
      return Math.min(this.discountValue, orderValue);
    case 'FREE_SHIPPING':
      return 0; // Implement shipping cost logic here if needed
    default:
      return 0;
  }
};

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

export default Coupon;
