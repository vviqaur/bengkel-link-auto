
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

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

  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
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
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      </CardContent>
    </Card>
  );
};

export default LoginForm;
