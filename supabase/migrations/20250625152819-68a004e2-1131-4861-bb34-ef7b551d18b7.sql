
-- First, let's add missing columns to existing tables without inserting invalid data

-- Update profiles table to support all user data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS id_number text,
ADD COLUMN IF NOT EXISTS id_photo_url text;

-- Ensure technician_profiles table exists with proper structure
DROP TABLE IF EXISTS public.technician_profiles CASCADE;
CREATE TABLE public.technician_profiles (
    id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    workshop_name text NOT NULL,
    partnership_number text UNIQUE NOT NULL,
    id_number text NOT NULL,
    id_photo_url text NOT NULL,
    specialties text[] DEFAULT '{}',
    rating numeric DEFAULT 0,
    review_count integer DEFAULT 0,
    is_available boolean DEFAULT true
);

-- Ensure workshop_profiles table exists with proper structure
DROP TABLE IF EXISTS public.workshop_profiles CASCADE;
CREATE TABLE public.workshop_profiles (
    id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    workshop_name text NOT NULL,
    province text NOT NULL,
    city text NOT NULL,
    postal_code text NOT NULL,
    detail_address text NOT NULL,
    operating_hours jsonb NOT NULL,
    services text[] NOT NULL,
    vehicle_types text[] NOT NULL,
    technician_count integer NOT NULL,
    owner_name text NOT NULL,
    business_number text,
    tax_number text,
    bank_name text,
    account_number text,
    account_name text,
    partnership_number text UNIQUE,
    is_approved boolean DEFAULT false,
    rating numeric DEFAULT 0,
    review_count integer DEFAULT 0
);

-- Add RLS policies for new tables
ALTER TABLE public.technician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for technician_profiles
CREATE POLICY "Technicians can view their own profile"
ON public.technician_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Technicians can update their own profile"
ON public.technician_profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Technicians can insert their own profile"
ON public.technician_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policies for workshop_profiles  
CREATE POLICY "Workshops can view their own profile"
ON public.workshop_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Workshops can update their own profile"
ON public.workshop_profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Workshops can insert their own profile"
ON public.workshop_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow public read access to approved workshops for customers
CREATE POLICY "Public can view approved workshops"
ON public.workshop_profiles FOR SELECT
USING (is_approved = true);

-- Insert promo data only (no user-dependent data)
INSERT INTO public.promos (
    title, description, poster_image_url, discount_percentage, 
    terms_conditions, expiry_date, eligibility_criteria, promo_code, is_active
) VALUES
('Promo Pengguna Baru', 
 'Nikmati diskon 50% untuk pemesanan layanan pertama Anda.', 
 '/placeholder-promo-1.jpg', 
 50,
 ARRAY['Hanya untuk pengguna baru yang belum pernah memesan layanan'],
 '2025-12-31',
 '{"isNewUser": true}',
 'NEWUSER50',
 true),
('Promo Awal Bulan', 
 'Dapatkan diskon 20% untuk setiap pemesanan di awal bulan.', 
 '/placeholder-promo-2.jpg', 
 20,
 ARRAY['Berlaku untuk semua pengguna'],
 '2025-06-30',
 '{"allUsers": true}',
 'MONTH20',
 true),
('Promo Undang Teman', 
 'Dapatkan bonus Rp50.000 untuk setiap teman yang diundang dan memesan layanan.', 
 '/placeholder-promo-3.jpg', 
 0,
 ARRAY['Minimal 1 teman diundang yang berhasil memesan'],
 '2025-12-31',
 '{"inviteCount": 1}',
 'INVITE50K',
 true),
('Promo Pengguna Setia', 
 'Diskon 30% untuk pengguna dengan 5 atau lebih pemesanan.', 
 '/placeholder-promo-4.jpg', 
 30,
 ARRAY['Minimal 5 pemesanan layanan'],
 '2025-12-31',
 '{"serviceCount": 5}',
 'LOYAL30',
 true),
('Promo Hari Pancasila', 
 'Rayakan Hari Pancasila dengan diskon 25% untuk semua layanan.', 
 '/placeholder-promo-5.jpg', 
 25,
 ARRAY['Berlaku untuk semua pengguna, hanya pada 1 Juni 2025'],
 '2025-06-01',
 '{"allUsers": true, "specificDate": "2025-06-01"}',
 'PANCASILA25',
 true),
('Promo Tanggal Kembar 6.6', 
 'Diskon 66% untuk pemesanan pada tanggal 6 Juni 2025.', 
 '/placeholder-promo-6.jpg', 
 66,
 ARRAY['Berlaku untuk semua pengguna, hanya pada 6 Juni 2025'],
 '2025-06-06',
 '{"allUsers": true, "specificDate": "2025-06-06"}',
 'DOUBLE66',
 true)
ON CONFLICT (promo_code) DO NOTHING;

-- Enable RLS on promos
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active promos"
ON public.promos FOR SELECT
USING (is_active = true);

-- Fix bookings table to ensure proper relationships
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS promo_code text,
ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;

-- Enable RLS on bookings if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bookings' AND policyname = 'Users can view their own bookings'
    ) THEN
        ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own bookings"
        ON public.bookings FOR SELECT
        USING (auth.uid() = user_id);

        CREATE POLICY "Users can create their own bookings"
        ON public.bookings FOR INSERT
        WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own bookings"
        ON public.bookings FOR UPDATE
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Enable RLS on other core tables
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_promo_claims' AND policyname = 'Users can view their own promo claims'
    ) THEN
        ALTER TABLE public.user_promo_claims ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own promo claims"
        ON public.user_promo_claims FOR SELECT
        USING (auth.uid() = user_id);

        CREATE POLICY "Users can create their own promo claims"
        ON public.user_promo_claims FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notifications' AND policyname = 'Users can view their own notifications'
    ) THEN
        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own notifications"
        ON public.notifications FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Update the handle_new_user function to support additional fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name, username, phone, email, date_of_birth, id_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.email,
    CASE 
      WHEN NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'date_of_birth')::date 
      ELSE NULL 
    END,
    NEW.raw_user_meta_data->>'id_number'
  );
  
  -- Create role-specific profile if needed
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'technician' THEN
    INSERT INTO public.technician_profiles (
      id, workshop_name, partnership_number, id_number, id_photo_url
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'workshop_name', 'Unknown Workshop'),
      COALESCE(NEW.raw_user_meta_data->>'partnership_number', 'TEMP-' || NEW.id::text),
      COALESCE(NEW.raw_user_meta_data->>'id_number', ''),
      COALESCE(NEW.raw_user_meta_data->>'id_photo_url', '')
    );
  ELSIF COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'workshop' THEN
    INSERT INTO public.workshop_profiles (
      id, workshop_name, province, city, postal_code, detail_address,
      operating_hours, services, vehicle_types, technician_count, owner_name
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'workshop_name', 'Unknown Workshop'),
      COALESCE(NEW.raw_user_meta_data->>'province', 'Unknown'),
      COALESCE(NEW.raw_user_meta_data->>'city', 'Unknown'),
      COALESCE(NEW.raw_user_meta_data->>'postal_code', '00000'),
      COALESCE(NEW.raw_user_meta_data->>'detail_address', 'Unknown Address'),
      COALESCE(NEW.raw_user_meta_data->>'operating_hours', '{"monday": "08:00-18:00", "tuesday": "08:00-18:00", "wednesday": "08:00-18:00", "thursday": "08:00-18:00", "friday": "08:00-18:00", "saturday": "08:00-18:00", "sunday": "08:00-17:00"}')::jsonb,
      COALESCE(
        CASE 
          WHEN NEW.raw_user_meta_data->>'services' IS NOT NULL 
          THEN string_to_array(NEW.raw_user_meta_data->>'services', ',')
          ELSE ARRAY['Servis Rutin']
        END,
        ARRAY['Servis Rutin']
      ),
      COALESCE(
        CASE 
          WHEN NEW.raw_user_meta_data->>'vehicle_types' IS NOT NULL 
          THEN string_to_array(NEW.raw_user_meta_data->>'vehicle_types', ',')
          ELSE ARRAY['Semua Merek']
        END,
        ARRAY['Semua Merek']
      ),
      COALESCE((NEW.raw_user_meta_data->>'technician_count')::integer, 1),
      COALESCE(NEW.raw_user_meta_data->>'owner_name', NEW.raw_user_meta_data->>'name', 'Unknown Owner')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
