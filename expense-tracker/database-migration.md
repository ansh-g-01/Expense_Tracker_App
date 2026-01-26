# Database Migration for Multi-User Support

## Instructions

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to: **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy and paste the SQL below
5. Click **Run** (or press Cmd/Ctrl + Enter)

---

## Migration SQL

```sql
-- ============================================
-- STEP 1: Add user_id columns to all tables
-- ============================================

-- Add user_id to expenses table
ALTER TABLE expenses 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to tags table
ALTER TABLE tags 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to budgets table
ALTER TABLE budgets 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============================================
-- STEP 2: Update unique constraints
-- ============================================

-- Tags: Make name unique per user (not globally)
ALTER TABLE tags 
DROP CONSTRAINT IF EXISTS tags_name_key;

ALTER TABLE tags 
ADD CONSTRAINT tags_name_user_unique UNIQUE (name, user_id);

-- Budgets: Make month unique per user (not globally)
ALTER TABLE budgets 
DROP CONSTRAINT IF EXISTS budgets_month_key;

ALTER TABLE budgets 
ADD CONSTRAINT budgets_month_user_unique UNIQUE (month, user_id);

-- ============================================
-- STEP 3: Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: Create RLS Policies for EXPENSES
-- ============================================

CREATE POLICY "Users can view their own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 5: Create RLS Policies for TAGS
-- ============================================

CREATE POLICY "Users can view their own tags"
  ON tags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
  ON tags FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 6: Create RLS Policies for BUDGETS
-- ============================================

CREATE POLICY "Users can view their own budgets"
  ON budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets"
  ON budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
  ON budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
  ON budgets FOR DELETE
  USING (auth.uid() = user_id);
```

---

## ⚠️ Important Notes

1. **Existing Data**: Any expenses/tags/budgets you created before this migration will have `user_id = NULL`. After running the migration and logging in, you won't see them because RLS filters by user_id. You can either:
   - Start fresh (recommended)
   - Manually update the data to assign it to your user ID

2. **Authentication**: Supabase Auth is already enabled by default. Email/Password provider is already configured.

3. **Verify Success**: After running the migration, check the **Table Editor** in Supabase to confirm:
   - All three tables now have a `user_id` column
   - RLS is enabled (you'll see a shield icon next to table names)

---

## What This Does

✅ Adds user isolation to all tables
✅ Each user only sees their own data
✅ Prevents users from accessing/modifying other users' data
✅ Enables multi-user support without code changes needed
