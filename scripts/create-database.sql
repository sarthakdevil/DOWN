-- Drop existing tables if they exist
DROP TABLE IF EXISTS plan_applications;
DROP TABLE IF EXISTS payments;

-- Create simplified plan_applications table
CREATE TABLE plan_applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    razorpay_order_id VARCHAR(100) NOT NULL,
    razorpay_payment_id VARCHAR(100),
    plan_ids TEXT NOT NULL, -- JSON array of plan IDs purchased
    plan_titles TEXT NOT NULL, -- JSON array of plan titles
    total_amount INTEGER NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_plan_applications_email ON plan_applications(email);
CREATE INDEX idx_plan_applications_razorpay_order_id ON plan_applications(razorpay_order_id);
CREATE INDEX idx_plan_applications_razorpay_payment_id ON plan_applications(razorpay_payment_id);
CREATE INDEX idx_plan_applications_created_at ON plan_applications(created_at);

-- Create payments table for Razorpay records
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    razorpay_order_id VARCHAR(100) NOT NULL,
    razorpay_payment_id VARCHAR(100) NOT NULL,
    razorpay_signature VARCHAR(200) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'pending',
    cart_items JSONB,
    customer_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for payments table
CREATE INDEX idx_payments_razorpay_order_id ON payments(razorpay_order_id);
CREATE INDEX idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
