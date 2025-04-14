import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import login from "../../assets/login.webp";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { mergeCarts } from "../../redux/slices/cartSlice";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId , loading} = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  // Handle redirect after login and optional cart merge
  useEffect(() => {
    if (user) {
      const handleCartMergeAndRedirect = async () => {
        if (cart?.products?.length > 0 && guestId) {
          try {
            await dispatch(mergeCarts({ guestId, user })).unwrap();
          } catch (err) {
            console.error("Cart merge failed:", err);
          }
        }
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      };

      handleCartMergeAndRedirect();
    }
  }, [user]);

  // Handle login form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="mid-h-screen w-full flex flex-col md:flex-row bg-gray-100">
      {/* Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-20">
        <form
          className="w-full max-w-md bg-white border-gray-300 p-8 rounded-lg border shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center mb-3">
            <h2 className="text-3xl font-bold text-gray-900">BRAND</h2>
          </div>
          <p className="text-center mb-6 text-gray-600">
            Enter your email and password to login
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Enter your email address"
              required
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
              required
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {loading ? "loading..." :"Sign In" }
          </button>

          <p className="mt-6 text-center text-sm">
            Don't have an account?
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-black font-semibold hover:underline ml-1"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side Image */}
      <div className="hidden md:block w-1/2">
        <img
          src={login}
          alt="Login to Account"
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
