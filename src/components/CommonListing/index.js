"use client";

import { useRouter } from "next/navigation";
import ProductButton from "./ProductButtons";
import ProductTile from "./ProductTile";
import { useEffect } from "react";
import Notification from "../Notification";

export default function CommonListing({ data }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-x-6">
          {data && data.length ? (
            data.map((item) => (
              <article
                className="group relative bg-white p-2 hover:shadow-lg transition-shadow duration-300 rounded-lg"
                key={item._id}
              >
                <ProductTile item={item} />
                <ProductButton item={item} />
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
      <Notification/>
    </section>
  );
}