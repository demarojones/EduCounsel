/*
  # Create profiles and custom reasons tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, matches auth.users.id)
      - `role` (text, either 'counselor' or 'admin')
      - `first_name` (text)
      - `last_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `custom_reasons`
      - `id` (uuid, primary key)
      - `counselor_id` (uuid, references profiles.id)
      - `category` (text)
      - `subcategory` (text)
      - `is_shared` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('counselor', 'admin')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create custom reasons table
CREATE TABLE IF NOT EXISTS custom_reasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  counselor_id uuid REFERENCES profiles(id),
  category text NOT NULL,
  subcategory text NOT NULL,
  is_shared boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on custom_reasons
ALTER TABLE custom_reasons ENABLE ROW LEVEL SECURITY;

-- Policies for custom_reasons
CREATE POLICY "Counselors can manage their own reasons"
  ON custom_reasons
  FOR ALL
  TO authenticated
  USING (counselor_id = auth.uid())
  WITH CHECK (counselor_id = auth.uid());

CREATE POLICY "Users can view shared reasons"
  ON custom_reasons
  FOR SELECT
  TO authenticated
  USING (is_shared = true);

CREATE POLICY "Admins can manage all reasons"
  ON custom_reasons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_reasons_updated_at
  BEFORE UPDATE ON custom_reasons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();