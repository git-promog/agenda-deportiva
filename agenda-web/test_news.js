const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Prueba de lectura únicamente; no ejecuta insert, update ni delete.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY deben estar definidos.");
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

async function test() {
  const { data, error } = await supabase
    .from('noticias')
    .select('id, slug, titulo, fecha')
    .order('fecha', { ascending: false })
    .limit(1);

  console.log("READ RESULT:", { data, error });

  if (error) process.exitCode = 1;
}

test();
