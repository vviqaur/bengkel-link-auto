
import { useState } from 'react';
import { MapPin, Calendar, Clock, Star, Plus, Phone, MessageCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ServiceFlow from '@/components/services/ServiceFlow';
import PromoManager from '@/components/promo/PromoManager';
import WorkshopDetail from '@/components/services/WorkshopDetail';
import ChatRoom from '@/components/services/ChatRoom';

const CustomerHome = () => {
  const [currentView, setCurrentView] = useState<'home' | 'call-technician' | 'book-service' | 'promo-detail' | 'workshop-detail' | 'chat'>('home');
  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [isCalling, setIsCalling] = useState(false);

  // Mock data for reminders/bookings
  const [reminders] = useState([
    {
      id: '1',
      serviceName: 'Ganti Oli + Filter',
      date: '2024-01-20',
      status: 'Menunggu Konfirmasi',
      workshop: 'Bengkel Maju Jaya'
    },
    {
      id: '2',
      serviceName: 'Service AC',
      date: '2024-01-22',
      status: 'Sedang Diproses',
      workshop: 'Auto Service Center'
    }
  ]);

  // Active services (current ongoing services)
  const [activeServices] = useState([
    {
      id: '1',
      type: 'Servis Berkala',
      workshop: 'Bengkel Maju Jaya',
      technician: 'Ahmad Supardi',
      status: 'sedang_dikerjakan',
      estimatedTime: '2 jam',
      location: 'Jl. Sudirman No. 123',
      rating: 4.8,
      phone: '+62 812-3456-7890'
    }
  ]);

  // Nearby workshops
  const [nearbyWorkshops] = useState([
    {
      id: '1',
      name: 'Bengkel Maju Jaya',
      distance: '0.8 km',
      rating: 4.8,
      services: ['Servis Rutin', 'Ganti Oli', 'Tune Up'],
      available: true,
      image: '/placeholder.svg',
      reviewCount: 150,
      estimatedTime: '30 menit',
      operatingHours: '08:00 - 17:00',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      technicians: [
        { name: 'Ahmad Supardi', rating: 4.8 },
        { name: 'Budi Santoso', rating: 4.7 }
      ]
    },
    {
      id: '2',
      name: 'Auto Service Center',
      distance: '1.2 km',
      rating: 4.5,
      services: ['AC Mobil', 'Electrical', 'Body Repair'],
      available: true,
      image: '/placeholder.svg',
      reviewCount: 98,
      estimatedTime: '45 menit',
      operatingHours: '09:00 - 18:00',
      address: 'Jl. Thamrin No. 45, Jakarta Pusat',
      technicians: [
        { name: 'Sari Dewi', rating: 4.6 },
        { name: 'Agus Pratama', rating: 4.5 }
      ]
    }
  ]);

  // Promo data
  const [promos] = useState([
    {
      id: 'promo-1',
      title: 'Promo Pengguna Baru',
      image: '/lovable-uploads/promo1.png',
      description: 'Diskon 50% untuk pengguna baru'
    },
    {
      id: 'promo-2',
      title: 'Promo Awal Bulan',
      image: '/lovable-uploads/promo2.png',
      description: 'Diskon 20% setiap awal bulan'
    },
    {
      id: 'promo-3',
      title: 'Promo Undang Teman',
      image: '/lovable-uploads/promo3.png',
      description: 'Bonus Rp50.000 per undangan'
    },
    {
      id: 'promo-4',
      title: 'Promo Pengguna Setia',
      image: '/lovable-uploads/promo4.png',
      description: 'Diskon 30% untuk pelanggan setia'
    },
    {
      id: 'promo-5',
      title: 'Promo Hari Pancasila',
      image: '/lovable-uploads/promo5.png',
      description: 'Diskon 25% khusus 1 Juni'
    },
    {
      id: 'promo-6',
      title: 'Promo Tanggal Kembar 6.6',
      image: '/lovable-uploads/promo6.png',
      description: 'Diskon 66% spesial 6 Juni'
    }
  ]);

  const handleCall = (phoneNumber: string) => {
    setIsCalling(true);
    console.log('Calling:', phoneNumber);
    
    // Simulate call
    setTimeout(() => {
      setIsCalling(false);
    }, 3000);

    // Open phone dialer
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleChatWithTechnician = (technician: any) => {
    setCurrentView('chat');
  };

  const handlePromoDetail = (promoId: string) => {
    setSelectedPromoId(promoId);
    setCurrentView('promo-detail');
  };

  const handleWorkshopDetail = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setCurrentView('workshop-detail');
  };

  // Handle different views
  if (currentView === 'call-technician') {
    return (
      <ServiceFlow 
        serviceType="call"
        onBack={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'book-service') {
    return (
      <ServiceFlow 
        serviceType="book"
        onBack={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'promo-detail' && selectedPromoId) {
    return (
      <PromoManager
        onBack={() => {
          setCurrentView('home');
          setSelectedPromoId(null);
        }}
        initialPromoId={selectedPromoId}
      />
    );
  }

  if (currentView === 'workshop-detail' && selectedWorkshop) {
    return (
      <WorkshopDetail
        workshop={selectedWorkshop}
        onBack={() => {
          setCurrentView('home');
          setSelectedWorkshop(null);
        }}
        onNext={() => {}} // No next action needed from home
        serviceType="call"
      />
    );
  }

  if (currentView === 'chat' && activeServices.length > 0) {
    return (
      <ChatRoom
        onBack={() => setCurrentView('home')}
        onCall={handleCall}
        technicianName={activeServices[0].technician}
        workshopName={activeServices[0].workshop}
      />
    );
  }

  if (isCalling && activeServices.length > 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <Phone className="w-16 h-16 text-primary animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{activeServices[0].technician}</h2>
            <p className="text-muted-foreground">{activeServices[0].phone}</p>
            <p className="text-sm text-primary mt-2">Menghubungi...</p>
          </div>
          <Button 
            variant="destructive" 
            onClick={() => setIsCalling(false)}
          >
            Tutup Panggilan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Quick Actions - Main Service Options */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          className="h-20 flex flex-col gap-2 btn-primary"
          onClick={() => setCurrentView('call-technician')}
        >
          <Phone className="w-6 h-6" />
          <span>Panggil Teknisi</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-2"
          onClick={() => setCurrentView('book-service')}
        >
          <Calendar className="w-6 h-6" />
          <span>Book Service</span>
        </Button>
      </div>

      {/* Active Services - Teknisi Anda */}
      {activeServices.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Teknisi Anda</h2>
          {activeServices.map((service) => (
            <Card key={service.id} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {service.technician.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{service.technician}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{service.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCall(service.phone)}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleChatWithTechnician(service)}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Estimasi: {service.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{service.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reminder Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Reminder</h2>
        {reminders.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {reminders.map((reminder) => (
              <Card key={reminder.id} className="card-interactive">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{reminder.serviceName}</p>
                      <p className="text-sm text-muted-foreground">{reminder.date}</p>
                      <p className="text-xs text-muted-foreground">{reminder.workshop}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        reminder.status === 'Menunggu Konfirmasi' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {reminder.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground italic text-sm">
              Belum ada aktivitas booking service.
            </p>
          </div>
        )}
      </div>

      {/* Promos Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Promo Spesial</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {promos.map((promo) => (
            <Card key={promo.id} className="min-w-[300px] card-interactive">
              <CardContent className="p-4">
                <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="font-semibold text-primary">{promo.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{promo.description}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handlePromoDetail(promo.id)}
                >
                  Lihat Detail
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Nearby Workshops */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Bengkel Terdekat</h2>
        <div className="space-y-3">
          {nearbyWorkshops.map((workshop) => (
            <Card key={workshop.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{workshop.name}</CardTitle>
                    <CardDescription>{workshop.distance}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{workshop.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {workshop.services.slice(0, 3).map((service, index) => (
                    <span 
                      key={index}
                      className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleWorkshopDetail(workshop)}
                >
                  Lihat Detail
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
