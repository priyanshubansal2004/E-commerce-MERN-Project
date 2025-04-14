import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//aync thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk(
    "orders/fetchUserOrders",
    async (_ , {rejectWithValue}) =>{
        try{
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders` , {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                },
            });
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data.message || error.message);
        }
    } 
);

//aync thunk to fetch order details by order id
export const fetchOrderDetails = createAsyncThunk(
    "orders/fetchOrderDetails",
    async (orderId , {rejectWithValue}) =>{
        try{
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}` , {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                },
            });
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data.message || error.message);
        }
    } 
);

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        orderDetails: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch orders";
            })
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch order details";
            })
    },
});

export default orderSlice.reducer;