CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  razorpay_order_id TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT,
  plan_ids TEXT,
  plan_titles TEXT,
  total_amount INTEGER NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('completed', 'pending', 'failed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for payments table
CREATE INDEX idx_payments_razorpay_order_id ON payments(razorpay_order_id);
CREATE INDEX idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
