
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, SignupData } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('bengkelink_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('bengkelink_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    console.log('Login attempt:', credentials);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on role
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      role: credentials.role,
      name: 'John Doe',
      username: credentials.username || 'johndoe',
      email: credentials.email || 'john@example.com',
      phone: '+62812345678',
      isVerified: true,
      createdAt: new Date(),
    };

    localStorage.setItem('bengkelink_user', JSON.stringify(mockUser));
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const signup = async (data: SignupData) => {
    console.log('Signup attempt:', data);
    
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error('Password dan konfirmasi password tidak sama');
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z].*[a-zA-Z])(?=.*\d.*\d)(?=.*[^a-zA-Z\d]).+$/;
    if (!passwordRegex.test(data.password)) {
      throw new Error('Password harus minimal 4 huruf, 2 angka, dan 1 karakter khusus');
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For workshop registration, show pending message
    if (data.role === 'workshop') {
      // Don't log in, just show success message
      return;
    }

    // Mock user creation for customer and technician
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      role: data.role,
      name: data.name,
      username: data.username,
      email: data.email,
      phone: data.phone,
      isVerified: false, // Will be verified after email verification
      createdAt: new Date(),
    };

    // Simulate email verification process
    setTimeout(() => {
      mockUser.isVerified = true;
      localStorage.setItem('bengkelink_user', JSON.stringify(mockUser));
      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    }, 2000);
  };

  const logout = () => {
    localStorage.removeItem('bengkelink_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const verifyEmail = async (token: string) => {
    // Simulate email verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Email verified with token:', token);
  };

  const forgotPassword = async (email: string) => {
    // Simulate forgot password
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset email sent to:', email);
  };

  const resetPassword = async (token: string, password: string) => {
    // Simulate password reset
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset with token:', token);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
