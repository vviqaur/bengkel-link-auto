
-- Update the handle_new_user function to ensure all user data is properly saved
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table with all available data
  INSERT INTO public.profiles (id, role, name, username, phone, email, date_of_birth, id_number, id_photo_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.email,
    CASE 
      WHEN NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'date_of_birth')::date 
      ELSE NULL 
    END,
    NEW.raw_user_meta_data->>'id_number',
    NEW.raw_user_meta_data->>'id_photo_url'
  );
  
  -- Create role-specific profiles
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'technician' THEN
    INSERT INTO public.technician_profiles (
      id, workshop_name, partnership_number, id_number, id_photo_url
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'workshop_name', 'Unknown Workshop'),
      COALESCE(NEW.raw_user_meta_data->>'partnership_number', 'TECH-' || substr(NEW.id::text, 1, 8)),
      COALESCE(NEW.raw_user_meta_data->>'id_number', ''),
      COALESCE(NEW.raw_user_meta_data->>'id_photo_url', '')
    );
  END IF;
  
  -- Workshop profiles are handled differently (pending approval)
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
