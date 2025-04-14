import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch all users(admin only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers" , async (_, { rejectWithValue }) => {  
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users` , {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            },
        });
        return response.data;
    }catch(error){
        return rejectWithValue(error.response.data.message || error.message);
    }
});

export const addUser = createAsyncThunk("admin/addUser" , async (userData , {rejectWithValue}) => {
    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users` , userData , {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            },
        });
        return response.data;
    }catch(error){
        return rejectWithValue(error.response.data.message || error.message);
    }
});

//update user details
export const updateUser = createAsyncThunk("admin/updateUser" , async ({id,name,email,role} , {rejectWithValue}) => {
    try{
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}` , {name,email,role} , {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            },
        });
        return response.data.user;
    }catch(error){
        return rejectWithValue(error.response.data.message || error.message);
    }
});

//delete user
export const deleteUser = createAsyncThunk("admin/deleteUser" , async (id , {rejectWithValue}) => {
    try{
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}` , {
            headers:{
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            },
        });
        return response.data._id;
    }catch(error){
        return rejectWithValue(error.response.data.message || error.message);
    }
});

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch users";
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload.user);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "Failed to add user";
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload;
                const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
                if (userIndex !== -1) {
                    state.users[userIndex] = updatedUser;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update user";
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state , action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete user";
            });
    },
});

export default adminSlice.reducer;