
import { useState } from 'react';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ChatRoom from '@/components/services/ChatRoom';

const CustomerMessages = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  
  const [conversations] = useState([
    {
      id: '1',
      technicianName: 'Ahmad Supardi',
      orderId: 'ORD-001',
      lastMessage: 'Saya sudah dalam perjalanan ke lokasi Anda',
      timestamp: '10:30',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      technicianName: 'Budi Santoso',
      orderId: 'ORD-002',
      lastMessage: 'Terima kasih atas reviewnya!',
      timestamp: '09:15',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      technicianName: 'Citra Dewi',
      orderId: 'ORD-003',
      lastMessage: 'Foto kondisi kendaraan setelah diperbaiki',
      timestamp: '08:45',
      unreadCount: 1,
      isOnline: true
    }
  ]);

  const handleCall = (phoneNumber: string) => {
    console.log('Calling:', phoneNumber);
    window.open(`tel:${phoneNumber}`, '_self');
  };

  if (selectedChat) {
    const conversation = conversations.find(c => c.id === selectedChat);
    if (conversation) {
      return (
        <ChatRoom
          onBack={() => setSelectedChat(null)}
          onCall={handleCall}
          technicianName={conversation.technicianName}
          workshopName="Bengkel Maju Jaya" // Mock workshop name
        />
      );
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-6">Pesan</h1>

      <div className="space-y-4">
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <Card 
              key={conversation.id} 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedChat(conversation.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{conversation.technicianName}</CardTitle>
                      <div className={`w-2 h-2 rounded-full ${
                        conversation.isOnline ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      {conversation.orderId}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {conversation.lastMessage}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum ada pesan</h3>
            <p className="text-muted-foreground">
              Percakapan dengan teknisi akan muncul di sini
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerMessages;
