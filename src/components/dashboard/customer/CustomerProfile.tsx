
import { useState } from 'react';
import { User, Phone, Mail, MapPin, Car, Settings, LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

const CustomerProfile = () => {
  const { user, logout } = useAuth();
  const [vehicles] = useState([
    {
      id: '1',
      brand: 'Toyota',
      model: 'Avanza',
      year: 2020,
      plateNumber: 'B 1234 ABC',
      color: 'Putih',
      isDefault: true
    },
    {
      id: '2',
      brand: 'Honda',
      model: 'Civic',
      year: 2019,
      plateNumber: 'B 5678 DEF',
      color: 'Hitam',
      isDefault: false
    }
  ]);

  const [stats] = useState({
    totalServices: 15,
    completedServices: 13,
    averageRating: 4.8,
    memberSince: '2023'
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.profilePhoto} />
              <AvatarFallback className="text-lg">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl">{user?.name}</CardTitle>
              <CardDescription>Member sejak {stats.memberSince}</CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  ⭐ {stats.averageRating}
                </Badge>
                <Badge variant="outline">
                  {stats.completedServices} servis selesai
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Kontak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{user?.phone}</p>
              <p className="text-sm text-muted-foreground">Nomor Telepon</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-muted-foreground">Email</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{user?.address || 'Alamat belum diatur'}</p>
              <p className="text-sm text-muted-foreground">Alamat</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Kendaraan Saya</CardTitle>
            <Button variant="outline" size="sm">
              <Car className="w-4 h-4 mr-2" />
              Tambah Kendaraan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {vehicle.brand} {vehicle.model} ({vehicle.year})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.plateNumber} • {vehicle.color}
                  </p>
                </div>
              </div>
              {vehicle.isDefault && (
                <Badge variant="secondary">Default</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">{stats.totalServices}</p>
              <p className="text-sm text-muted-foreground">Total Servis</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.completedServices}</p>
              <p className="text-sm text-muted-foreground">Selesai</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings & Actions */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-3" />
          Pengaturan Akun
        </Button>
        
        <Button 
          variant="destructive" 
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Keluar
        </Button>
      </div>
    </div>
  );
};

export default CustomerProfile;
