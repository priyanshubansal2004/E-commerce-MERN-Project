import React from 'react'
import { NavLink } from "react-router-dom";
import { FaUser, FaBoxOpen, FaShoppingCart, FaStore, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const AdminSidebar = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        navigate("/");
    }
    return (
        <div className="bg-gray-900 text-white h-screen w-64 p-6">
            <div className="mb-6">
                <NavLink to="/admin" className="text-2xl font-medium">
                    BRAND
                </NavLink>
            </div>

            <h2 className="text-xl font-medium mb-6 text-center">Admin Dashboard</h2>

            <nav className="flex flex-col space-y-2">
                <NavLink to="/admin/users" className={({ isActive }) => 
                    isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : 
                    "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
                    <FaUser />
                    <span>Users</span>
                </NavLink>

                <NavLink to="/admin/products" className={({ isActive }) => 
                    isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : 
                    "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
                    <FaBoxOpen />
                    <span>Products</span>
                </NavLink>

                <NavLink to="/admin/orders" className={({ isActive }) => 
                    isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : 
                    "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
                    <FaShoppingCart />
                    <span>Orders</span>
                </NavLink>

                <NavLink to="/" className={({ isActive }) => 
                    isActive ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : 
                    "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
                    <FaStore />
                    <span>Shop</span>
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 py-3 px-4 rounded flex items-center space-x-2 mt-4 text-white"
                    >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>

            </nav>
        </div>
    );
}

export default AdminSidebar


