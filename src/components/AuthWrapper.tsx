
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, UserPlus } from 'lucide-react';
import LoginForm from './auth/LoginForm';
import SignupForm from './auth/SignupForm';

type AuthMode = 'login' | 'signup' | 'selection';

const AuthWrapper = () => {
  const [mode, setMode] = useState<AuthMode>('selection');

  const renderSelectionScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-light via-white to-orange-light/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-interactive">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 mb-6">
            <img 
              src="/lovable-uploads/18c3e59c-93d8-4fb1-b29d-ad8245a52f1b.png" 
              alt="BengkeLink Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-gradient">BengkeLink</CardTitle>
          <p className="text-muted-foreground mt-2">Platform Bengkel Digital Terpercaya</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full btn-primary text-lg py-6 flex items-center gap-3"
            onClick={() => setMode('login')}
          >
            <User className="w-5 h-5" />
            Masuk ke Akun
          </Button>
          <Button 
            variant="outline" 
            className="w-full btn-secondary text-lg py-6 flex items-center gap-3"
            onClick={() => setMode('signup')}
          >
            <UserPlus className="w-5 h-5" />
            Daftar Akun Baru
          </Button>
          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground">
              Dengan menggunakan BengkeLink, Anda menyetujui{' '}
              <span className="text-primary">Syarat & Ketentuan</span>{' '}
              dan <span className="text-primary">Kebijakan Privasi</span> kami
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBackButton = () => (
    <Button
      variant="ghost"
      className="mb-6 text-muted-foreground hover:text-foreground flex items-center gap-2"
      onClick={() => setMode('selection')}
    >
      <ArrowLeft className="w-4 h-4" />
      Kembali ke Menu Utama
    </Button>
  );

  if (mode === 'selection') {
    return renderSelectionScreen();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-light via-white to-orange-light/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderBackButton()}
        {mode === 'login' && <LoginForm />}
        {mode === 'signup' && <SignupForm />}
      </div>
    </div>
  );
};

export default AuthWrapper;
