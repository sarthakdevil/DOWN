-- Update the plan_applications table to remove BYTEA column and use URL only
ALTER TABLE plan_applications 
DROP COLUMN IF EXISTS payment_screenshot_data;

-- Ensure the payment_screenshot_url column exists and is properly sized
ALTER TABLE plan_applications 
ALTER COLUMN payment_screenshot_url TYPE VARCHAR(1000);
