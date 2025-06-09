import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SchedulingProps {
  onBack: () => void;
  onNext: (scheduleData: ScheduleData) => void;
  workshopName: string;
}

interface ScheduleData {
  date: string;
  time: string;
  technician: string;
}

const Scheduling = ({ onBack, onNext, workshopName }: SchedulingProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      })
    };
  });

  const availableTimes = [
    '08:00', '09:00', '10:00', '11:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const availableTechnicians = [
    { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', name: 'Iwan Indrawan', rating: 5.0, available: true },
    { id: 'b2c3d4e5-f6g7-8901-2345-678901bcdefg', name: 'Dunu Arianna', rating: 4.3, available: true },
    { id: 'c3d4e5f6-g7h8-9012-3456-789012cdefgh', name: 'Jenna Ortegy', rating: 4.7, available: false }
  ];

  const handleContinue = () => {
    if (selectedDate && selectedTime && selectedTechnician) {
      const scheduleData: ScheduleData = {
        date: selectedDate,
        time: selectedTime,
        technician: selectedTechnician
      };
      onNext(scheduleData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Jadwalkan Layanan</h1>
            <p className="text-sm text-muted-foreground">{workshopName}</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Pilih Tanggal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {availableDates.map((date) => (
                <Button
                  key={date.value}
                  variant={selectedDate === date.value ? "default" : "outline"}
                  className="justify-start h-auto p-4"
                  onClick={() => setSelectedDate(date.value)}
                >
                  <div className="text-left">
                    <p className="font-medium">{date.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {date.value === new Date().toISOString().split('T')[0] ? 'Hari ini' : ''}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Selection */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pilih Waktu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="h-12"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
        </Card>
        )}

        {/* Technician Selection */}
        {selectedTime && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Pilih Teknisi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableTechnicians.map((tech) => (
                  <div
                    key={tech.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTechnician === tech.name
                        ? 'border-primary bg-primary/5'
                        : tech.available
                        ? 'border-border hover:border-primary/50'
                        : 'border-border bg-muted/50 cursor-not-allowed'
                    }`}
                    onClick={() => tech.available && setSelectedTechnician(tech.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {tech.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className={`font-medium ${
                            tech.available ? '' : 'text-muted-foreground'
                          }`}>
                            {tech.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-sm">⭐ {tech.rating}</span>
                            </div>
                            {!tech.available && (
                              <Badge variant="secondary" className="text-xs">
                                Tidak Tersedia
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {selectedTechnician === tech.name && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Summary */}
        {selectedDate && selectedTime && selectedTechnician && (
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Jadwal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal:</span>
                <span className="font-medium">
                  {availableDates.find(d => d.value === selectedDate)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Waktu:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teknisi:</span>
                <span className="font-medium">{selectedTechnician}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Continue Button */}
        <Button
          className="w-full btn-primary"
          disabled={!selectedDate || !selectedTime || !selectedTechnician}
          onClick={handleContinue}
        >
          Konfirmasi Jadwal
        </Button>
      </main>
    </div>
  );
};

export default Scheduling;