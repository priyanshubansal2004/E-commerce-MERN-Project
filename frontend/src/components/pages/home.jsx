import React from 'react'
import Hero from '../Layout/Hero'
import GenderCollectionSection from '../Products/GenderCollectionSection'
import NewArrivals from '../Products/NewArrivals'
import ProductDetails from '../Products/ProductDetails'
import ProductGrid from '../Products/ProductGrid'
import FeaturedCollection from '../Products/FeaturedCollection'
import FeaturesSection from '../Products/FeaturesSection'
import { useDispatch, useSelector } from 'react-redux'
import {useEffect} from 'react'
import axios from 'axios'
import { fetchProductsByFilters } from '../../redux/slices/productSlice'

const Home = () => {
  const dispatch = useDispatch();
  const {products , loading , error} = useSelector((state) => state.products || {});
  const [bestSellerProduct , setBestSellerProduct] = React.useState([]);

  useEffect(() => {
    dispatch(fetchProductsByFilters({
      gender:"Women",
      category:"Bottom Wear",
      limit : 8,
    }));

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    }

    fetchBestSeller();

  }, [dispatch]);

  return (
    <div>
    <Hero />
    <GenderCollectionSection />
    <NewArrivals />

    <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
    {bestSellerProduct ? (
      <ProductDetails productId={bestSellerProduct?._id} />
    ) : (
      <p className='text-center'>Loading best seller products ...</p>
    )}

    <div className='container mx-auto'>
      <h2 className='text-3xl text-center font-bold mb-4'>
        Top Wears for Women
      </h2>
      <ProductGrid products={products} loading={loading} error={error} />
    </div>

    <FeaturedCollection />
    <FeaturesSection />
  </div>
  )
}

export default Home;
