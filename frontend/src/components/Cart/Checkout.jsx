import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import PayPalButton from '../Cart/PayPalButton';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { createCheckout } from '../../redux/slices/checkoutSlice';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const { cart , loading , error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
  const [checkoutId ,setCheckoutId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
    });

    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/");
        }
    }, [cart, navigate]);

    const handleCreateCheckout = async (e) => {
        e.preventDefault();
      
        if (cart && cart.products.length > 0) {
          // Map cart items to match the checkout schema
          const checkoutItems = cart.products.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: parseFloat(item.price),
            quantity: item.quantity || 1,
            size: item.size,
            color: item.color,
          }));
      
          // Dispatch the createCheckout action
          const res = await dispatch(createCheckout({
            checkoutItems,
            shippingAddress,
            paymentMethod: "Paypal",
            totalPrice: cart.totalPrice,
          }));
      
          if (res.payload && res.payload._id) {
            setCheckoutId(res.payload._id);
          }
        }
      };
      

      const handlePaymentSuccess = async (details) => {
        console.log("PAYMENT SUCCESS:", details); // Add this
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
            { paymentStatus: "paid", paymentDetails: details },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              },
            }
          );
      
          await handleFinalizeCheckout(checkoutId);
        } catch (error) {
          console.error("Error in payment success handler:", error);
        }
      };
      
      
      const handleFinalizeCheckout = async (checkoutId) => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              },
            }
          );
          navigate("/order-confirmation");
        } catch (error) {
          console.error("Error finalizing checkout:", error);
        }
      };
      
      
        if (loading) return <p>Loading cart ...</p>;
        if (error) return <p>Error: {error}</p>;
        if (!cart || !cart.products || cart.products.length === 0) {
        return <p>Your cart is empty</p>;
        }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
            {/* Left Section */}
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl uppercase mb-6">Checkout</h2>
                <form onSubmit={handleCreateCheckout}>
                    <h3 className="text-lg mb-4">Contact Details</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input 
                            type="email" 
                            value={user? user.email : ""} 
                            className="w-full p-2 border rounded" 
                            disabled
                        />
                    </div>

                    <h3 className="text-lg mb-4">Delivery</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">First Name</label>
                            <input 
                                type="text"
                                value={shippingAddress.firstName}
                                onChange={(e) => setShippingAddress({ 
                                    ...shippingAddress, firstName: e.target.value 
                                })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Last Name</label>
                            <input 
                                type="text"
                                value={shippingAddress.lastName}
                                onChange={(e) => setShippingAddress({ 
                                    ...shippingAddress, lastName: e.target.value 
                                })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <input 
                            type="text"
                            value={shippingAddress.address}
                            onChange={(e) => setShippingAddress({ 
                                ...shippingAddress, address: e.target.value 
                            })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">City</label>
                            <input 
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) => setShippingAddress({ 
                                    ...shippingAddress, city: e.target.value 
                                })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Postal Code</label>
                            <input 
                                type="text"
                                value={shippingAddress.postalCode}
                                onChange={(e) => setShippingAddress({ 
                                    ...shippingAddress, postalCode: e.target.value 
                                })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Country</label>
                        <input 
                            type="text"
                            value={shippingAddress.country}
                            onChange={(e) => setShippingAddress({ 
                                ...shippingAddress, country: e.target.value 
                            })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div className='mt-6'>
                      {!checkoutId ? (<button 
                          type="submit" 
                          className="w-full bg-black text-white py-2 rounded"
                      >
                          Continue to Payment
                      </button>) : (
                        <div>
                          <h3 className='text-lg mb-4'>Pay with Paypal</h3>
                          <PayPalButton amount={cart.totalPrice} onSuccess={handlePaymentSuccess} onError={(err)=>alert("Payment Failed. Try again.")}/>
                        </div>
                      )}
                      
                    </div>
                    
                </form>
            </div>

            {/* Right Section - Order Summary */}
            <div className="bg-violet-50 rounded-lg p-6">
                <h3 className="text-lg mb-4">Order Summary</h3>
                {cart.products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between mb-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1 ml-4">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">Size: {product.size}</p>
                            <p className="text-sm text-gray-500">Color: {product.color}</p>
                        </div>
                        <p className="font-medium">${product.price}</p>
                    </div>
                ))}

                <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>${cart.totalPrice}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Shipping</span>
                        <span>FREE</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${cart.totalPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
