export function validateCoupon(couponCode, user, cartItems) {
  const errors = [];

  if (!couponCode) {
    errors.push('Please enter a coupon code');
  }

  if (!cartItems?.length) {
    errors.push('Your cart is empty');
  }

  if (!user?._id) {
    errors.push('You must be logged in to use coupons');
  }

  const orderValue = cartItems?.reduce((total, item) => item.productID.price + total, 0) || 0;
  if (orderValue <= 0) {
    errors.push('Invalid order value');
  }

  return {
    isValid: errors.length === 0,
    errors,
    orderValue,
    productCategory: cartItems?.[0]?.productID?.category || 'SMARTSWITCH',
    products: cartItems?.map(item => item.productID._id) || []
  };
}

export function calculateDiscount(discountType, discountValue, orderValue) {
  switch (discountType) {
    case 'PERCENTAGE':
      return Math.min((orderValue * discountValue) / 100, orderValue);
    case 'FIXED':
      return Math.min(discountValue, orderValue);
    case 'FREE_SHIPPING':
      return 0; // Handle free shipping if you have shipping costs
    default:
      return 0;
  }
}
