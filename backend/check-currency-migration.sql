-- Script to check if currency migration has been applied
-- Run this to verify the current state of the database

-- Check if currency column exists in event table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'event' AND column_name = 'currency';

-- Check if currency column still exists in ticket table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'ticket' AND column_name = 'currency';

-- Show sample event data to see if currency is populated
SELECT id, name, currency FROM event LIMIT 5;

-- Show sample ticket data to see current structure
SELECT id, title, price, currency FROM ticket LIMIT 5;
