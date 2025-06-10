
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, SignupData } from '../types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    // Get initial session
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // Get profile from the profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      const user: User = {
        id: profile.id,
        role: profile.role,
        name: profile.name,
        username: profile.username,
        email: profile.username, // Will be overridden if we have proper email
        phone: profile.phone,
        profilePhoto: profile.profile_photo_url,
        address: profile.address,
        isVerified: profile.is_verified,
        createdAt: new Date(profile.created_at),
      };

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    console.log('Login attempt:', credentials);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email || '',
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.user) {
      toast.success('Login berhasil!');
    }
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

    // For workshop registration, show pending message
    if (data.role === 'workshop') {
      toast.success('Pendaftaran bengkel sedang diproses. Anda akan dihubungi dalam 1-2 hari kerja.');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          username: data.username || data.email.split('@')[0],
          phone: data.phone,
          role: data.role,
          partnership_number: data.partnershipNumber,
          workshop_name: data.workshopName,
          id_number: data.idNumber,
          date_of_birth: data.dateOfBirth?.toISOString(),
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    toast.success('Pendaftaran berhasil! Silakan cek email untuk verifikasi.');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const verifyEmail = async (token: string) => {
    // This would typically be handled by Supabase automatically
    console.log('Email verified with token:', token);
  };

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw new Error(error.message);
    }
    toast.success('Email reset password telah dikirim!');
  };

  const resetPassword = async (token: string, password: string) => {
    // This would be handled in a separate reset password page
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
