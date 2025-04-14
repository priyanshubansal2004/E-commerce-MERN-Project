import { useState } from "react";
import { Link } from "react-router-dom";
import register from "../../assets/register.webp";
import {registerUser} from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { mergeCarts } from "../../redux/slices/cartSlice";


const Register = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
      const navigate = useNavigate();
      const location = useLocation();
    
      const { user, guestId , loading } = useSelector((state) => state.auth);
      const { cart } = useSelector((state) => state.cart);
    
      const redirect = new URLSearchParams(location.search).get("redirect") || "/";
      const isCheckoutRedirect = redirect.includes("checkout");
    
      // Handle redirect after login and optional cart merge
      useEffect(() => {
        if (user) {
            if (cart?.products?.length > 0 && guestId) {
                  dispatch(mergeCarts({ guestId, user })).then(()=>{
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                  });
                }
                else{
                      navigate(isCheckoutRedirect ? "/checkout" : "/");
                }
            }
        }, [user , guestId , cart , navigate , isCheckoutRedirect , dispatch]);
      

    const handleSubmit = (e)=>{
        e.preventDefault();
        dispatch(registerUser({email, name, password}));
    }

    return (
        <div className="mid-h-screen w-full flex flex-col md:flex-row bg-gray-100">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-20">
                <form className="w-full max-w-md bg-white border-gray-300 p-8 rounded-lg border shadow-sm">
                    <div className="flex justify-center mb-3">
                        <h2 className="text-3xl font-bold text-gray-900">BRAND</h2>
                    </div>
                    <p className="text-center mb-6 text-gray-600">Create Your Account</p>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Name</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Enter your email address"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" onClick={handleSubmit} className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                    {loading ? "loading..." :"Sign Up" }
                    </button>

                    <p className="mt-6 text-center text-sm">
                        Already have an account? 
                        <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-black font-semibold hover:underline ml-1">Login</Link>
                    </p>
                </form>
            </div>

            {/* Right Side - Image */}
            <div className="hidden md:block w-1/2">
                <img 
                    src={register} 
                    alt="Login to Account" 
                    className="w-full h-screen object-cover"
                />
            </div>

        </div>
    );
}

export default Register;
