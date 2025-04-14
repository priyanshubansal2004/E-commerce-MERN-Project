import {createSlice , createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';

//fetch all orders(admin only)
export const fetchAllOrders = createAsyncThunk("admin/fetchAllOrders" , async (_, { rejectWithValue }) => {
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders` , {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            },
        });
        return response.data;
    }catch(error){
        return rejectWithValue(error.response.data.message || error.message);
    }
});

//updating the order delivery status
export const updateOrderStatus = createAsyncThunk("admin/updateOrderStatus" , async ({id , status} , {rejectWithValue}) => {
    try{
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}` , {status} , {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            },
        });
        return response.data;
    }catch(error){
        return rejectWithValue(error.response.data.message || error.message);
    }
});

//delete order
export const deleteOrder = createAsyncThunk("admin/deleteOrder" , async (id , {rejectWithValue}) => {
    try{
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}` , {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            },
        });
        return id;
    }catch(error){
        return rejectWithValue(error.response.data.message || error.message);
    }
});

const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;

                state.totalOrders = action.payload.length;
                state.totalSales = action.payload.reduce((acc, order) => acc + order.totalPrice, 0);
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch orders";
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if(index !== -1){
                    state.orders[index] = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update order status";
            })
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter(order => order._id !== action.payload);
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete order";
            });
    },
});

export default adminOrderSlice.reducer;