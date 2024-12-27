'use client';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { GlobalContext } from '@/context';
import { addToCart } from '@/services/cart';
import ComponentLevelLoader from '../Loader/componentlevel';
import Notification from '../Notification';
import { Heart, Share2, ShoppingBag, Truck, Star, Shield, RotateCcw, Award } from 'lucide-react';

export default function CommonDetails({ item }) {
  const { setComponentLevelLoader, componentLevelLoader, user, setShowCartModal } = useContext(GlobalContext);

  async function handleAddToCart(getItem) {
    setComponentLevelLoader({ loading: true, id: '' });
    const res = await addToCart({ productID: getItem._id, userID: user._id });

    if (res.success) {
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: '' });
      setShowCartModal(true);
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: '' });
      setShowCartModal(true);
    }
  }

  return (
    <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images and Buttons */}
          <div className="lg:w-[40%]">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg p-4 shadow-md">
                {/* Main Image */}
                <div className="relative mb-4">
                  <img
                    src={item?.imageUrl}
                    className="w-full aspect-square object-cover rounded-lg"
                    alt={item?.name}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors duration-200">
                      <Heart className="w-6 h-6 text-gray-600 hover:text-red-500" />
                    </button>
                    <button className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors duration-200">
                      <Share2 className="w-6 h-6 text-gray-600 hover:text-blue-500" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail Images */}
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3].map((_, index) => (
                    <button
                      key={index}
                      className="w-20 h-20 border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500"
                    >
                      <img
                        src={item?.imageUrl}
                        className="w-full h-full object-cover"
                        alt={`${item?.name} view ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
  <button
    onClick={() => handleAddToCart(item)}
    className="flex-1 flex items-center justify-center gap-2 bg-[#FF9F00] hover:bg-[#F39000] px-6 py-4 text-white rounded-lg font-medium transition-colors duration-200"
  >
    {componentLevelLoader && componentLevelLoader.loading ? (
      <ComponentLevelLoader text={'Adding to Cart'} color={'#ffffff'} loading={componentLevelLoader?.loading} />
    ) : (
      <>
        <ShoppingBag className="w-5 h-5" />
        <span>ADD TO CART</span>
      </>
    )}
  </button>
  <button
    onClick={() => {
      handleAddToCart(item); // Add to cart
      // Navigate to checkout or perform the "BUY NOW" action
      navigateToCheckout(); // Replace this with your actual navigation or logic
    }}
    className="flex-1 flex items-center justify-center bg-[#FB641B] hover:bg-[#E85D19] px-6 py-4 text-white rounded-lg font-medium transition-colors duration-200"
  >
    {componentLevelLoader && componentLevelLoader.loading ? (
      <ComponentLevelLoader text={'Processing'} color={'#ffffff'} loading={componentLevelLoader?.loading} />
    ) : (
      <span>BUY NOW</span>
    )}
  </button>
</div>

              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:w-[60%]">
            <div className="bg-white rounded-lg p-6 shadow-md">
              {/* Brand & Title */}
              <div className="mb-4">
                <span className="text-sm text-blue-600 font-medium">Premium Product</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">{item?.name}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded">
                  <span className="font-bold mr-1">4.5</span>
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="ml-2 text-gray-500">(2,345 ratings)</span>
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-baseline gap-2">
                  {item?.onSale === 'yes' && (
                    <span className="text-2xl font-bold text-green-600">
                      ₹{(item.price - item.price * (item.priceDrop / 100)).toFixed(2)}
                    </span>
                  )}
                  <span className={`text-xl ${item?.onSale === 'yes' ? 'line-through text-gray-400' : 'text-gray-900 font-bold'}`}>
                    ₹{item?.price}
                  </span>
                  {item?.onSale === 'yes' && (
                    <span className="text-green-600 font-medium">{item.priceDrop}% off</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Offers */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Available Offers</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <Award className="w-4 h-4 text-green-500 mr-2" />
                    <span>Bank Offer 5% Unlimited Cashback on Flipkart Axis Bank Credit Card</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Award className="w-4 h-4 text-green-500 mr-2" />
                    <span>Special Price Get extra ₹3000 off (price inclusive of discount)</span>
                  </li>
                </ul>
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-500">{item?.deliveryInfo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">7 Days Replacement</p>
                    <p className="text-sm text-gray-500">Easy returns & exchanges</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">1 Year Warranty</p>
                    <p className="text-sm text-gray-500">Brand warranty included</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {item?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </section>
  );
}