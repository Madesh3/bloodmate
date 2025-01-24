-- Create secrets table
CREATE TABLE IF NOT EXISTS public.secrets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    secret TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.secrets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admin users to read secrets
CREATE POLICY "Enable read access for admin users only" ON public.secrets
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create policy to allow admin users to insert/update secrets
CREATE POLICY "Enable insert/update for admin users only" ON public.secrets
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Grant necessary permissions
GRANT ALL ON public.secrets TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;