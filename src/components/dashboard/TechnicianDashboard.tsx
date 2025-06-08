
import { useState } from 'react';
import { Bell, User, Switch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch as SwitchComponent } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TechnicianDashboard = () => {
  const [isActive, setIsActive] = useState(false);
  const [tasks] = useState([
    {
      id: '1',
      customerName: 'Ahmad Subandi',
      location: 'Jl. Gading Serpong Raya No. 15',
      vehicleType: 'Honda Civic 2020',
      service: 'Ganti Oli + Filter',
      problem: 'Oli sudah 10,000 km',
      date: '2024-06-08',
      time: '14:00',
      status: 'pending' as const,
    },
    {
      id: '2',
      customerName: 'Siti Marlina',
      location: 'Ruko Frankfurt Blok C No. 8',
      vehicleType: 'Toyota Avanza 2019',
      service: 'Service AC',
      problem: 'AC tidak dingin',
      date: '2024-06-08',
      time: '16:30',
      status: 'on_way' as const,
    }
  ]);

  const { user, logout } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'on_way': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'on_way': return 'Dalam Perjalanan';
      case 'in_progress': return 'Sedang Dikerjakan';
      case 'completed': return 'Selesai';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">Dashboard Teknisi</h1>
          </div>

          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              {user?.profilePhoto ? (
                <img 
                  src={user.profilePhoto} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {user?.name?.charAt(0) || 'T'}
                </div>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Status Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Status Kerja
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {isActive ? 'Aktif' : 'Tidak Aktif'}
                </span>
                <SwitchComponent 
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {isActive 
                ? 'Anda siap menerima tugas baru' 
                : 'Aktifkan untuk mulai menerima tugas'}
            </p>
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Tugas Aktif</h2>
          
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Belum ada tugas aktif</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map(task => (
              <Card key={task.id} className="card-interactive">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{task.customerName}</CardTitle>
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusText(task.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Lokasi:</p>
                      <p className="text-muted-foreground">{task.location}</p>
                    </div>
                    <div>
                      <p className="font-medium">Kendaraan:</p>
                      <p className="text-muted-foreground">{task.vehicleType}</p>
                    </div>
                    <div>
                      <p className="font-medium">Layanan:</p>
                      <p className="text-muted-foreground">{task.service}</p>
                    </div>
                    <div>
                      <p className="font-medium">Waktu:</p>
                      <p className="text-muted-foreground">{task.date} - {task.time}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm">Masalah:</p>
                    <p className="text-muted-foreground text-sm">{task.problem}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="btn-primary">
                      Buka Maps
                    </Button>
                    <Button size="sm" variant="outline">
                      Chat Customer
                    </Button>
                    {task.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        Mulai Tugas
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Button size="sm" className="btn-primary">
                        Selesai
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Task History */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Riwayat Tugas</h2>
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Belum ada riwayat tugas</p>
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              variant="destructive" 
              onClick={logout}
              className="w-full"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TechnicianDashboard;
