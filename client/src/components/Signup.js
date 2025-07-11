import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const { signup } = useAuth();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleRoleChange = (role) => {
        setFormData({ ...formData, role });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await signup({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: formData.role,
            });
            // Show success message
            setSuccess('Account created successfully! Redirecting to login page...');
            // Redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Your account has been created successfully! Please log in with your credentials.',
                        email: formData.email
                    }
                });
            }, 2000);
        }
        catch (err) {
            setError(err.message || 'Signup failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen flex", children: [_jsxs("div", { className: "hidden lg:flex flex-col justify-center items-center w-1/2 bg-blue-700 text-white relative", children: [_jsx("div", { className: "absolute inset-0 bg-black opacity-30 z-10" }), _jsxs("div", { className: "z-20 p-10 text-center", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Join Our Car Rental Platform" }), _jsx("p", { className: "text-lg", children: "Rent or list cars easily with secure transactions." })] })] }), _jsx("div", { className: "flex flex-col justify-center items-center w-full lg:w-1/2 p-8 bg-gray-100", children: _jsxs("div", { className: "max-w-md w-full bg-white rounded-2xl shadow-md p-8", children: [_jsx("h2", { className: "text-3xl font-bold text-center text-blue-600 mb-6", children: "Create Your Account" }), error && (_jsx("div", { className: "bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm", children: error })), success && (_jsx("div", { className: "bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm", children: success })), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "I want to:" }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { type: "button", onClick: () => handleRoleChange('customer'), className: `flex-1 py-2 rounded-md font-medium transition ${formData.role === 'customer'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: "Rent Cars" }), _jsx("button", { type: "button", onClick: () => handleRoleChange('owner'), className: `flex-1 py-2 rounded-md font-medium transition ${formData.role === 'owner'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: "List Cars" })] })] }), _jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Full Name" }), _jsx("input", { name: "name", value: formData.name, onChange: handleChange, required: true, className: "w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Email Address" }), _jsx("input", { name: "email", type: "email", value: formData.email, onChange: handleChange, required: true, className: "w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Phone Number" }), _jsx("input", { name: "phone", type: "tel", value: formData.phone, onChange: handleChange, required: true, className: "w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "relative", children: [_jsx("label", { className: "text-sm font-medium", children: "Password" }), _jsx("input", { type: showPassword ? 'text' : 'password', name: "password", required: true, value: formData.password, onChange: handleChange, className: "w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-9 text-gray-500", children: showPassword ? _jsx(FaEyeSlash, {}) : _jsx(FaEye, {}) })] }), _jsxs("div", { className: "relative", children: [_jsx("label", { className: "text-sm font-medium", children: "Confirm Password" }), _jsx("input", { type: showConfirm ? 'text' : 'password', name: "confirmPassword", required: true, value: formData.confirmPassword, onChange: handleChange, className: "w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500" }), _jsx("button", { type: "button", onClick: () => setShowConfirm(!showConfirm), className: "absolute right-3 top-9 text-gray-500", children: showConfirm ? _jsx(FaEyeSlash, {}) : _jsx(FaEye, {}) })] }), _jsx("button", { type: "submit", disabled: loading, className: `w-full py-2 px-4 rounded-md font-medium text-white transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`, children: loading ? 'Signing up...' : 'Sign Up' }), _jsxs("p", { className: "text-center text-sm mt-3", children: ["Already have an account?", ' ', _jsx("span", { className: "text-blue-600 hover:underline cursor-pointer", onClick: () => navigate('/login'), children: "Log in" })] })] })] }) })] }));
};
export default Signup;
