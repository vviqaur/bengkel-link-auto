
import { useState } from 'react';
import { Calendar, Filter, Clock, Star, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CustomerActivity = () => {
  const [filter, setFilter] = useState('all');
  
  const [activities] = useState([
    {
      id: '1',
      serviceName: 'Perbaikan AC',
      date: '2024-01-15',
      time: '14:30',
      status: 'Selesai',
      technician: 'Ahmad Supardi',
      workshop: 'Bengkel Maju Jaya',
      cost: 'Rp 350.000',
      rating: 4.8
    },
    {
      id: '2',
      serviceName: 'Ganti Oli + Filter',
      date: '2024-01-10',
      time: '09:00',
      status: 'Selesai',
      technician: 'Budi Santoso',
      workshop: 'Auto Service Center',
      cost: 'Rp 250.000',
      rating: 4.5
    },
    {
      id: '3',
      serviceName: 'Tune Up',
      date: '2024-01-08',
      time: '16:00',
      status: 'Sedang Berlangsung',
      technician: 'Citra Dewi',
      workshop: 'Bengkel Sejahtera',
      cost: 'Rp 450.000',
      rating: null
    },
    {
      id: '4',
      serviceName: 'Service Rem',
      date: '2024-01-05',
      time: '11:30',
      status: 'Dibatalkan',
      technician: 'Dedi Kurniawan',
      workshop: 'Motor Care',
      cost: 'Rp 0',
      rating: null
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-green-100 text-green-800';
      case 'Sedang Berlangsung': return 'bg-blue-100 text-blue-800';
      case 'Dibatalkan': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === '7days') {
      const activityDate = new Date(activity.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate >= weekAgo;
    }
    if (filter === '30days') {
      const activityDate = new Date(activity.date);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return activityDate >= monthAgo;
    }
    return true;
  });

  const handleViewDetail = (activityId: string) => {
    console.log('Viewing detail for activity:', activityId);
    // Will implement detail view later
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Riwayat Aktivitas</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Waktu</SelectItem>
            <SelectItem value="7days">7 Hari Terakhir</SelectItem>
            <SelectItem value="30days">30 Hari Terakhir</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="card-interactive">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{activity.serviceName}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {activity.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Teknisi:</p>
                    <p className="text-muted-foreground">{activity.technician}</p>
                  </div>
                  <div>
                    <p className="font-medium">Bengkel:</p>
                    <p className="text-muted-foreground">{activity.workshop}</p>
                  </div>
                  <div>
                    <p className="font-medium">Biaya:</p>
                    <p className="text-muted-foreground font-semibold">{activity.cost}</p>
                  </div>
                  {activity.rating && (
                    <div>
                      <p className="font-medium">Rating:</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-muted-foreground">{activity.rating}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleViewDetail(activity.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat Detail
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum ada riwayat aktivitas</h3>
            <p className="text-muted-foreground italic text-sm">
              Riwayat service Anda akan muncul di sini
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerActivity;
