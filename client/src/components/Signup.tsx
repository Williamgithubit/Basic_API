import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useReduxAuth from '../store/hooks/useReduxAuth';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'customer' | 'owner',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  
  // Use Redux auth hook instead of context
  const { register, isLoading: loading, error: reduxError } = useReduxAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: 'customer' | 'owner') => {
    setFormData({ ...formData, role });
  };

  // Update error state when Redux error changes
  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
    }
  }, [reduxError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    try {
      // Map the form data to match the RegisterData interface expected by the register function
      await register({
        firstName: formData.name, // Map name to firstName
        lastName: '', // Provide a default value for lastName
        email: formData.email,
        password: formData.password,
      });
      
      // Show success message and toast
      setSuccess('Account created successfully! Redirecting to login page...');
      toast.success('Account created successfully!');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Your account has been created successfully! Please log in with your credentials.', 
            email: formData.email 
          } 
        });
      }, 2000);
      
    } catch (err: any) {
      // Show error toast
      toast.error(err instanceof Error ? err.message : 'Registration failed');
      // Error is already handled by the Redux hook and displayed via the error state
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left section with background */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-blue-700 text-white relative">
        <div className="absolute inset-0 bg-black opacity-30 z-10" />
        <div className="z-20 p-10 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Car Rental Platform</h2>
          <p className="text-lg">Rent or list cars easily with secure transactions.</p>
        </div>
      </div>

      {/* Right section with form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Create Your Account
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
              {success}
            </div>
          )}
   {/* Role Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">I want to:</label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange('customer')}
                  className={`flex-1 py-2 rounded-md font-medium transition ${
                    formData.role === 'customer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Rent Cars
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('owner')}
                  className={`flex-1 py-2 rounded-md font-medium transition ${
                    formData.role === 'owner'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  List Cars
                </button>
              </div>
            </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <label className="text-sm font-medium">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            <p className="text-center text-sm mt-3">
              Already have an account?{' '}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Log in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
