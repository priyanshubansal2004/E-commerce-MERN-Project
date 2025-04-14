import React from 'react';
import { HiShoppingBag, HiRefresh, HiShieldCheck } from "react-icons/hi";

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        
        {/* Feature 1: Free Shipping */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4 bg-gray-100">
            <HiShoppingBag className="text-xl" />
          </div>
          <h4 className="tracking-tighter mb-2 font-semibold">FREE INTERNATIONAL SHIPPING</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            On all orders over $100.00
          </p>
        </div>

        {/* Feature 2: Easy Returns */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4 bg-gray-100">
            <HiRefresh className="text-xl" />
          </div>
          <h4 className="tracking-tighter mb-2 font-semibold">EASY RETURNS</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            30-day hassle-free returns
          </p>
        </div>

        {/* Feature 3: Secure Payment */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4 bg-gray-100">
            <HiShieldCheck className="text-xl" />
          </div>
          <h4 className="tracking-tighter mb-2 font-semibold">SECURE PAYMENT</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            100% safe and secure checkout
          </p>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
