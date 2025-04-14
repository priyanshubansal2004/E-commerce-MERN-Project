import React, { useState, useEffect } from 'react';
import { fetchProductDetails } from '../../redux/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updateProduct } from '../../redux/slices/adminProductSlice';
import axios from 'axios';

const EditProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { selectedProduct, loading, error } = useSelector((state) => state.products);

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        sizes: "",
        colors: "",
        images: [],
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (selectedProduct) {
            setProductData({
                ...selectedProduct,
                sizes: selectedProduct.sizes ? selectedProduct.sizes.join(", ") : "",
                colors: selectedProduct.colors ? selectedProduct.colors.join(", ") : "",
            });
        }
    }, [selectedProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append('image', file);
    
        try {
            setUploading(true);
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, { url: data.url, altText: "" }],
            }));
        } catch (error) {
            console.error("Image upload failed: ", error);
        } finally {
            setUploading(false);
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const cleanImages = productData.images.filter(img => img.url && img.url.trim() !== "");
        const formattedData = {
            ...productData,
            sizes: productData.sizes.split(',').map((s) => s.trim()),
            colors: productData.colors.split(',').map((c) => c.trim()),
            images: cleanImages,
        };

        dispatch(updateProduct({ id, productData: formattedData }));
        navigate("/admin/products");
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
            <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Description</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    ></textarea>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Price ($)</label>
                    <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                {/* Count in Stock */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Count in Stock</label>
                    <input
                        type="number"
                        name="countInStock"
                        value={productData.countInStock}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                {/* SKU */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">SKU</label>
                    <input
                        type="text"
                        name="sku"
                        value={productData.sku}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                {/* Sizes */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
                    <input
                        type="text"
                        name="sizes"
                        value={productData.sizes}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Colors (comma-separated)</label>
                    <input
                        type="text"
                        name="colors"
                        value={productData.colors}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                {/* Upload Image */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="w-full border border-gray-300 rounded-md p-2"
                        disabled={uploading}
                    />
                    {uploading && <p className="text-red-500">Uploading...</p>}
                </div>

                {/* Image Preview */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Images</label>
                    <div className="grid grid-cols-2 gap-4">
                        {productData.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={`Product ${index}`}
                                className="w-24 h-24 object-cover rounded-md"
                            />
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                    disabled={uploading}
                >
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProductPage;
