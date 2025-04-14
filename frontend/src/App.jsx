import React from 'react'
import {BrowserRouter , Route , Routes} from "react-router-dom";
import UserLayout from './components/Layout/UserLayout';
import Home from './components/pages/home';
import {Toaster} from 'react-hot-toast';
import Login from './components/pages/Login';
import Resgister from './components/pages/Resgister';
import Profile from './components/pages/Profile';
import CollectionPage from './components/pages/CollectionPage';
import ProductDetails from './components/Products/ProductDetails';
import Checkout from './components/Cart/Checkout';
import OrderConfirmationPage from './components/pages/OrderConfirmationPage';
import OrderDetailsPage from './components/pages/OrderDetailsPage';
import MyOrdersPage from './components/pages/MyOrdersPage';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomePage from './components/pages/AdminHomePage';
import UserManagement from './components/Admin/UserManagement';
import ProductManagement from './components/Admin/ProductManagement';
import EditProductPage from './components/Admin/EditProductPage';
import OrderManagement from './components/Admin/OrderManagement';


import {Provider} from 'react-redux';
import store from './redux/store';
import ProtectedRoute from './components/Common/ProtectedRoute';

const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter future={{v7_startTransition:true , v7_relativeSplatPath:true}}>
    <Toaster position='top-right'></Toaster>
      <Routes>
        <Route path='/' element={<UserLayout/>}>
          <Route index element={<Home/>}></Route>
          <Route path='login' element={<Login/>} />
          <Route path='register' element={<Resgister/>} />
          <Route path='profile' element={<Profile/>} />
          <Route path='collections/:collection' element={<CollectionPage/>} />
          <Route path='product/:id' element={<ProductDetails/>}/>
          <Route path='checkout' element={<Checkout/>}/>
          <Route path='order-confirmation' element={<OrderConfirmationPage/>}/>
          <Route path='order/:id' element={<OrderDetailsPage/>}/>
          <Route path='my-orders' element={<MyOrdersPage/>}/>
        </Route>
        <Route path='/admin' element={<ProtectedRoute role="admin"><AdminLayout/></ProtectedRoute>}>
          <Route index element={<AdminHomePage/>}/>
          <Route path='users' element={<UserManagement/>}/>
          <Route path='products' element={<ProductManagement/>}/>
          <Route path='products/:id/edit' element={<EditProductPage/>}/>
          <Route path='orders' element={<OrderManagement/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App
