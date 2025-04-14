import React from 'react';
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { updateCartItemQuantity, removeFromCart } from '../../redux/slices/cartSlice';


const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleAddToCart = ({ productId, delta, quantity, size, color }) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(updateCartItemQuantity({
        productId,
        quantity: newQuantity,
        size,
        color,
        guestId,
        userId,
      }));
    }
  };

  const handleRemoveFromCart = ({ productId, size, color }) => {
    console.log(productId);
    dispatch(removeFromCart({
      productId,
      size,
      color,
      guestId,
      userId,
    }));
  };

  return (
    <div>
      {cart.products.map((product, index) => (
        <div key={index} className="flex items-start justify-between py-4 border-b">
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3>{product.name}</h3>
              <p className="text-sm text-gray-500">
                Size: {product.size} | Color: {product.color}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    handleAddToCart({
                      productId: product.productId,
                      delta: -1,
                      quantity: product.quantity,
                      size: product.size,
                      color: product.color,
                    })
                  }
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleAddToCart({
                      productId: product.productId,
                      delta: 1,
                      quantity: product.quantity,
                      size: product.size,
                      color: product.color,
                    })
                  }
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p>${product.price.toLocaleString()}</p>
            <button
              onClick={() =>
                handleRemoveFromCart({
                  productId: product.productId,
                  size: product.size,
                  color: product.color,
                })
              }
              className="flex items-center justify-center mt-2"
            >
              <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
