import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export const validateCoupon = async (couponCode, user, cartItems) => {
  if (!couponCode || !user?._id || !cartItems?.length) {
    return {
      success: false,
      message: 'Invalid request parameters'
    };
  }

  try {
    const validationResponse = await fetch('https://www.sdrbtechnologies.com/api/coupon/validate-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({
        coupon_code: couponCode,
        user_id: user._id,
        order_value: cartItems.reduce((total, item) => item.productID.price + total, 0),
        product_category: cartItems[0]?.productID?.category || 'SMARTSWITCH',
        products: cartItems.map(item => item.productID._id),
      }),
    });
    
    const data = await validationResponse.json();
    return {
      success: data.is_valid,
      data,
      message: data.message
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error validating coupon'
    };
  }
};

export const redeemCoupon = async (coupon, user, order, cartItems) => {
  if (!coupon || !user?._id || !order?._id || !cartItems?.length) {
    return {
      success: false,
      message: 'Invalid redemption parameters'
    };
  }

  try {
    // Validate coupon again before redeeming
    const validationResult = await validateCoupon(coupon.code, user, cartItems);
    if (!validationResult.success) {
      toast.error('Coupon is no longer valid: ' + validationResult.message);
      return validationResult;
    }

    const redeemResponse = await fetch('https://www.sdrbtechnologies.com/api/coupon/redeem-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({
        coupon_code: coupon.code,
        user_id: user._id,
        order_id: order._id,
        order_value: cartItems.reduce((total, item) => item.productID.price + total, 0),
        product_category: cartItems[0]?.productID?.category || 'SMARTSWITCH',
        products: cartItems.map(item => item.productID._id),
      }),
    });
    
    const data = await redeemResponse.json();
    if (!data.is_redeemed) {
      toast.warning('Coupon redemption failed: ' + data.message);
    }
    
    return {
      success: data.is_redeemed,
      data,
      message: data.message
    };
  } catch (error) {
    console.error('Error redeeming coupon:', error);
    toast.warning('Error redeeming coupon. Please contact support.');
    return {
      success: false,
      message: error.response?.data?.message || 'Error redeeming coupon'
    };
  }
};
