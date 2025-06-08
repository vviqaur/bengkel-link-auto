
export type UserRole = 'customer' | 'technician' | 'workshop';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  username?: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  address?: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface CustomerUser extends User {
  role: 'customer';
}

export interface TechnicianUser extends User {
  role: 'technician';
  workshopName: string;
  partnershipNumber: string;
  idNumber: string;
  idPhoto: string;
  dateOfBirth: Date;
  rating: number;
  completedServices: number;
}

export interface WorkshopUser extends User {
  role: 'workshop';
  workshopName: string;
  province: string;
  city: string;
  postalCode: string;
  detailAddress: string;
  operatingHours: string;
  services: string[];
  vehicleTypes: string[];
  technicianCount: number;
  ownerName: string;
  idNumber: string;
  idPhoto: string;
  businessNumber: string;
  taxNumber: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isApproved: boolean;
  rating: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  partnershipNumber?: string;
  password: string;
  role: UserRole;
}

export interface SignupData {
  role: UserRole;
  name: string;
  username?: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  profilePhoto?: File;
  // Technician specific
  workshopName?: string;
  partnershipNumber?: string;
  idNumber?: string;
  idPhoto?: File;
  dateOfBirth?: Date;
  // Workshop specific
  province?: string;
  city?: string;
  postalCode?: string;
  detailAddress?: string;
  operatingHours?: string;
  services?: string[];
  vehicleTypes?: string[];
  technicianCount?: number;
  ownerName?: string;
  businessNumber?: string;
  taxNumber?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}
