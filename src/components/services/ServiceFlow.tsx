
import { useState } from 'react';
import CallTechnician from './CallTechnician';
import WorkshopList from './WorkshopList';
import BookService from './BookService';
import WorkshopDetail from './WorkshopDetail';
import PricingEstimation from './PricingEstimation';
import BookingStatus from './BookingStatus';
import Payment from './Payment';
import Rating from './Rating';
import Scheduling from './Scheduling';
import LocationSelection from './LocationSelection';
import ServiceDetails from './ServiceDetails';
import ChatRoom from './ChatRoom';
import CustomerMessages from '../dashboard/customer/CustomerMessages';

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

interface ScheduleData {
  date: string;
  time: string;
  technician: string;
}

type FlowStep = 'service-details' | 'location-selection' | 'service-form' | 'workshop-list' | 'workshop-detail' | 'scheduling' | 'pricing' | 'booking-status' | 'payment' | 'rating' | 'chat';

const ServiceFlow = ({ onBack, serviceType }: ServiceFlowProps) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('service-details');
  const [serviceData, setServiceData] = useState<ServiceBookingData | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingType, setBookingType] = useState<'location' | 'workshop' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');

  const handleServiceNext = (data: ServiceBookingData) => {
    setServiceData(data);
    setCurrentStep('workshop-list');
  };

  const handleBookingTypeSelect = (type: 'location' | 'workshop') => {
    setBookingType(type);
    if (type === 'workshop') {
      setCurrentStep('workshop-list');
    } else {
      setCurrentStep('location-selection');
    }
  };

  const handleLocationNext = (location: string) => {
    setSelectedLocation(location);
    setCurrentStep('service-form');
  };

  const handleServiceFormNext = (data: ServiceBookingData) => {
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
      setCurrentStep('scheduling');
    }
  };

  const handleScheduleNext = (data: ScheduleData) => {
    setScheduleData(data);
    setCurrentStep('pricing');
  };

  const handlePricingNext = (amount: number) => {
    setTotalAmount(amount);
    setCurrentStep('booking-status');
  };

  const handlePaymentNext = () => {
    setCurrentStep('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentStep('rating');
  };

  const handleRatingComplete = () => {
    onBack();
  };

  const handleChatOpen = () => {
    setCurrentStep('chat');
  };

  const handleCallTechnician = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  // Navigation helpers
  const handleBackToService = () => {
    setCurrentStep('service-details');
    setServiceData(null);
    setBookingType(null);
  };

  const handleBackToLocation = () => {
    setCurrentStep('location-selection');
  };

  const handleBackToServiceForm = () => {
    setCurrentStep('service-form');
  };

  const handleBackToWorkshops = () => {
    if (serviceType === 'book' && bookingType === 'location') {
      setCurrentStep('service-form');
    } else {
      setCurrentStep('service-details');
    }
    setSelectedWorkshop(null);
  };

  const handleBackToWorkshopDetail = () => {
    setCurrentStep('workshop-detail');
    if (serviceType === 'book') {
      setScheduleData(null);
    }
  };

  const handleBackToScheduling = () => {
    setCurrentStep('scheduling');
  };

  const handleBackToPricing = () => {
    setCurrentStep('pricing');
  };

  const handleBackToBookingStatus = () => {
    setCurrentStep('booking-status');
  };

  const handleBackToPayment = () => {
    setCurrentStep('payment');
  };

  const handleBackFromChat = () => {
    setCurrentStep('pricing');
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
          onNext={handleBookingTypeSelect}
        />
      );
    }
  }

  if (currentStep === 'location-selection') {
    return (
      <LocationSelection
        onBack={handleBackToService}
        onNext={handleLocationNext}
      />
    );
  }

  if (currentStep === 'service-form') {
    return (
      <ServiceDetails
        onBack={handleBackToLocation}
        onNext={handleServiceFormNext}
        location={selectedLocation}
      />
    );
  }

  if (currentStep === 'workshop-list') {
    return (
      <WorkshopList 
        onBack={handleBackToWorkshops}
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

  if (currentStep === 'scheduling' && selectedWorkshop) {
    return (
      <Scheduling
        workshopName={selectedWorkshop.name}
        onBack={handleBackToWorkshopDetail}
        onNext={handleScheduleNext}
      />
    );
  }

  if (currentStep === 'pricing' && serviceData && selectedWorkshop) {
    return (
      <PricingEstimation
        serviceData={serviceData}
        workshopName={selectedWorkshop.name}
        onBack={serviceType === 'book' ? handleBackToScheduling : handleBackToWorkshopDetail}
        onNext={() => handlePricingNext(750000)}
        onChat={handleChatOpen}
        onCall={handleCallTechnician}
        serviceType={serviceType}
      />
    );
  }

  if (currentStep === 'chat' && selectedWorkshop) {
    const technicianName = scheduleData?.technician || selectedWorkshop.technicians[0]?.name || 'Ahmad Supardi';
    
    return (
      <ChatRoom
        onBack={handleBackFromChat}
        onCall={handleCallTechnician}
        technicianName={technicianName}
        workshopName={selectedWorkshop.name}
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

  if (currentStep === 'payment') {
    return (
      <Payment
        onBack={handleBackToBookingStatus}
        onNext={handlePaymentComplete}
        totalAmount={totalAmount}
        serviceData={serviceData}
      />
    );
  }

  if (currentStep === 'rating' && selectedWorkshop) {
    const technicianName = scheduleData?.technician || selectedWorkshop.technicians[0]?.name || 'Ahmad Supardi';
    
    return (
      <Rating
        onBack={handleBackToPayment}
        onComplete={handleRatingComplete}
        technicianName={technicianName}
        workshopName={selectedWorkshop.name}
      />
    );
  }

  // Fallback
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
