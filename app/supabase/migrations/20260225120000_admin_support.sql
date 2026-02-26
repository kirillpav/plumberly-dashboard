-- Admin Support Migration
-- Adds is_admin flag to profiles and flagged flag to reviews
-- Creates admin RLS policies for dashboard access

-- 1. Add is_admin boolean to profiles
ALTER TABLE public.profiles ADD COLUMN is_admin boolean NOT NULL DEFAULT false;

-- 2. Add flagged boolean to reviews
ALTER TABLE public.reviews ADD COLUMN flagged boolean NOT NULL DEFAULT false;

-- 3. Create is_admin() security definer function (matches is_plumber()/is_customer() pattern)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 4. Admin RLS policies

-- Profiles: admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Plumber Details: admins can view and update all plumber details
CREATE POLICY "Admins can view all plumber details" ON public.plumber_details
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all plumber details" ON public.plumber_details
  FOR UPDATE USING (public.is_admin());

-- Enquiries: admins can view all enquiries
CREATE POLICY "Admins can view all enquiries" ON public.enquiries
  FOR SELECT USING (public.is_admin());

-- Jobs: admins can view all jobs
CREATE POLICY "Admins can view all jobs" ON public.jobs
  FOR SELECT USING (public.is_admin());

-- Reviews: admins can view, update, and delete all reviews
CREATE POLICY "Admins can view all reviews" ON public.reviews
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all reviews" ON public.reviews
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete all reviews" ON public.reviews
  FOR DELETE USING (public.is_admin());
