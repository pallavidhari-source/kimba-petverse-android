-- Add column to store date-specific time slots in host_applications
ALTER TABLE public.host_applications 
ADD COLUMN IF NOT EXISTS available_dates_slots JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.host_applications.available_dates_slots IS 'Stores date-specific time slots as JSON object where keys are dates and values are arrays of time slots';