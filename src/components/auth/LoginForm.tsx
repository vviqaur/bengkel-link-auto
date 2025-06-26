
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Info, Mail } from 'lucide-react';

const LoginForm = () => {
  const [role, setRole] = useState<UserRole>('customer');
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    partnershipNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailVerificationInfo, setShowEmailVerificationInfo] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const { login, resendVerification } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setShowEmailVerificationInfo(false);
    
    try {
      console.log('Form submission:', { role, formData });
      
      const credentials = {
        role,
        password: formData.password,
        ...(role === 'workshop' 
          ? { partnershipNumber: formData.partnershipNumber }
          : { 
              // Determine if input is email or username
              ...(formData.emailOrUsername.includes('@') 
                ? { email: formData.emailOrUsername }
                : { username: formData.emailOrUsername }
              )
            }
        ),
      };

      console.log('Login credentials prepared:', credentials);
      await login(credentials);
      
      toast({
        title: "Berhasil masuk",
        description: "Selamat datang di BengkeLink!",
      });
      
      // The redirection will be handled automatically by the Index component
      // when the authentication state changes
      console.log('Login successful, user will be redirected automatically');
      
    } catch (error) {
      console.error('Login form error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat login';
      
      // Show email verification info if login fails with verification-related errors
      if (errorMessage.includes('belum diverifikasi') || 
          errorMessage.includes('Email not confirmed') ||
          errorMessage.includes('Kirim Ulang Verifikasi')) {
        setShowEmailVerificationInfo(true);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.emailOrUsername || !formData.emailOrUsername.includes('@')) {
      toast({
        title: "Error",
        description: "Masukkan email yang valid terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setIsResendingVerification(true);
    try {
      await resendVerification(formData.emailOrUsername);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengirim ulang email verifikasi';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.emailOrUsername) {
      toast({
        title: "Error",
        description: "Masukkan email terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    // Simulate forgot password process
    toast({
      title: "Email terkirim",
      description: "Link reset password telah dikirim ke email Anda",
    });
    setShowForgotPassword(false);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'customer': return 'Customer';
      case 'technician': return 'Teknisi';
      case 'workshop': return 'Mitra Bengkel';
    }
  };

  return (
    <Card className="w-full card-interactive">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Masuk ke BengkeLink</CardTitle>
        <p className="text-muted-foreground">Pilih peran dan masuk ke akun Anda</p>
      </CardHeader>
      <CardContent>
        {showEmailVerificationInfo && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">Email Belum Diverifikasi</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Akun Anda sudah terdaftar tetapi email belum diverifikasi. Silakan cek email untuk link verifikasi.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    {isResendingVerification ? 'Mengirim...' : 'Kirim Ulang Verifikasi'}
                  </Button>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  Jika tidak menerima email, cek folder spam atau hubungi support.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="role">Peran</Label>
            <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="technician">Teknisi</SelectItem>
                <SelectItem value="workshop">Mitra Bengkel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role !== 'workshop' ? (
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername">Email / Username</Label>
              <Input
                id="emailOrUsername"
                type="text"
                placeholder="Masukkan email atau username"
                value={formData.emailOrUsername}
                onChange={(e) => setFormData(prev => ({ ...prev, emailOrUsername: e.target.value }))}
                required
              />
              <p className="text-xs text-muted-foreground">
                Gunakan email yang sama dengan saat pendaftaran
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="partnershipNumber">Nomor Keterangan Kemitraan BengkeLink</Label>
              <Input
                id="partnershipNumber"
                type="text"
                placeholder="Masukkan nomor kemitraan"
                value={formData.partnershipNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, partnershipNumber: e.target.value }))}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          {role !== 'workshop' && (
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-primary hover:text-primary/80"
                onClick={() => setShowForgotPassword(true)}
              >
                Lupa password?
              </Button>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : `Masuk sebagai ${getRoleLabel(role)}`}
          </Button>
        </form>

        {showForgotPassword && (
          <div className="mt-6 p-4 bg-orange-light rounded-lg">
            <h3 className="font-semibold mb-2">Reset Password</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Masukkan email Anda untuk menerima link reset password
            </p>
            <div className="flex gap-2">
              <Button onClick={handleForgotPassword} size="sm">
                Kirim Link
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowForgotPassword(false)}
              >
                Batal
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Petunjuk Login</h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• <strong>Email belum diverifikasi?</strong> Cek inbox dan spam, atau klik "Kirim Ulang Verifikasi"</li>
                <li>• <strong>Lupa password?</strong> Gunakan fitur "Lupa password?" di atas</li>
                <li>• <strong>Akun tidak ditemukan?</strong> Pastikan Anda sudah mendaftar terlebih dahulu</li>
                <li>• <strong>Masih bermasalah?</strong> Hubungi customer service kami</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
