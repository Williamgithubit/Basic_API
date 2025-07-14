import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery } from '../Auth/authApi';
import { loginStart, loginSuccess, loginFailure, logout } from '../Auth/authSlice';
import { showErrorToast, showSuccessToast } from '../utils/apiUtils';

// Define the User type expected by Redux
interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
}

// Define the API user response type
interface ApiUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Define the API response type
interface AuthResponse {
  user: ApiUser;
  token: string;
}

// Mapper function to transform API user to Redux User
const mapApiUserToUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: `${apiUser.firstName} ${apiUser.lastName}`,
    phone: '', // Default value as it's not provided by the API
    role: apiUser.role
  };
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useReduxAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  
  // RTK Query hooks
  const [loginMutation, loginResult] = useLoginMutation();
  const [registerMutation, registerResult] = useRegisterMutation();
  const { data: currentUser, refetch } = useGetCurrentUserQuery(undefined, {
    skip: !auth.token,
  });

  // Sync current user data if token exists but no user data
  useEffect(() => {
    if (auth.token && !auth.user && !auth.isLoading) {
      refetch();
    }
  }, [auth.token, auth.user, auth.isLoading, refetch]);

  // Update user data when currentUser query returns
  useEffect(() => {
    if (currentUser && auth.token) {
      // Transform API user to Redux User format
      const transformedUser = mapApiUserToUser(currentUser);
      dispatch(loginSuccess({ user: transformedUser, token: auth.token }));
    }
  }, [currentUser, auth.token, dispatch]);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch(loginStart());
      const result = await loginMutation(credentials).unwrap();
      // Transform API response to match Redux state structure
      const transformedData = {
        user: mapApiUserToUser(result.user),
        token: result.token
      };
      dispatch(loginSuccess(transformedData));
      showSuccessToast('Login successful');
      return result;
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
      showErrorToast(loginResult.error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch(loginStart());
      const result = await registerMutation(data).unwrap();
      // Transform API response to match Redux state structure
      const transformedData = {
        user: mapApiUserToUser(result.user),
        token: result.token
      };
      dispatch(loginSuccess(transformedData));
      showSuccessToast('Registration successful');
      return result;
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : 'Registration failed'));
      showErrorToast(registerResult.error);
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    showSuccessToast('Logged out successfully');
  };

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading || loginResult.isLoading || registerResult.isLoading,
    error: auth.error,
    login,
    register,
    logout: logoutUser,
  };
};

export default useReduxAuth;
