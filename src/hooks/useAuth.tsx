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
      console.log('Initializing session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      if (session?.user) {
        console.log('Found existing session for user:', session.user.email);
        await loadUserProfile(session.user.id);
      } else {
        console.log('No existing session found');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        console.log('User authenticated, loading profile...');
        await loadUserProfile(session.user.id);
      } else {
        console.log('User logged out, clearing state...');
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
      console.log('Loading profile for user:', userId);
      
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

      if (!profile) {
        console.error('No profile found for user:', userId);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      console.log('Profile loaded successfully:', profile);

      // Ensure role is properly typed
      const userRole = profile.role as 'customer' | 'technician' | 'workshop';

      const user: User = {
        id: profile.id,
        role: userRole,
        name: profile.name,
        username: profile.username,
        email: profile.email || profile.username,
        phone: profile.phone,
        profilePhoto: profile.profile_photo_url,
        address: profile.address,
        isVerified: profile.is_verified,
        createdAt: new Date(profile.created_at),
      };

      console.log('Setting authenticated user with role:', userRole);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Log successful authentication with role info
      console.log(`User authenticated successfully as ${userRole}:`, user.name);
      
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
    console.log('Login attempt started:', { 
      role: credentials.role, 
      email: credentials.email, 
      username: credentials.username,
      partnershipNumber: credentials.partnershipNumber 
    });
    
    try {
      // Determine the email to use for login
      let loginEmail = credentials.email;
      
      // If using username or partnership number, we need to find the email
      if (!loginEmail && (credentials.username || credentials.partnershipNumber)) {
        console.log('Looking up email for username/partnership:', credentials.username || credentials.partnershipNumber);
        
        const identifier = credentials.username || credentials.partnershipNumber;
        
        // First try to find by username
        let { data: profiles, error } = await supabase
          .from('profiles')
          .select('email, username, phone')
          .or(`username.eq.${identifier},phone.eq.${identifier}`)
          .limit(1);
        
        if (error) {
          console.error('Error looking up profile:', error);
          throw new Error('Terjadi kesalahan saat mencari akun');
        }
        
        // If not found by username/phone, try partnership number for workshops
        if (!profiles || profiles.length === 0) {
          console.log('Profile not found by username/phone, trying partnership number...');
          const { data: workshopProfiles, error: workshopError } = await supabase
            .from('workshop_profiles')
            .select('profiles!inner(email)')
            .eq('partnership_number', identifier)
            .limit(1);
          
          if (workshopError) {
            console.error('Error looking up workshop profile:', workshopError);
            throw new Error('Terjadi kesalahan saat mencari akun bengkel');
          }
          
          if (workshopProfiles && workshopProfiles.length > 0) {
            loginEmail = workshopProfiles[0].profiles?.email;
          }
        } else {
          loginEmail = profiles[0].email;
        }
        
        if (!loginEmail) {
          console.log('No email found for identifier:', identifier);
          throw new Error('Username, nomor telepon, atau nomor kemitraan tidak ditemukan');
        }
        
        console.log('Found email for login:', loginEmail);
      }

      if (!loginEmail) {
        throw new Error('Email diperlukan untuk login');
      }

      console.log('Attempting Supabase auth with email:', loginEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: credentials.password,
      });

      if (error) {
        console.error('Supabase auth error:', error);
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email/username atau password salah');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Email belum diverifikasi. Silakan cek email Anda');
        } else {
          throw new Error(error.message);
        }
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.email);
        console.log('Auth state will be updated automatically by onAuthStateChange');
        toast.success('Login berhasil! Mengarahkan ke dashboard...');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
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

    // Prepare metadata for the user
    const metadata = {
      name: data.name,
      username: data.username || data.email.split('@')[0],
      phone: data.phone,
      role: data.role,
      date_of_birth: data.dateOfBirth?.toISOString(),
    };

    // Add role-specific metadata
    if (data.role === 'technician') {
      Object.assign(metadata, {
        workshop_name: data.workshopName,
        partnership_number: data.partnershipNumber,
        id_number: data.idNumber,
      });
    } else if (data.role === 'workshop') {
      Object.assign(metadata, {
        workshop_name: data.workshopName,
        province: data.province,
        city: data.city,
        postal_code: data.postalCode,
        detail_address: data.detailAddress,
        operating_hours: data.operatingHours,
        services: data.services?.join(','),
        vehicle_types: data.vehicleTypes?.join(','),
        technician_count: data.technicianCount,
        owner_name: data.ownerName,
        business_number: data.businessNumber,
        tax_number: data.taxNumber,
        bank_name: data.bankName,
        account_number: data.accountNumber,
        account_name: data.accountName,
      });
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
        data: metadata,
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    toast.success('Pendaftaran berhasil! Silakan cek email untuk verifikasi.');
  };

  const logout = async () => {
    console.log('Logging out...');
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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
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
