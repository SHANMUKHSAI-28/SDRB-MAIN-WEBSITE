'use client';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { GlobalContext } from '@/context';
import { addToCart } from '@/services/cart';
import ComponentLevelLoader from '../Loader/componentlevel';
import Notification from '../Notification';
import { Heart, Share2, ShoppingBag, Truck } from 'lucide-react';

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
    <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3 lg:row-end-1">
            <div className="lg:flex lg:items-start">
              <div className="lg:order-2 lg:ml-5 flex-1">
                <div className="overflow-hidden rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
                  <img
                    src={item.imageUrl}
                    className="h-full w-full max-w-full object-cover transform hover:scale-105 transition-transform duration-500"
                    alt="Product Details"
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 transition-colors duration-200" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <Share2 className="w-6 h-6 text-gray-600 hover:text-blue-500 transition-colors duration-200" />
                  </button>
                </div>
              </div>
              <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
                <div className="flex flex-row items-start lg:flex-col space-x-2 lg:space-x-0">
                  {[1, 2, 3].map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-200 hover:border-black transition-colors duration-200"
                    >
                      <img
                        src={item.imageUrl}
                        className="h-full w-full object-cover hover:opacity-75 transition-opacity duration-200"
                        alt={`Product view ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{item?.name}</h1>
                
                <div className="mt-6 flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">Price</span>
                    <div className="flex items-baseline space-x-2">
                      <h1 className={`text-4xl font-bold ${item.onSale === 'yes' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        ₹{item?.price}
                      </h1>
                      {item.onSale === 'yes' && (
                        <h1 className="text-4xl font-bold text-red-600">
                          ₹{(item.price - item.price * (item.priceDrop / 100)).toFixed(2)}
                        </h1>
                      )}
                    </div>
                  </div>
                  {item.onSale === 'yes' && (
                    <span className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-full">
                      {item.priceDrop}% OFF
                    </span>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className="w-full flex items-center justify-center space-x-2 bg-black hover:bg-gray-900 px-6 py-4 text-sm font-medium tracking-wide uppercase text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    {componentLevelLoader && componentLevelLoader.loading ? (
                      <ComponentLevelLoader text={'Adding to Cart'} color={'#ffffff'} loading={componentLevelLoader?.loading} />
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Truck className="w-5 h-5" />
                    <span className="text-sm">{item?.deliveryInfo}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <span className="w-5 h-5">↺</span>
                    <span className="text-sm">Cancel anytime</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 border-t border-gray-200 pt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
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