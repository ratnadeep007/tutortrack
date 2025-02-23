-- Add email column to users table
ALTER TABLE users ADD COLUMN email VARCHAR(255);

-- Update existing users with email from auth.users
UPDATE users u
SET email = au.email
FROM auth.users au
WHERE u.auth_user_id = au.id;

-- Make email column NOT NULL after updating existing data
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Add unique constraint on email
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Create updated function to handle new user creation with email
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, role, email)
  VALUES (NEW.id, 'student', NEW.email);
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Update is_profile_complete function to consider email
DROP FUNCTION IF EXISTS is_profile_complete(UUID);
CREATE OR REPLACE FUNCTION is_profile_complete(user_auth_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE auth_user_id = user_auth_id 
        AND full_name IS NOT NULL 
        AND phone_number IS NOT NULL
        AND email IS NOT NULL
    );
END;
$$ language 'plpgsql';
