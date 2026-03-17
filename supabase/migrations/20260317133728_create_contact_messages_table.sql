/*
  # Create contact_messages table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `name` (text) - Customer's full name
      - `email` (text) - Customer's email address
      - `phone` (text, optional) - Customer's phone number
      - `message` (text) - The message content
      - `status` (text) - Status of the message (new, contacted, closed)
      - `created_at` (timestamptz) - Timestamp when message was created
      - `updated_at` (timestamptz) - Timestamp when message was last updated

  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for public users to insert messages (write-only access)
    - Add policy for authenticated admin users to read all messages
    - Add policy for authenticated admin users to update message status
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'new' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages (write-only)
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to read all contact messages
CREATE POLICY "Authenticated users can read all contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update contact message status
CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries by status and date
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);