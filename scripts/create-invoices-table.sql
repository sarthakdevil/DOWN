-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    plan_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_id VARCHAR(255) NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    purchase_date TIMESTAMP NOT NULL,
    application_id INTEGER REFERENCES plan_applications(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_email ON invoices(customer_email);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own invoices
CREATE POLICY "Users can view their own invoices" ON invoices
    FOR SELECT USING (customer_email = auth.jwt() ->> 'email');

-- Policy to allow service role to manage all invoices
CREATE POLICY "Service role can manage all invoices" ON invoices
    FOR ALL USING (auth.role() = 'service_role');