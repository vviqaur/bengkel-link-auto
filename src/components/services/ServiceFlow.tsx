
import { useState } from 'react';
import CallTechnician from './CallTechnician';
import WorkshopList from './WorkshopList';
import BookService from './BookService';
import WorkshopDetail from './WorkshopDetail';
import PricingEstimation from './PricingEstimation';
import BookingStatus from './BookingStatus';

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
  bookingType?: 'location' | 'workshop';
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

type FlowStep = 'service-details' | 'workshop-list' | 'workshop-detail' | 'pricing' | 'booking-status' | 'payment' | 'rating';

const ServiceFlow = ({ onBack, serviceType }: ServiceFlowProps) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('service-details');
  const [serviceData, setServiceData] = useState<ServiceBookingData | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  const handleServiceNext = (data: ServiceBookingData) => {
    setServiceData(data);
    setCurrentStep('workshop-list');
  };

  const handleWorkshopSelect = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setCurrentStep('workshop-detail');
  };

  const handleWorkshopDetailNext = () => {
    if (serviceType === 'call') {
      setCurrentStep('pricing');
    } else {
      // For book service, we would go to scheduling step
      // For now, let's go to pricing as well
      setCurrentStep('pricing');
    }
  };

  const handlePricingNext = () => {
    setCurrentStep('booking-status');
  };

  const handlePaymentNext = () => {
    setCurrentStep('payment');
  };

  const handleBackToService = () => {
    setCurrentStep('service-details');
    setServiceData(null);
  };

  const handleBackToWorkshops = () => {
    setCurrentStep('workshop-list');
    setSelectedWorkshop(null);
  };

  const handleBackToWorkshopDetail = () => {
    setCurrentStep('workshop-detail');
  };

  const handleBackToPricing = () => {
    setCurrentStep('pricing');
  };

  const handleBackToBookingStatus = () => {
    setCurrentStep('booking-status');
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

  if (currentStep === 'workshop-detail' && selectedWorkshop) {
    return (
      <WorkshopDetail
        workshop={selectedWorkshop}
        onBack={handleBackToWorkshops}
        onNext={handleWorkshopDetailNext}
        serviceType={serviceType}
      />
    );
  }

  if (currentStep === 'pricing' && serviceData && selectedWorkshop) {
    return (
      <PricingEstimation
        serviceData={serviceData}
        workshopName={selectedWorkshop.name}
        onBack={handleBackToWorkshopDetail}
        onNext={handlePricingNext}
      />
    );
  }

  if (currentStep === 'booking-status') {
    return (
      <BookingStatus
        onBack={handleBackToPricing}
        onPayment={handlePaymentNext}
        serviceType={serviceType}
      />
    );
  }

  // For other steps, show placeholder for now
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Step: {currentStep}</h2>
        <p className="text-muted-foreground">
          Workshop: {selectedWorkshop?.name || 'None'}
        </p>
        <button 
          onClick={() => setCurrentStep('service-details')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Back to Start
        </button>
      </div>
    </div>
  );
};

export default ServiceFlow;
