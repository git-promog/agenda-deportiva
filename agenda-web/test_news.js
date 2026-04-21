const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const noticiaParaSubir = {
    titulo: "Test Nota",
    contenido: "Contenido de test",
    imagen_url: "",
    fecha: "2024-06-20",
    slug: "test-nota"
  };

  const { data, error } = await supabase.from('noticias').insert([noticiaParaSubir]);
  console.log("INSERT RESULT:", { data, error });
}

test();
