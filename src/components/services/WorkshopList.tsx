
import { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Workshop {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  estimatedTime: string;
  operatingHours: string;
  address: string;
  technicians: Array<{
    name: string;
    rating: number;
  }>;
  services: string[];
}

interface WorkshopListProps {
  onBack: () => void;
  onSelectWorkshop: (workshop: Workshop) => void;
}

const WorkshopList = ({ onBack, onSelectWorkshop }: WorkshopListProps) => {
  const [workshops] = useState<Workshop[]>([
    {
      id: '1',
      name: 'Bengkel Jaya Abadi Auto',
      image: '/lovable-uploads/workshop1.jpg',
      rating: 4.8,
      reviewCount: 814,
      distance: '0.8 km',
      estimatedTime: '15 menit',
      operatingHours: '08:00 - 18:00',
      address: 'RUKO FRANKFURT, Jl. Boulevard Raya Gading Serpong No.1 Blok 2C',
      technicians: [
        { name: 'Iwan Indrawan', rating: 5.0 },
        { name: 'Dunu Arianna', rating: 4.3 },
        { name: 'Jenna Ortegy', rating: 4.7 }
      ],
      services: ['Servis Rutin', 'Ganti Oli', 'Tune Up', 'AC', 'Rem', 'Kelistrikan']
    },
    {
      id: '2',
      name: 'Bengkel Sumber Rezeki Auto Repair',
      image: '/lovable-uploads/workshop2.jpg',
      rating: 4.4,
      reviewCount: 521,
      distance: '1.2 km',
      estimatedTime: '20 menit',
      operatingHours: '08:30 - 17:00',
      address: 'Jl. Bhayangkara 1 No.91, Paku Jaya, Kec. Serpong Utara',
      technicians: [
        { name: 'Andi Wijaya', rating: 4.8 },
        { name: 'Budi Santoso', rating: 4.6 },
        { name: 'Cahya Rizky', rating: 4.7 }
      ],
      services: ['Servis Rutin', 'Ganti Oli', 'Tune Up', 'AC', 'Rem']
    },
    {
      id: '3',
      name: 'Bengkel Dokter Mobil Gading Serpong',
      image: '/lovable-uploads/workshop3.jpg',
      rating: 4.7,
      reviewCount: 515,
      distance: '1.5 km',
      estimatedTime: '25 menit',
      operatingHours: '09:00 - 21:00',
      address: 'Ruko Paramount Gadget Blok A.7, Curug Sangereng',
      technicians: [
        { name: 'Ahmad Subhan', rating: 4.9 },
        { name: 'Bella Oktaviani', rating: 4.8 },
        { name: 'Candra Wijaya', rating: 4.7 }
      ],
      services: ['Servis Rutin', 'Ganti Oli', 'Tune Up', 'AC', 'Rem', 'Kelistrikan']
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Pilih Bengkel</h1>
        </div>
      </header>

      <main className="p-4">
        <div className="space-y-4">
          {workshops.map((workshop) => (
            <Card key={workshop.id} className="card-interactive">
              <CardHeader className="pb-3">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                    <img 
                      src={workshop.image} 
                      alt={workshop.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.textContent = workshop.name.charAt(0);
                      }}
                    />
                    <span className="text-lg font-bold text-muted-foreground hidden">
                      {workshop.name.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg leading-tight">{workshop.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{workshop.rating}</span>
                            <span className="text-sm text-muted-foreground">({workshop.reviewCount})</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {workshop.distance}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{workshop.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{workshop.technicians.length} teknisi</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm text-muted-foreground">{workshop.address}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Layanan:</p>
                  <div className="flex flex-wrap gap-1">
                    {workshop.services.slice(0, 4).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {workshop.services.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{workshop.services.length - 4} lainnya
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Teknisi Terbaik:</p>
                  <div className="space-y-1">
                    {workshop.technicians.slice(0, 2).map((tech, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{tech.name}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{tech.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full btn-primary"
                  onClick={() => onSelectWorkshop(workshop)}
                >
                  Pilih Bengkel
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default WorkshopList;
