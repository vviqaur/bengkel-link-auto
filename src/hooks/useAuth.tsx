
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
  resendVerification: (email: string) => Promise<void>;
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
      console.log('🔄 Initializing auth session...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }
        
        if (session?.user) {
          if (session.user.email_confirmed_at) {
            console.log('✅ Found existing verified session for user:', session.user.email);
            await loadUserProfile(session.user.id);
          } else {
            console.log('⚠️ User session exists but email not verified yet');
            setAuthState({ user: null, isAuthenticated: false, isLoading: false });
          }
        } else {
          console.log('📭 No existing session found');
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        }
      } catch (error) {
        console.error('❌ Error in initSession:', error);
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event, 'User:', session?.user?.email, 'Email confirmed:', session?.user?.email_confirmed_at ? 'Yes' : 'No');
      
      if (event === 'SIGNED_IN' && session?.user) {
        if (session.user.email_confirmed_at) {
          console.log('✅ User signed in with verified email, loading profile...');
          await loadUserProfile(session.user.id);
          toast.success('Login berhasil! Selamat datang di BengkeLink! 🎉');
        } else {
          console.log('⚠️ User signed in but email not verified');
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
          toast.error('Email belum diverifikasi. Silakan cek email Anda untuk link verifikasi.');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User logged out, clearing state...');
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        toast.success('Logout berhasil!');
      } else if (event === 'TOKEN_REFRESHED' && session?.user?.email_confirmed_at) {
        console.log('🔄 Token refreshed for user:', session.user.email);
        await loadUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('👤 Loading profile for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error loading profile:', error);
        // If profile doesn't exist, user might need to complete registration
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found - user may need to complete registration');
          toast.error('Profil belum lengkap. Silakan lengkapi pendaftaran Anda.');
        }
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      if (!profile) {
        console.error('❌ No profile found for user:', userId);
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      console.log('✅ Profile loaded successfully:', { id: profile.id, role: profile.role, name: profile.name });

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

      console.log(`🎯 Setting authenticated user with role: ${userRole}`);
      setAuthState({ user, isAuthenticated: true, isLoading: false });
      
    } catch (error) {
      console.error('❌ Error in loadUserProfile:', error);
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    console.log('🔐 Login attempt started:', { 
      role: credentials.role, 
      email: credentials.email, 
      username: credentials.username,
      partnershipNumber: credentials.partnershipNumber 
    });
    
    try {
      let loginEmail = credentials.email;
      
      // Find email if using username or partnership number
      if (!loginEmail && (credentials.username || credentials.partnershipNumber)) {
        console.log('🔍 Looking up email for identifier:', credentials.username || credentials.partnershipNumber);
        
        const identifier = credentials.username || credentials.partnershipNumber;
        
        // Try to find by username/phone/email in profiles table
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('email, username, phone, role')
          .or(`username.eq.${identifier},phone.eq.${identifier},email.eq.${identifier}`)
          .eq('role', credentials.role)
          .limit(1);
        
        if (error) {
          console.error('❌ Error looking up profile:', error);
          throw new Error('Terjadi kesalahan saat mencari akun');
        }
        
        // For workshop role, also try partnership number
        if (!profiles || profiles.length === 0) {
          if (credentials.role === 'workshop') {
            console.log('🏪 Trying workshop partnership number lookup...');
            const { data: workshopProfiles, error: workshopError } = await supabase
              .from('workshop_profiles')
              .select('profiles!inner(email, role)')
              .eq('partnership_number', identifier)
              .limit(1);
            
            if (workshopError) {
              console.error('❌ Error looking up workshop profile:', workshopError);
              throw new Error('Terjadi kesalahan saat mencari akun bengkel');
            }
            
            if (workshopProfiles && workshopProfiles.length > 0) {
              loginEmail = workshopProfiles[0].profiles?.email;
            }
          }
        } else {
          loginEmail = profiles[0].email;
        }
        
        if (!loginEmail) {
          console.log('❌ No email found for identifier:', identifier);
          throw new Error(`Email, username, atau nomor kemitraan tidak ditemukan untuk ${credentials.role}. Pastikan Anda sudah mendaftar dengan role yang benar.`);
        }
        
        console.log('✅ Found email for login:', loginEmail);
      }

      if (!loginEmail) {
        throw new Error('Email diperlukan untuk login');
      }

      console.log('🔐 Attempting Supabase auth with email:', loginEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: credentials.password,
      });

      if (error) {
        console.error('❌ Supabase auth error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email/username atau password salah, atau akun belum diverifikasi. Silakan cek email Anda untuk link verifikasi atau klik "Kirim Ulang Verifikasi".');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Email belum diverifikasi. Silakan cek email Anda untuk link verifikasi atau klik "Kirim Ulang Verifikasi".');
        } else if (error.message.includes('signup_disabled')) {
          throw new Error('Pendaftaran akun sedang dinonaktifkan. Silakan coba lagi nanti.');
        } else {
          throw new Error(`Login gagal: ${error.message}`);
        }
      }

      if (data.user) {
        console.log('✅ Login successful for user:', data.user.email);
        console.log('📧 Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
        
        if (!data.user.email_confirmed_at) {
          throw new Error('Email belum diverifikasi. Silakan cek email Anda untuk link verifikasi atau klik "Kirim Ulang Verifikasi".');
        }
        
        // Profile will be loaded automatically by onAuthStateChange
        console.log('🔄 Profile akan dimuat otomatis oleh onAuthStateChange');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    console.log('📝 Signup attempt started:', { role: data.role, email: data.email, name: data.name });
    
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error('Password dan konfirmasi password tidak sama');
    }

    // Validate password strength (minimum 4 letters, 2 numbers, 1 special character)
    const passwordRegex = /^(?=.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z].*[a-zA-Z])(?=.*\d.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
    if (!passwordRegex.test(data.password)) {
      throw new Error('Password harus minimal 8 karakter dengan 4 huruf, 2 angka, dan 1 karakter khusus');
    }

    // For workshop registration, show pending message without creating account
    if (data.role === 'workshop') {
      console.log('🏪 Workshop registration - showing pending message');
      toast.success('Pendaftaran bengkel sedang diproses. Tim kami akan menghubungi Anda dalam 1-2 hari kerja untuk verifikasi lebih lanjut.');
      return;
    }

    // Prepare metadata for user
    const metadata = {
      name: data.name,
      username: data.username || data.email.split('@')[0],
      phone: data.phone,
      role: data.role,
      date_of_birth: data.dateOfBirth?.toISOString(),
    };

    // Add technician-specific metadata
    if (data.role === 'technician') {
      Object.assign(metadata, {
        workshop_name: data.workshopName,
        partnership_number: data.partnershipNumber,
        id_number: data.idNumber,
      });
    }

    console.log('📤 Sending signup request to Supabase...');
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error('❌ Signup error:', error);
      if (error.message.includes('User already registered')) {
        throw new Error('Email sudah terdaftar. Silakan login atau gunakan email lain.');
      }
      throw new Error(`Pendaftaran gagal: ${error.message}`);
    }

    console.log('✅ Signup successful - verification email sent');
    toast.success('Pendaftaran berhasil! 🎉 Silakan cek email untuk verifikasi sebelum login.');
  };

  const resendVerification = async (email: string) => {
    console.log('📧 Resending verification email to:', email);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      }
    });

    if (error) {
      console.error('❌ Error resending verification:', error);
      throw new Error('Gagal mengirim ulang email verifikasi: ' + error.message);
    }

    console.log('✅ Verification email resent successfully');
    toast.success('Email verifikasi telah dikirim ulang! 📧 Silakan cek inbox dan folder spam Anda.');
  };

  const logout = async () => {
    console.log('👋 Logging out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Logout error:', error);
      toast.error('Gagal logout: ' + error.message);
    }
  };

  const verifyEmail = async (token: string) => {
    console.log('✅ Email verified with token:', token);
  };

  const forgotPassword = async (email: string) => {
    console.log('🔐 Sending password reset email to:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      throw new Error(error.message);
    }
    toast.success('Email reset password telah dikirim! 📧');
  };

  const resetPassword = async (token: string, password: string) => {
    console.log('🔐 Password reset with token:', token);
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
        resendVerification,
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
