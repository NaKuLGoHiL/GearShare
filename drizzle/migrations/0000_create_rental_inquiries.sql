CREATE TABLE public.rental_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gear_name text NOT NULL CHECK (char_length(gear_name) BETWEEN 1 AND 120),
  category text NOT NULL CHECK (char_length(category) BETWEEN 1 AND 60),
  start_date date NOT NULL,
  end_date date NOT NULL,
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 2 AND 100),
  customer_email text NOT NULL CHECK (char_length(customer_email) <= 255),
  customer_phone text NOT NULL CHECK (char_length(customer_phone) <= 20),
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 1000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);
GRANT INSERT ON public.rental_inquiries TO anon, authenticated;
GRANT ALL ON public.rental_inquiries TO service_role;
ALTER TABLE public.rental_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a pending inquiry" ON public.rental_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');