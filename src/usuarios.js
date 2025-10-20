// archivo: usuarios.js
import supabase from './db.js';

// Obtener todos los usuarios
const { data, error } = await supabase.from('usuarios').select('*');
console.log(data); // ¡Aquí están tus datos!