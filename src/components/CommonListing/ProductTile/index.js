"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export default function ProductTile({ item }) {
  const router = useRouter();
  
  const discountedPrice = item.onSale === "yes" 
    ? (item.price - (item.price * (item.priceDrop / 100))).toFixed(2)
    : item.price;
  
  return (
    <div 
      onClick={() => router.push(`/product/${item._id}`)}
      className="group relative flex flex-col"
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        {item.onSale === "yes" && (
          <div className="absolute top-2 left-2">
            <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              {item.priceDrop}% OFF
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-2 px-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-black">
          {item.name}
        </h3>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded">
            <span className="text-sm font-medium text-green-700">4.5</span>
            <Star className="h-3.5 w-3.5 text-green-700 fill-green-700 ml-0.5" />
          </div>
          <span className="text-xs text-gray-500">(210)</span>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-gray-900">
            ₹{discountedPrice}
          </p>
          {item.onSale === "yes" && (
            <>
              <p className="text-sm text-gray-500 line-through">
                ₹{item.price}
              </p>
              <p className="text-sm font-medium text-green-600">
                {item.priceDrop}% off
              </p>
            </>
          )}
        </div>
        
        <p className="text-xs text-green-600 font-medium">Free Delivery</p>
      </div>
    </div>
  );
}