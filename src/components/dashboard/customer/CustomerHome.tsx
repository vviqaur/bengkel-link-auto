
import { useState } from 'react';
import { MapPin, Calendar, Clock, Star, Plus, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ServiceFlow from '@/components/services/ServiceFlow';

const CustomerHome = () => {
  const [currentView, setCurrentView] = useState<'home' | 'call-technician' | 'book-service'>('home');
  const [activeServices] = useState([
    {
      id: '1',
      type: 'Servis Berkala',
      workshop: 'Bengkel Maju Jaya',
      technician: 'Ahmad Supardi',
      status: 'sedang_dikerjakan',
      estimatedTime: '2 jam',
      location: 'Jl. Sudirman No. 123',
      rating: 4.8
    }
  ]);

  const [nearbyWorkshops] = useState([
    {
      id: '1',
      name: 'Bengkel Maju Jaya',
      distance: '0.8 km',
      rating: 4.8,
      services: ['Servis Rutin', 'Ganti Oli', 'Tune Up'],
      available: true
    },
    {
      id: '2',
      name: 'Auto Service Center',
      distance: '1.2 km',
      rating: 4.5,
      services: ['AC Mobil', 'Electrical', 'Body Repair'],
      available: true
    }
  ]);

  const [promos] = useState([
    {
      id: '1',
      title: 'Promo Pengguna Baru',
      image: '/lovable-uploads/promo1.png',
      description: 'Diskon 50% untuk pengguna baru'
    },
    {
      id: '2',
      title: 'Promo Awal Bulan',
      image: '/lovable-uploads/promo2.png',
      description: 'Diskon 20% setiap awal bulan'
    },
    {
      id: '3',
      title: 'Promo Undang Teman',
      image: '/lovable-uploads/promo3.png',
      description: 'Bonus Rp50.000 per undangan'
    }
  ]);

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

  return (
    <div className="p-4 space-y-6">
      {/* Quick Actions */}
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

      {/* Active Services */}
      {activeServices.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Reminder</h2>
          {activeServices.map((service) => (
            <Card key={service.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{service.type}</CardTitle>
                    <CardDescription>{service.workshop}</CardDescription>
                  </div>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    Sedang Dikerjakan
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Estimasi: {service.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{service.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{service.rating}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Promos */}
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
                <Button size="sm" className="w-full">
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
                <Button size="sm" className="w-full">
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
