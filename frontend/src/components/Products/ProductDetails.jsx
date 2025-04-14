import React, { useEffect, useState } from 'react';
import {toast} from 'react-hot-toast';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';

const ProductDetails = ({productId}) => {

  const {id} = useParams();
  const dispatch = useDispatch();
  const {selectedProduct ,loading , error, similarProducts} = useSelector((state) => state.products);
  const {userId , guestId} = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState(null);
  const[selectedSize , setSelectedSize] = useState("");
  const[selectedColor , setSelectedColor] = useState("");
  const[quantity , setQuantity] = useState(1);
  const[isButtonDisabled , setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({id : productFetchId}));
    }
  }, [dispatch, productFetchId]);

  useEffect(()=>{
    window.scrollTo(0, 0);
    if(selectedProduct?.images?.length > 0){
        setMainImage(selectedProduct.images[0].url)
    }
  } , [selectedProduct])

  

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a Size and Color before adding to cart");
      return;
    }
  
    setIsButtonDisabled(true);
  
    try {
      await dispatch(addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId,
      }));
      toast.success("Product added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
      console.error("Add to cart error:", err);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  if (loading) {
    return <p>loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="p-6">
      {selectedProduct && (
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                onClick={()=> setMainImage(image.url)}
              />
            ))}
          </div>
          {/*main image */}
          <div className='md:w-1/2'>
            <div className='mb-4'>
                <img src={mainImage} alt="Main Product"
                className='w-full h-auto object-cover rounded-lg' />
            </div>
          </div>

          {/*mobile view */}
          <div className='md:hidden flex overscroll-x-scroll space-x-4 mb-4'>
          {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-300"}`}
                onClick={()=> setMainImage(image.url)}
              />
            ))}
          </div>

          {/*right section */}
        <div className="md:w-1/2 md:ml-10">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            {selectedProduct.name}
        </h1>
        
        <p className="text-xl text-gray-500 mb-2">
            ${selectedProduct.price}
        </p>

        {selectedProduct.originalPrice && (
            <p className="text-lg text-gray-600 mb-1 line-through">
            ${selectedProduct.originalPrice}
            </p>
        )}

        <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

        {/* Color Options */}
        <div className="mb-4">
            <p className="text-gray-700">Color:</p>
            <div className="flex gap-2 mt-2">
            {selectedProduct.colors.map((color) => (
                <button
                key={color}
                onClick={()=>setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border ${selectedColor === color ? "border-black" : "border-gray-300"}`}
                style={{
                    backgroundColor: color.toLowerCase(),
                    filter: "brightness(0.9)",
                }}
                />
            ))}
            </div>
        </div>

        {/* Size Options */}
        <div className="mb-4">
            <p className="text-gray-700">Size:</p>
            <div className="flex gap-2 mt-2">
            {selectedProduct.sizes.map((size) => (
                <button 
                key={size} 
                onClick={()=>setSelectedSize(size)}
                className={`px-4 py-2 rounded border ${selectedSize === size ? "bg-black text-white" : ""}`}>
                {size}
                </button>
            ))}
            </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
            <p className="text-gray-700">Quantity:</p>
            <div className="flex items-center space-x-4 mt-2">
                <button 
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-2 py-1 bg-gray-200 rounded text-lg">
                -
                </button>
                <span className="text-lg">{quantity}</span>
                <button 
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-2 py-1 bg-gray-200 rounded text-lg">
                +
                </button>
            </div>
        </div>

        {/* Add to Cart Button */}
        <button 
        onClick={handleAddToCart}
        disabled = {isButtonDisabled}
        className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${isButtonDisabled? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"}`}>
            {isButtonDisabled ? "Adding..."  : "ADD TO CART"}
        </button>

        {/* Product Details Table */}
        <div className="mt-10 text-gray-700">
            <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
            <table className="w-full text-left text-sm text-gray-600">
            <tbody>
                <tr>
                <td className="py-1">Brand</td>
                <td className="py-1">{selectedProduct.brand}</td>
                </tr>
                <tr>
                <td className="py-1">Material</td>
                <td className="py-1">{selectedProduct.material}</td>
                </tr>
            </tbody>
            </table>
        </div>
        </div>
      </div>

      {/*Product Grid */}
      <div className="mt-20">
        <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
        <ProductGrid products={similarProducts} loading={loading} error={error}/>
      </div>

    </div>
    )}
  </div>
  );
};

export default ProductDetails;
