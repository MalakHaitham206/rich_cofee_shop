import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data } = await supabase.from('products').select('id, name, category_id, category:category_id(*)');
  console.log('Products:', JSON.stringify(data, null, 2));

  const res1 = await supabase.from('categories').select('*');
  console.log('categories:', res1.data, res1.error);
  
  const res2 = await supabase.from('Category').select('*');
  console.log('Category:', res2.data, res2.error);

  const res3 = await supabase.from('Categories').select('*');
  console.log('Categories:', res3.data, res3.error);
}
run();
