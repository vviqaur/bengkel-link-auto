
import { useState } from 'react';
import { ArrowLeft, Gift, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface PromoManagerProps {
  onBack: () => void;
  initialPromoId?: string;
}

const PromoManager = ({ onBack, initialPromoId }: PromoManagerProps) => {
  const [claimedPromos, setClaimedPromos] = useState<string[]>([]);

  // Mock user data for promo eligibility
  const userData = {
    isNewUser: true,
    serviceCount: 3,
    inviteCount: 0
  };

  const promos = [
    {
      id: 'promo-1',
      title: 'Promo Pengguna Baru',
      image: '/lovable-uploads/5be689c2-1cf2-47da-8b52-5d9b743a0889.png',
      description: 'Nikmati diskon 50% untuk pemesanan layanan pertama Anda.',
      terms: ['Hanya untuk pengguna baru yang belum pernah memesan layanan.'],
      expiryDate: '31-12-2025',
      eligibility: 'isNewUser',
      code: 'NEWUSER50'
    },
    {
      id: 'promo-2',
      title: 'Promo Awal Bulan',
      image: '/lovable-uploads/418fe508-530e-432b-a8bb-6162aaf1d48d.png',
      description: 'Dapatkan diskon 20% untuk setiap pemesanan di awal bulan.',
      terms: ['Berlaku untuk semua pengguna.'],
      expiryDate: '30-06-2025',
      eligibility: 'allUsers',
      code: 'MONTH20'
    },
    {
      id: 'promo-3',
      title: 'Promo Undang Teman',
      image: '/lovable-uploads/a3794a57-2e99-4d17-8d22-e436667d5c3f.png',
      description: 'Dapatkan bonus Rp50.000 untuk setiap teman yang diundang dan memesan layanan.',
      terms: ['Minimal 1 teman diundang yang berhasil memesan.'],
      expiryDate: '31-12-2025',
      eligibility: 'inviteCount',
      code: 'INVITE50K'
    },
    {
      id: 'promo-4',
      title: 'Promo Pengguna Setia',
      image: '/lovable-uploads/70998ccd-804d-4d11-b274-b8839272acdc.png',
      description: 'Diskon 30% untuk pengguna dengan 5 atau lebih pemesanan.',
      terms: ['Minimal 5 pemesanan layanan.'],
      expiryDate: '31-12-2025',
      eligibility: 'serviceCount',
      code: 'LOYAL30'
    },
    {
      id: 'promo-5',
      title: 'Promo Hari Pancasila',
      image: '/lovable-uploads/0aa878a7-a4e2-414d-ae75-d51a7b812286.png',
      description: 'Rayakan Hari Pancasila dengan diskon 25% untuk semua layanan.',
      terms: ['Berlaku untuk semua pengguna, hanya pada 1 Juni 2025.'],
      expiryDate: '01-06-2025',
      eligibility: 'allUsers',
      code: 'PANCASILA25'
    },
    {
      id: 'promo-6',
      title: 'Promo Tanggal Kembar 6.6',
      image: '/lovable-uploads/cd6d6b9e-3568-4c3b-8d70-98fd97511fca.png',
      description: 'Diskon 66% untuk pemesanan pada tanggal 6 Juni 2025.',
      terms: ['Berlaku untuk semua pengguna, hanya pada 6 Juni 2025.'],
      expiryDate: '06-06-2025',
      eligibility: 'allUsers',
      code: 'DOUBLE66'
    }
  ];

  const selectedPromo = initialPromoId ? promos.find(p => p.id === initialPromoId) : null;

  const checkEligibility = (promo: typeof promos[0]) => {
    switch (promo.eligibility) {
      case 'isNewUser':
        return userData.isNewUser;
      case 'serviceCount':
        return userData.serviceCount >= 5;
      case 'inviteCount':
        return userData.inviteCount >= 1;
      case 'allUsers':
        return true;
      default:
        return false;
    }
  };

  const handleClaimPromo = (promo: typeof promos[0]) => {
    if (claimedPromos.includes(promo.id)) {
      toast.info('Promo sudah diklaim sebelumnya');
      return;
    }

    if (!checkEligibility(promo)) {
      toast.error('Anda tidak memenuhi syarat untuk promo ini');
      return;
    }

    setClaimedPromos(prev => [...prev, promo.id]);
    toast.success(`${promo.title} berhasil diklaim! Kode promo: ${promo.code}`);
  };

  if (selectedPromo) {
    const isEligible = checkEligibility(selectedPromo);
    const isClaimed = claimedPromos.includes(selectedPromo.id);

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">{selectedPromo.title}</h1>
          </div>
        </header>

        <main className="p-4 space-y-6">
          {/* Promo Image */}
          <div className="w-full h-48 rounded-lg overflow-hidden">
            <img 
              src={selectedPromo.image} 
              alt={selectedPromo.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Deskripsi Promo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{selectedPromo.description}</p>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Syarat dan Ketentuan</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedPromo.terms.map((term, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{term}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Expiry Date */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-medium">Berlaku hingga: </span>
                  <span className="text-muted-foreground">{selectedPromo.expiryDate}</span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="space-y-3">
            {isClaimed ? (
              <Button disabled className="w-full" variant="secondary">
                <CheckCircle className="w-4 h-4 mr-2" />
                Sudah Diklaim
              </Button>
            ) : isEligible ? (
              <Button 
                onClick={() => handleClaimPromo(selectedPromo)} 
                className="w-full btn-primary"
              >
                Klaim Sekarang
              </Button>
            ) : (
              <>
                <Button disabled className="w-full" variant="secondary">
                  Klaim Sekarang
                </Button>
                <p className="text-center text-sm text-destructive">
                  Anda tidak memenuhi syarat
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Show all promos if no specific promo is selected
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Promo Tersedia</h1>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {promos.map((promo) => {
          const isEligible = checkEligibility(promo);
          const isClaimed = claimedPromos.includes(promo.id);

          return (
            <Card key={promo.id} className="card-interactive">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{promo.title}</h3>
                  {isClaimed && (
                    <Badge variant="secondary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Diklaim
                    </Badge>
                  )}
                </div>
                
                <div className="h-32 rounded-lg mb-3 overflow-hidden">
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {promo.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Berlaku hingga: {promo.expiryDate}
                  </span>
                  
                  {isClaimed ? (
                    <Button size="sm" disabled variant="secondary">
                      Sudah Diklaim
                    </Button>
                  ) : isEligible ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleClaimPromo(promo)}
                      className="btn-primary"
                    >
                      Klaim
                    </Button>
                  ) : (
                    <Button size="sm" disabled variant="secondary">
                      Tidak Memenuhi Syarat
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>
    </div>
  );
};

export default PromoManager;
