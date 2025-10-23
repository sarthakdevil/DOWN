-- Migration: Create invoices table (similar to payments table)
-- Created: 2025-01-22
-- Description: Adds invoices table for storing invoice records, matching payments table structure

-- Create invoices table (similar to payments table but with invoice-specific fields)
CREATE TABLE IF NOT EXISTS public.invoices (
  id SERIAL PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  plan_ids TEXT,
  plan_titles TEXT,
  total_amount INTEGER NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('completed', 'pending', 'failed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_email ON public.invoices(email);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own invoices
CREATE POLICY "Users can view their own invoices" ON public.invoices
    FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Create policy for service role to manage all invoices
CREATE POLICY "Service role can manage all invoices" ON public.invoices
    FOR ALL USING (auth.role() = 'service_role');