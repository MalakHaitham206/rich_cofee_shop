import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: orders, error: ordersError } = await supabase.from('orders').select('*');
  console.log('Orders:', orders);

  const { data: items, error: itemsError } = await supabase.from('order_items').select('*');
  console.log('Order Items:', items);
}
run();
