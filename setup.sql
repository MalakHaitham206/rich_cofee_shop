-- ================================
-- 1. PROFILES TABLE
-- ================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text default 'customer'
);

-- ================================
-- 2. CATEGORIES TABLE
-- ================================
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text,
  slug text unique
);

-- ================================
-- 3. PRODUCTS TABLE
-- ================================
create table products (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  price numeric,
  image_url text,
  category_id uuid references categories(id),
  is_active boolean default true
);

-- ================================
-- 4. ORDERS TABLE
-- ================================
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  status text default 'pending',
  total_amount numeric,
  created_at timestamp default now()
);

-- ================================
-- 5. ORDER ITEMS TABLE
-- ================================
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  product_id uuid references products(id),
  quantity int,
  unit_price numeric
);

-- ================================
-- ENABLE RLS
-- ================================
alter table profiles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- ================================
-- POLICIES
-- ================================

-- profiles
create policy "Users can view own profile"
on profiles for select
using (auth.uid() = id);

-- products (public read)
create policy "Anyone can view products"
on products for select
using (true);

-- orders
create policy "User can see own orders"
on orders for select
using (auth.uid() = user_id);

create policy "User can insert orders"
on orders for insert
with check (auth.uid() = user_id);

-- order_items
create policy "User can see own order items"
on order_items for select
using (
  order_id in (
    select id from orders where user_id = auth.uid()
  )
);

-- ================================
-- SEED: CATEGORIES
-- ================================
insert into categories (name, slug) values
('Desserts', 'desserts'),
('Iced Drinks', 'iced-drinks'),
('Hot Drinks', 'hot-drinks');

-- ================================
-- SEED: PRODUCTS
-- ================================
insert into products (name, description, price, image_url, category_id)
values

-- Desserts
('Chocolate Cake', 'Rich chocolate layered cake', 60,
'https://gpjnvqnsvnwgjpmcheia.supabase.co/storage/v1/object/public/products_images/desserts/chocolate_cake.jpg',
 (select id from categories where slug = 'desserts')),

('Cheesecake', 'Creamy classic cheesecake', 70,
'https://gpjnvqnsvnwgjpmcheia.supabase.co/storage/v1/object/public/products_images/desserts/cheesecake.jpg',
 (select id from categories where slug = 'desserts')),

('Croissant', 'Buttery flaky croissant', 30,
'https://gpjnvqnsvnwgjpmcheia.supabase.co/storage/v1/object/public/products_images/desserts/croissant.jpg',
 (select id from categories where slug = 'desserts')),

-- Iced Drinks
('Iced Spanish Latte', 'Creamy sweet iced coffee with condensed milk', 50,
'https://gpjnvqnsvnwgjpmcheia.supabase.co/storage/v1/object/public/products_images/iced_drinks/iced_latte.jpg',
 (select id from categories where slug = 'iced-drinks')),

('Iced Mocha', 'Chocolate iced coffee drink', 55,
'https://gpjnvqnsvnwgjpmcheia.supabase.co/storage/v1/object/public/products_images/iced_drinks/iced_mocha.jpg',
 (select id from categories where slug = 'iced-drinks')),

('Iced Caramel Macchiato', 'Sweet caramel iced coffee', 60,
'https://gpjnvqnsvnwgjpmcheia.supabase.co/storage/v1/object/public/products_images/iced_drinks/Iced_caramel_macchiato.jpg',
 (select id from categories where slug = 'iced-drinks')),

('Iced Tea', 'Refreshing cold tea', 35,
'https://gpjnvqnsvnwgjpmcheia.supabase.co/storage/v1/object/public/products_images/iced_drinks/iced_tea.jpg',
 (select id from categories where slug = 'iced-drinks')),

-- Hot Drinks
('Espresso', 'Strong black coffee shot', 25,
'https://gpjnvqnsvnwgjpmcheia.supabase.co/storage/v1/object/public/products_images/hot_drinks/espresso.jpg',
 (select id from categories where slug = 'hot-drinks')),

('Cappuccino', 'Espresso with steamed milk foam', 45,
'https://gpjnvqnsvnwgjpmcheia.supabase.co/storage/v1/object/public/products_images/hot_drinks/Cappuccino.jpg',
 (select id from categories where slug = 'hot-drinks')),

('Hot Chocolate', 'Warm chocolate drink', 40,
'https://gpjnvqnsvnwgjpmcheia.supabase.co/storage/v1/object/public/products_images/hot_drinks/hot_chocolate.jpg',
 (select id from categories where slug = 'hot-drinks'));