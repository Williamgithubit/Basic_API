import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Login.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const state = location.state;
        if (state?.message) {
            setSuccessMessage(state.message);
            if (state.email) {
                setEmail(state.email);
            }
            // Clear the state to prevent showing the message again on refresh
            window.history.replaceState({}, document.title);
        }
        // Check for remembered email
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, [location]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            // Handle remember me functionality
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            }
            else {
                localStorage.removeItem("rememberedEmail");
            }
            // Redirect to the intended URL or dashboard
            const redirectTo = location.state?.redirectTo || "/dashboard";
            navigate(redirectTo);
            toast.success("Login successful!");
        }
        catch (err) {
            setError(err.message || "Failed to login");
        }
        finally {
            setLoading(false);
        }
    };
    const handleSignupRedirect = () => {
        navigate("/signup");
    };
    const handleHomeRedirect = () => {
        navigate("/");
    };
    const handleForgotPassword = () => {
        // Optional: navigate to your forgot password page
        navigate("");
    };
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100 px-4", children: _jsxs("div", { className: "max-w-md w-full bg-white p-8 rounded-2xl shadow-lg", children: [_jsx("h2", { className: "text-3xl font-bold text-center text-blue-600 mb-6", children: "Sign In to Your Account" }), error && (_jsx("div", { className: "bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm", children: error })), successMessage && (_jsx("div", { className: "bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm", children: successMessage })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Email Address" }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "relative", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsx("input", { type: showPassword ? "text" : "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-9 text-gray-500", children: showPassword ? _jsx(FaEyeSlash, {}) : _jsx(FaEye, {}) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { className: "flex items-center space-x-2 text-sm text-gray-600", children: [_jsx("input", { type: "checkbox", checked: rememberMe, onChange: () => setRememberMe((prev) => !prev) }), _jsx("span", { children: "Remember me" })] }), _jsx("button", { type: "button", onClick: handleForgotPassword, className: "text-sm text-blue-600 hover:underline cursor-pointer", children: "Forgot password?" })] }), _jsx("button", { type: "submit", disabled: loading, className: `w-full py-2 px-4 rounded-md font-medium text-white transition cursor-pointer ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"}`, children: loading ? "Logging in..." : "Login" }), _jsxs("p", { className: "text-center text-sm mt-3", children: ["Don\u2019t have an account?", " ", _jsx("button", { type: "button", onClick: handleSignupRedirect, className: "text-blue-600 hover:underline cursor-pointer", children: "Sign up" }), _jsx("br", {}), "or", _jsx("br", {}), _jsx("button", { type: "button", onClick: handleHomeRedirect, className: "text-blue-600 hover:underline ml-1 cursor-pointer", children: "Go to Home" })] })] })] }) }));
};
export default Login;
