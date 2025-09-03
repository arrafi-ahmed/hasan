# Currency Display Fix Instructions

## Problem
The tickets page and other components are showing USD instead of the event currency because:
1. The database migration hasn't been run yet (currency column doesn't exist in event table)
2. Some frontend components have hardcoded USD values

## Solution Steps

### Step 1: Run Database Migration
First, check the current state of your database:
```sql
\i backend/check-currency-migration.sql
```

If the currency column doesn't exist in the event table, run the migration:
```sql
\i backend/migration-add-currency-to-events.sql
```

### Step 2: Update Existing Events
After running the migration, update existing events to have the correct currency:
```sql
-- Example: Update an event to use EUR instead of USD
UPDATE event SET currency = 'EUR' WHERE id = 1;

-- Check the results
SELECT id, name, currency FROM event;
```

### Step 3: Deploy Updated Code
The frontend code has been updated to:
- Use event currency instead of hardcoded USD
- Handle cases where currency field might not exist (fallback to USD)
- Validate currency format before using it

### Step 4: Test the Fix
1. Create a new event with a different currency (EUR, GBP)
2. Add tickets to the event
3. Check that the tickets page shows the correct currency
4. Test the checkout process
5. Verify that all price displays use the event currency

## Files Updated

### Frontend Components Fixed:
- `frontend/src/views/Tickets.vue` - Now uses event currency with validation
- `frontend/src/views/EventTickets.vue` - Updated formatPrice function
- `frontend/src/views/ExtrasPurchase.vue` - Fixed hardcoded USD
- `frontend/src/views/EventSponsorships.vue` - Fixed hardcoded USD values
- `frontend/src/views/Checkout.vue` - Removed unused defaultCurrency import

### Backend Already Updated:
- `backend/src/service/event.js` - Includes currency in INSERT/UPDATE
- `backend/src/service/ticket.js` - Removed currency handling
- `backend/src/service/stripe.js` - Uses event currency for payments
- `backend/src/service/order.js` - Uses event currency for orders

## Troubleshooting

### If currency still shows as USD:
1. Check if the database migration was run:
   ```sql
   SELECT column_name FROM information_schema.columns WHERE table_name = 'event' AND column_name = 'currency';
   ```

2. Check if the event has a currency value:
   ```sql
   SELECT id, name, currency FROM event WHERE id = YOUR_EVENT_ID;
   ```

3. Check browser console for any JavaScript errors

4. Verify that the event is being fetched with the currency field in the API response

### If you see errors:
- Make sure the database migration was run before deploying the code
- Check that all existing events have a currency value set
- Verify that the frontend is receiving the currency field in the API response

## Next Steps After Fix
Once everything is working:
1. Run the cleanup migration to remove currency from ticket table:
   ```sql
   \i backend/migration-remove-currency-from-tickets.sql
   ```

2. Test thoroughly with different currencies (USD, EUR, GBP)

3. Update any existing events to use the correct currency for their region
