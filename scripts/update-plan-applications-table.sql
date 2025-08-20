-- Update the plan_applications table to include payment fields
ALTER TABLE plan_applications 
ADD COLUMN IF NOT EXISTS salary VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'razorpay',
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS order_id VARCHAR(100);

-- Create indexes for payment fields
CREATE INDEX IF NOT EXISTS idx_plan_applications_payment_id ON plan_applications(payment_id);
CREATE INDEX IF NOT EXISTS idx_plan_applications_order_id ON plan_applications(order_id);
CREATE INDEX IF NOT EXISTS idx_plan_applications_payment_status ON plan_applications(payment_status);

-- Update existing records to have default payment method
UPDATE plan_applications 
SET payment_method = 'razorpay', payment_status = 'completed' 
WHERE payment_method IS NULL;
