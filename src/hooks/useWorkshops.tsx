
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Workshop {
  id: string;
  workshop_name: string;
  province: string;
  city: string;
  postal_code: string;
  detail_address: string;
  operating_hours: any;
  services: string[];
  vehicle_types: string[];
  technician_count: number;
  owner_name: string;
  rating: number;
  review_count: number;
  is_approved: boolean;
  // Add computed properties for UI
  distance?: string;
  estimatedTime?: string;
  operatingHours?: string;
  image?: string;
  address?: string;
  phone?: string;
  email?: string;
  technicians: Array<{
    id: string;
    name: string;
    phone: string | null;
    specialties: string[] | null;
    rating: number | null;
    review_count: number | null;
    is_available: boolean | null;
  }>;
}

export const useWorkshops = () => {
  return useQuery({
    queryKey: ['workshops'],
    queryFn: async () => {
      // Get workshop profiles with their associated profile data
      const { data: workshopProfiles, error: workshopError } = await supabase
        .from('workshop_profiles')
        .select(`
          *,
          profiles!inner(name, phone, email, address, profile_photo_url)
        `)
        .eq('is_approved', true)
        .order('rating', { ascending: false });

      if (workshopError) throw workshopError;

      // Get technician profiles
      const { data: technicianProfiles, error: technicianError } = await supabase
        .from('technician_profiles')
        .select(`
          *,
          profiles!inner(name, phone)
        `)
        .eq('is_available', true);

      if (technicianError) throw technicianError;

      // Transform and combine the data
      const workshopsWithTechnicians = workshopProfiles?.map(workshop => ({
        id: workshop.id,
        workshop_name: workshop.workshop_name,
        province: workshop.province,
        city: workshop.city,
        postal_code: workshop.postal_code,
        detail_address: workshop.detail_address,
        operating_hours: workshop.operating_hours,
        services: workshop.services,
        vehicle_types: workshop.vehicle_types,
        technician_count: workshop.technician_count,
        owner_name: workshop.owner_name,
        rating: workshop.rating || 0,
        review_count: workshop.review_count || 0,
        is_approved: workshop.is_approved,
        // Computed properties for backward compatibility
        name: workshop.workshop_name,
        address: `${workshop.detail_address}, ${workshop.city}, ${workshop.province} ${workshop.postal_code}`,
        phone: workshop.profiles?.phone || null,
        email: workshop.profiles?.email || null,
        image: workshop.profiles?.profile_photo_url || '/placeholder.svg',
        distance: '1.2 km', // This would be calculated based on user location
        estimatedTime: '15 menit', // This would be calculated based on distance
        operatingHours: getOperatingHoursText(workshop.operating_hours),
        technicians: technicianProfiles?.filter(tech => 
          tech.workshop_name === workshop.workshop_name
        ).map(tech => ({
          id: tech.id,
          name: tech.profiles?.name || 'Unknown',
          phone: tech.profiles?.phone || null,
          specialties: tech.specialties || [],
          rating: tech.rating || 0,
          review_count: tech.review_count || 0,
          is_available: tech.is_available
        })) || []
      })) || [];

      return workshopsWithTechnicians;
    },
  });
};

const getOperatingHoursText = (operatingHours: any): string => {
  if (!operatingHours) return '08:00 - 18:00';
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[new Date().getDay()];
  
  return operatingHours[currentDay] || '08:00 - 18:00';
};
