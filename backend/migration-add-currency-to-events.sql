-- Migration script to add currency column to event table
-- This script should be run before deploying the new code

-- Add currency column to event table
ALTER TABLE event ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'USD';

-- Update existing events to have USD as default currency
UPDATE event SET currency = 'USD' WHERE currency IS NULL;

-- Remove currency column from ticket table (run this after updating the application code)
-- ALTER TABLE ticket DROP COLUMN currency;
