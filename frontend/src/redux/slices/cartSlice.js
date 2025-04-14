import { createSlice , createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

//Helper function to load cart from local storage
const loadCartFromLocalStorage = () => {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : {products:[]};
};

//Helper function to save cart to local storage
const saveCartToLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

//Fetch cart from a user or guest
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async ({userId , guestId}) => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart` , {
            params: {
                userId,
                guestId,
            },
        });
        return response.data;
    }
);

//Add an item to the cart for a user or guest
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({productId , quantity , size , color , guestId , userId } , {rejectWithValue}) => {
        try{
            
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart` , {
            productId,
            quantity,
            size,
            color,
            guestId,
            userId,
        });
        return response.data;
        }catch(error){
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

//update the quantity of an item in the cart for a user or guest
export const updateCartItemQuantity = createAsyncThunk(
    'cart/updateCartItemQuantity',
    async ({productId , quantity , size , color , guestId , userId } , {rejectWithValue}) => {
        try{
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart` , {
                productId,
                quantity,
                size,
                color,
                guestId,
                userId,
            });
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

//remove an item from the cart for a user or guest
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async ({productId , size , color , guestId , userId } , {rejectWithValue}) => {
        try{
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart` , {
                data: {
                    productId,
                    size,
                    color,
                    guestId,
                    userId,
                },
            });
            return response.data;
        }catch(error){
            return rejectWithValue(error.response.data.message || error.message);
        }
    }
);

//merge the cart of a user and guest
export const mergeCarts = createAsyncThunk(
    'cart/mergeCart',
    async ({ userId, guestId }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('userToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };
  
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
          { userId, guestId },
          config
        );
  
        return response.data;
      } catch (error) {
        console.error("Cart merge failed: ", error);
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  ;

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart : loadCartFromLocalStorage(),
        loading : false,
        error : null,
    },
    reducers: {
        clearCart: (state) => {
            state.cart = {products:[]};
            localStorage.removeItem('cart');
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(fetchCart.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload;
            saveCartToLocalStorage(action.payload);
        }).addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to fetch cart";
        }).addCase(addToCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(addToCart.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload;
            saveCartToLocalStorage(action.payload);
        }).addCase(addToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to add item to cart";
        }).addCase(updateCartItemQuantity.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(updateCartItemQuantity.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload;
            saveCartToLocalStorage(action.payload);
        }).addCase(updateCartItemQuantity.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to update item in cart";
        }).addCase(removeFromCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(removeFromCart.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload;
            saveCartToLocalStorage(action.payload);
        }).addCase(removeFromCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to remove item";
        }).addCase(mergeCarts.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(mergeCarts.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload;
            saveCartToLocalStorage(action.payload);
        }).addCase(mergeCarts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to merge cart";
        })
    },
});

export const {clearCart} = cartSlice.actions;
export default cartSlice.reducer;