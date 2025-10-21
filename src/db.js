// src/db.js
require('dotenv').config(); // 👈 Asegúrate de cargar el .env aquí también
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // 👈 NOMBRE CORRECTO

// Verifica que se carguen correctamente
console.log('URL:', supabaseUrl);
console.log('KEY:', supabaseKey ? '✔ cargada' : '❌ no cargada');

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
