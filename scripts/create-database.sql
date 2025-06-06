-- Drop existing table if it exists
DROP TABLE IF EXISTS plan_applications;

-- Create the updated plan_applications table
CREATE TABLE plan_applications (
    id SERIAL PRIMARY KEY,
    plan_id VARCHAR(50) NOT NULL,
    plan_title VARCHAR(100) NOT NULL,
    plan_price INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    instagram_id VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    interested_in VARCHAR(20) NOT NULL,
    relationship_style VARCHAR(50),
    ideal_first_meeting VARCHAR(50),
    love_language VARCHAR(50),
    party_vibe VARCHAR(50),
    flirting_style VARCHAR(50),
    toxic_trait VARCHAR(50),
    bollywood_character VARCHAR(50),
    green_flag VARCHAR(50),
    perfect_date TEXT,
    pitch_yourself TEXT,
    payment_screenshot_url VARCHAR(500),
    payment_screenshot_data BYTEA,
    agree_to_terms BOOLEAN DEFAULT FALSE,
    agree_to_privacy BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_plan_applications_email ON plan_applications(email);
CREATE INDEX idx_plan_applications_status ON plan_applications(status);
CREATE INDEX idx_plan_applications_created_at ON plan_applications(created_at);
