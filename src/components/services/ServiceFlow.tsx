
import { useState } from 'react';
import CallTechnician from './CallTechnician';
import WorkshopList from './WorkshopList';
import BookService from './BookService';

interface ServiceFlowProps {
  onBack: () => void;
  serviceType: 'call' | 'book';
}

interface ServiceBookingData {
  location: string;
  vehicleType: string;
  services: string[];
  problems: string[];
  description: string;
}

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

const ServiceFlow = ({ onBack, serviceType }: ServiceFlowProps) => {
  const [currentStep, setCurrentStep] = useState<'service-details' | 'workshop-list' | 'workshop-detail' | 'pricing' | 'booking'>('service-details');
  const [serviceData, setServiceData] = useState<ServiceBookingData | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  const handleServiceNext = (data: ServiceBookingData) => {
    setServiceData(data);
    setCurrentStep('workshop-list');
  };

  const handleWorkshopSelect = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    if (serviceType === 'call') {
      setCurrentStep('pricing');
    } else {
      setCurrentStep('booking');
    }
  };

  const handleBackToService = () => {
    setCurrentStep('service-details');
    setServiceData(null);
  };

  const handleBackToWorkshops = () => {
    setCurrentStep('workshop-list');
    setSelectedWorkshop(null);
  };

  if (currentStep === 'service-details') {
    if (serviceType === 'call') {
      return (
        <CallTechnician 
          onBack={onBack}
          onNext={handleServiceNext}
        />
      );
    } else {
      return (
        <BookService 
          onBack={onBack}
          onNext={handleServiceNext}
        />
      );
    }
  }

  if (currentStep === 'workshop-list') {
    return (
      <WorkshopList 
        onBack={handleBackToService}
        onSelectWorkshop={handleWorkshopSelect}
      />
    );
  }

  // For now, just show a placeholder for other steps
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Step: {currentStep}</h2>
        <p className="text-muted-foreground">
          Workshop: {selectedWorkshop?.name || 'None'}
        </p>
        <button 
          onClick={handleBackToWorkshops}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Back to Workshops
        </button>
      </div>
    </div>
  );
};

export default ServiceFlow;
