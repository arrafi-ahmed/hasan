# Currency Migration: From Ticket-Level to Event-Level

## Overview
This migration moves currency handling from the ticket level to the event level, providing a more logical and consistent approach to currency management.

## Changes Made

### Database Schema Changes
1. **Added `currency` column to `event` table**
   - Type: `VARCHAR(3) NOT NULL DEFAULT 'USD'`
   - All existing events will default to USD

2. **Removed `currency` column from `ticket` table**
   - Tickets now inherit currency from their parent event

### Backend Changes
1. **Event Service (`backend/src/service/event.js`)**
   - Added currency handling in INSERT and UPDATE operations
   - Currency is now included in event creation and updates

2. **Ticket Service (`backend/src/service/ticket.js`)**
   - Removed currency handling from ticket operations
   - Tickets no longer store currency information

3. **Stripe Service (`backend/src/service/stripe.js`)**
   - Updated all payment intent creation to use event currency
   - `createPaymentIntent`, `createOrderPaymentIntent`, and `createExtrasPaymentIntent` now fetch event currency

4. **Order Service (`backend/src/service/order.js`)**
   - Updated to use event currency instead of hardcoded defaultCurrency

### Frontend Changes
1. **Event Model (`frontend/src/models/Event.js`)**
   - Added currency property with validation
   - Currency is included in toJSON() method

2. **Ticket Model (`frontend/src/models/Ticket.js`)**
   - Removed currency property

3. **Event Creation/Editing Forms**
   - Added currency selection dropdown in `EventAdd.vue` and `EventEdit.vue`
   - Currency is now part of event creation and editing process

4. **Ticket Management**
   - Removed currency selection from `EventTickets.vue`
   - Tickets now inherit currency from their event

5. **Display Components**
   - Updated `Tickets.vue` to use event currency instead of first ticket currency

## Migration Steps

### Step 1: Database Migration (Before Code Deployment)
```sql
-- Run this script first
\i backend/migration-add-currency-to-events.sql
```

### Step 2: Deploy New Code
Deploy the updated application code with all the changes listed above.

### Step 3: Final Database Cleanup (After Code Deployment)
```sql
-- Run this script after confirming the new code works
\i backend/migration-remove-currency-from-tickets.sql
```

## Benefits of This Migration

1. **Logical Consistency**: Events are typically held in specific geographic regions with local currencies
2. **Simplified User Experience**: Event organizers set currency once at event creation
3. **Technical Benefits**: Single source of truth for currency, simplified payment processing
4. **Business Logic Alignment**: Real-world events typically use one currency

## Testing Checklist

- [ ] Create new event with different currencies (USD, EUR, GBP)
- [ ] Edit existing event and change currency
- [ ] Create tickets for events with different currencies
- [ ] Process payments with different currencies
- [ ] Verify price displays use correct currency symbols
- [ ] Test order creation with event currency
- [ ] Verify sponsorship packages use event currency

## Rollback Plan

If issues arise, you can rollback by:
1. Reverting the code changes
2. Adding back the currency column to ticket table
3. Removing the currency column from event table

## Notes

- All existing events will default to USD currency
- Historical orders and sponsorships will retain their original currency values
- The migration maintains backward compatibility for existing data
