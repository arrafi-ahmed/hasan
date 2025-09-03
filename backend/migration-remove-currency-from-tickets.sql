-- Migration script to remove currency column from ticket table
-- This script should be run AFTER deploying the new code that no longer uses ticket currency

-- Remove currency column from ticket table
ALTER TABLE ticket DROP COLUMN currency;
