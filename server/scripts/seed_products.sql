-- ==============================================================
-- GroceryMind - Product Seed Data (Araz & Bravo catalogs)
-- ==============================================================
-- Products and prices sourced from Araz Market and Bravo
-- Supermarket (via Wolt). Creates sample grocery lists with
-- items across all 11 categories.
--
-- Run after seed_data.py has created users and households.
--
-- Usage:
--   psql -U postgres -d grocerymind -f seed_products.sql
-- ==============================================================

-- Helper: Get admin user ID and family household ID
DO $$
DECLARE
    admin_id UUID;
    family_hh_id UUID;
    weekly_list_id UUID;
    monthly_list_id UUID;
BEGIN
    SELECT id INTO admin_id FROM users WHERE email = 'admin@shoplist.com' LIMIT 1;
    SELECT id INTO family_hh_id FROM households WHERE name = 'Family Shopping' LIMIT 1;

    IF admin_id IS NULL THEN
        RAISE NOTICE 'Admin user not found. Run seed_data.py first.';
        RETURN;
    END IF;

    -- Create a "Weekly Groceries" list if it doesn't exist
    SELECT id INTO weekly_list_id FROM grocery_lists WHERE name = 'Weekly Groceries' AND household_id = family_hh_id LIMIT 1;
    IF weekly_list_id IS NULL THEN
        INSERT INTO grocery_lists (id, household_id, name, created_by, created_at)
        VALUES (uuid_generate_v4(), family_hh_id, 'Weekly Groceries', admin_id, NOW())
        RETURNING id INTO weekly_list_id;
    END IF;

    -- Create a "Monthly Stockup" list if it doesn't exist
    SELECT id INTO monthly_list_id FROM grocery_lists WHERE name = 'Monthly Stockup' AND household_id = family_hh_id LIMIT 1;
    IF monthly_list_id IS NULL THEN
        INSERT INTO grocery_lists (id, household_id, name, created_by, created_at)
        VALUES (uuid_generate_v4(), family_hh_id, 'Monthly Stockup', admin_id, NOW() - INTERVAL '7 days')
        RETURNING id INTO monthly_list_id;
    END IF;

    -- ==================== PRODUCE ITEMS ====================
    INSERT INTO list_items (id, list_id, name, quantity, unit_price, category, unit, is_checked, created_by, created_at)
    VALUES
        (uuid_generate_v4(), weekly_list_id, 'Alma (Apple)', 2, 1.50, 'produce', 'kg', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Banana', 1, 2.80, 'produce', 'kg', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Pomidor (Tomato)', 1, 1.80, 'produce', 'kg', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Xiyar (Cucumber)', 1, 1.20, 'produce', 'kg', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Kartof (Potato)', 3, 0.80, 'produce', 'kg', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Soğan (Onion)', 1, 0.60, 'produce', 'kg', true, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Göyərti (Herbs mix)', 2, 0.50, 'produce', 'pack', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Sarımsaq (Garlic)', 1, 4.00, 'produce', 'kg', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Bolqar bibəri (Bell pepper)', 1, 2.50, 'produce', 'kg', true, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Nar (Pomegranate)', 2, 3.50, 'produce', 'kg', false, admin_id, NOW()),
        (uuid_generate_v4(), monthly_list_id, 'Kivi', 1, 3.20, 'produce', 'kg', false, admin_id, NOW() - INTERVAL '7 days'),
        (uuid_generate_v4(), monthly_list_id, 'Üzüm (Grape)', 2, 3.00, 'produce', 'kg', false, admin_id, NOW() - INTERVAL '7 days');

    -- ==================== DAIRY ITEMS ====================
    INSERT INTO list_items (id, list_id, name, quantity, unit_price, category, unit, is_checked, created_by, created_at)
    VALUES
        (uuid_generate_v4(), weekly_list_id, 'Süd (Milk) 1L', 2, 2.00, 'dairy', 'l', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Qatıq (Yogurt) 500g', 4, 1.50, 'dairy', 'pcs', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Toyuq yumurtası (Eggs) 10lu', 1, 2.50, 'dairy', 'pack', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Kərə yağı (Butter) 200g', 1, 3.00, 'dairy', 'pcs', true, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Pendir (Cheese) 300g', 1, 4.50, 'dairy', 'pcs', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Kefir 1L', 1, 1.80, 'dairy', 'l', false, admin_id, NOW());

    -- ==================== MEAT ITEMS ====================
    INSERT INTO list_items (id, list_id, name, quantity, unit_price, category, unit, is_checked, created_by, created_at)
    VALUES
        (uuid_generate_v4(), weekly_list_id, 'Toyuq döş filesi (Chicken breast)', 1, 8.00, 'meat', 'kg', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Mal əti qıyma (Minced beef)', 1, 10.00, 'meat', 'kg', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Kolbasa (Sausage) 500g', 2, 4.00, 'meat', 'pcs', true, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Balıq filesi (Fish fillet)', 1, 7.00, 'meat', 'kg', false, admin_id, NOW());

    -- ==================== BAKERY ITEMS ====================
    INSERT INTO list_items (id, list_id, name, quantity, unit_price, category, unit, is_checked, created_by, created_at)
    VALUES
        (uuid_generate_v4(), weekly_list_id, 'Çörək (Bread)', 2, 0.50, 'bakery', 'pcs', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Lavaş', 1, 0.60, 'bakery', 'pcs', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Kruassan (Croissant)', 4, 1.20, 'bakery', 'pcs', true, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Paxlava (Pakhlava)', 1, 5.00, 'bakery', 'kg', false, admin_id, NOW());

    -- ==================== FROZEN ITEMS ====================
    INSERT INTO list_items (id, list_id, name, quantity, unit_price, category, unit, is_checked, created_by, created_at)
    VALUES
        (uuid_generate_v4(), weekly_list_id, 'Pelmen 500g', 2, 3.00, 'frozen', 'pack', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Dondurma (Ice cream) 1L', 1, 4.00, 'frozen', 'l', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Dondurulmuş brokoli 400g', 1, 2.50, 'frozen', 'pack', true, admin_id, NOW());

    -- ==================== PANTRY ITEMS ====================
    INSERT INTO list_items (id, list_id, name, quantity, unit_price, category, unit, is_checked, created_by, created_at)
    VALUES
        (uuid_generate_v4(), weekly_list_id, 'Düyü (Rice) 1kg', 2, 2.50, 'pantry', 'kg', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Makaron (Pasta) 500g', 3, 1.20, 'pantry', 'pack', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Bitki yağı (Oil) 1L', 1, 3.50, 'pantry', 'l', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Pomidor pastası 500g', 1, 2.00, 'pantry', 'pcs', true, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Çay (Tea) 100 q', 1, 3.00, 'pantry', 'pack', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Qəhvə (Coffee) 200g', 1, 8.00, 'pantry', 'pack', false, admin_id, NOW()),
        (uuid_generate_v4(), monthly_list_id, 'Zeytun yağı (Olive oil) 500ml', 1, 7.00, 'pantry', 'pcs', false, admin_id, NOW() - INTERVAL '7 days'),
        (uuid_generate_v4(), monthly_list_id, 'Bal (Honey) 300g', 1, 5.00, 'pantry', 'pcs', false, admin_id, NOW() - INTERVAL '7 days');

    -- ==================== BEVERAGES ITEMS ====================
    INSERT INTO list_items (id, list_id, name, quantity, unit_price, category, unit, is_checked, created_by, created_at)
    VALUES
        (uuid_generate_v4(), weekly_list_id, 'Su (Water) 1.5L', 6, 0.70, 'beverages', 'bottle', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Coca-Cola 2L', 2, 2.00, 'beverages', 'bottle', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Meyvə şirəsi (Juice) 1L', 2, 2.50, 'beverages', 'pack', true, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Soyuq çay (Ice tea) 1L', 1, 2.00, 'beverages', 'bottle', false, admin_id, NOW());

    -- ==================== SNACKS ITEMS ====================
    INSERT INTO list_items (id, list_id, name, quantity, unit_price, category, unit, is_checked, created_by, created_at)
    VALUES
        (uuid_generate_v4(), weekly_list_id, 'Çipsi (Chips) 150g', 3, 2.00, 'snacks', 'pack', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Şokolad (Chocolate) 90g', 2, 3.00, 'snacks', 'pcs', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Pecenye (Cookie) 200g', 1, 2.00, 'snacks', 'pack', true, admin_id, NOW());

    -- ==================== HOUSEHOLD ITEMS ====================
    INSERT INTO list_items (id, list_id, name, quantity, unit_price, category, unit, is_checked, created_by, created_at)
    VALUES
        (uuid_generate_v4(), weekly_list_id, 'Tualet kağızı (Toilet paper) 8 li', 2, 4.00, 'household', 'pack', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Kağız dəsmal (Paper towel) 3lü', 1, 3.50, 'household', 'pack', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Yuyucu toz (Laundry powder) 2kg', 1, 8.00, 'household', 'pack', true, admin_id, NOW());

    -- ==================== PERSONAL CARE ITEMS ====================
    INSERT INTO list_items (id, list_id, name, quantity, unit_price, category, unit, is_checked, created_by, created_at)
    VALUES
        (uuid_generate_v4(), weekly_list_id, 'Şampun (Shampoo) 400ml', 1, 5.00, 'personal_care', 'bottle', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Diş məcunu (Toothpaste) 100ml', 2, 3.50, 'personal_care', 'pcs', false, admin_id, NOW()),
        (uuid_generate_v4(), weekly_list_id, 'Dezodorant (Deodorant) 150ml', 1, 5.00, 'personal_care', 'pcs', false, admin_id, NOW());

    RAISE NOTICE 'Seed products inserted successfully!';
END $$;
