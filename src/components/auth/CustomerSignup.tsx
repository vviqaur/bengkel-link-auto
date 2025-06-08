
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CustomerSignupProps {
  onBack: () => void;
}

const CustomerSignup = ({ onBack }: CustomerSignupProps) => {
  const [formData, setFormData] = useState({
    profilePhoto: null as File | null,
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'verification' | 'success'>('form');

  const { signup } = useAuth();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast({
        title: "Error",
        description: "Anda harus menyetujui syarat dan ketentuan",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        role: 'customer',
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        termsAccepted: formData.termsAccepted,
        profilePhoto: formData.profilePhoto || undefined,
      });

      setStep('verification');
      
      // Simulate email verification
      setTimeout(() => {
        setStep('success');
        toast({
          title: "Pendaftaran berhasil",
          description: "Selamat datang di BengkeLink!",
        });
      }, 2000);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat mendaftar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'verification') {
    return (
      <Card className="w-full card-interactive">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verifikasi Email</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-full"></div>
            </div>
          </div>
          <p>Silakan cek email Anda untuk verifikasi akun...</p>
          <p className="text-sm text-muted-foreground">
            (Dalam prototype ini, verifikasi akan dilakukan otomatis)
          </p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card className="w-full card-interactive">
        <CardContent className="text-center py-8 space-y-4">
          <div className="animate-scale-in">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 text-green-600">✓</div>
            </div>
          </div>
          <h3 className="text-xl font-bold">Pendaftaran Berhasil!</h3>
          <p className="text-muted-foreground">
            Akun Anda telah berhasil dibuat dan diverifikasi
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full card-interactive">
      <CardHeader>
        <Button
          variant="ghost"
          className="w-fit p-0 mb-4 text-muted-foreground hover:text-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <CardTitle className="text-2xl font-bold">Daftar sebagai Customer</CardTitle>
        <p className="text-muted-foreground">Lengkapi data diri untuk mendaftar</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profilePhoto">Foto Profil (Opsional)</Label>
            <div className="flex items-center gap-4">
              <input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('profilePhoto')?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Pilih Foto
              </Button>
              {formData.profilePhoto && (
                <span className="text-sm text-muted-foreground">
                  {formData.profilePhoto.name}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">No. Telepon *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+62812345678"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 4 huruf, 2 angka, 1 karakter khusus"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Konfirmasi password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))
                }
              />
              <Label htmlFor="terms" className="text-sm">
                Saya menyetujui <span className="text-primary">syarat dan ketentuan</span> *
              </Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-primary"
            disabled={isLoading || !formData.termsAccepted}
          >
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerSignup;
