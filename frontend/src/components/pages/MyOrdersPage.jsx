import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../redux/slices/orderSlice";


const MyOrdersPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {orders , loading , error} = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    const handleRowClick = (orderId)=>{
        navigate(`/order/${orderId}`);
    }

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
    <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">My Orders</h2>
    
    {/* Desktop Table */}
    <div className="hidden md:block shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left text-gray-500 text-sm sm:text-base">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                    <th className="py-2 px-4">Image</th>
                    <th className="py-2 px-4">Order ID</th>
                    <th className="py-2 px-4">Created</th>
                    <th className="py-2 px-4">Shipping Address</th>
                    <th className="py-2 px-4">Items</th>
                    <th className="py-2 px-4">Price</th>
                    <th className="py-2 px-4">Status</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order._id} 
                    onClick={() => handleRowClick(order._id)}
                    className="border-b hover:border-gray-50">
                        <td className="py-2 px-2">
                            <img src={order.orderItems[0]?.image} alt={order.orderItems[0]?.name} className="w-10 h-10 rounded-lg"/>
                        </td>
                        <td className="py-2 px-4">{order._id}</td>
                        <td className="py-2 px-4">{new Date(order.createdAt).toDateString()}</td>
                        <td className="py-2 px-4">{order.shippingAddress.city}, {order.shippingAddress.country}</td>
                        <td className="py-2 px-4">{order.orderItems[0]?.name || "N/A"}</td>
                        <td className="py-2 px-4">${order.totalPrice}</td>
                        <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                                {order.isPaid ? "Paid" : "Pending"}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    {/* Mobile Card View */}
    <div className="md:hidden space-y-4">
        {orders.map((order) => (
            <div 
            onClick={() => handleRowClick(order._id)}
            key={order._id} className="bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center space-x-4">
                    <img src={order.orderItems[0]?.image} alt={order.orderItems[0]?.name} className="w-16 h-16 rounded-lg"/>
                    <div>
                        <p className="text-sm text-gray-600">Order ID: <span className="font-medium">{order._id}</span></p>
                        <p className="text-sm text-gray-600">Created: <span className="font-medium">{new Date(order.createdAt).toDateString()}</span></p>
                        <p className="text-sm text-gray-600">Address: <span className="font-medium">{order.shippingAddress.city}, {order.shippingAddress.country}</span></p>
                        <p className="text-sm text-gray-600">Items: <span className="font-medium">{order.orderItems[0]?.name || "N/A"}</span></p>
                        <p className="text-sm text-gray-600">Price: <span className="font-medium">${order.totalPrice}</span></p>
                        <p className="text-sm">
                            Status: 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                                {order.isPaid ? "Paid" : "Pending"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>

);
};

export default MyOrdersPage;
