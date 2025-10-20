// archivo: db.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://wpcabzvsxajcuycwohpu.supabase.co",   // ← tu URL de Supabase
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwY2FienZzeGFqY3V5Y3dvaHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MDUwNzYsImV4cCI6MjA3NTk4MTA3Nn0.sv1oMrlNcGleLxc5c9a63aTqH3P9dwyHqHboeSTJ5SI"                   // ← tu "anon key" o "service role key"
);

export default supabase;




// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'gestor_archivos',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// module.exports = { pool };
