## Sobre el desarrollo

Este proyecto fue desarrollado utilizando **Cursor** y asistencia de herramientas de inteligencia artificial para acelerar la escritura de código y la documentación.  
Todas las decisiones técnicas, estructura del proyecto y personalizaciones fueron realizadas de forma manual, garantizando comprensión y control total sobre el funcionamiento del sistema.


# 🚀 Guía de Despliegue en Render

## Pasos para desplegar en Render

### 1. Preparar Supabase

1. **Crear proyecto en Supabase:**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Anota la URL y la ANON KEY

2. **Configurar la base de datos:**
   - Ve al SQL Editor en Supabase
   - Ejecuta el contenido del archivo `supabase-schema.sql`
   - Esto creará las tablas necesarias

### 2. Configurar Variables de Entorno

En Render, agrega estas variables de entorno:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 3. Desplegar en Render

1. **Conectar repositorio:**
   - Conecta tu repositorio de GitHub a Render
   - Selecciona el directorio `modulo/` como raíz del proyecto

2. **Configuración del servicio:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node Version:** 18.x o superior

3. **Variables de entorno:**
   - Agrega las variables de Supabase desde el paso 2

### 4. Verificar el despliegue

Una vez desplegado, verifica:

1. **Health Check:** `https://tu-app.onrender.com/api/health`
2. **Aplicación:** `https://tu-app.onrender.com/`

## 🔧 Estructura del Proyecto

```
modulo/
├── src/
│   ├── db.js              # Configuración de Supabase
│   └── routes/
│       └── files.js        # Rutas de la API
├── uploads/               # Directorio para archivos (se crea automáticamente)
├── server.js              # Servidor principal
├── package.json           # Dependencias
├── supabase-schema.sql    # Esquema de base de datos
└── index.html             # Frontend
```

## 📋 Checklist de Despliegue

- [ ] Proyecto creado en Supabase
- [ ] Esquema ejecutado en Supabase
- [ ] Variables de entorno configuradas en Render
- [ ] Repositorio conectado a Render
- [ ] Build exitoso
- [ ] Health check funcionando
- [ ] Aplicación accesible

## 🐛 Solución de Problemas

### Error de conexión a Supabase
- Verifica que las variables de entorno estén correctas
- Asegúrate de que el proyecto de Supabase esté activo

### Error 404 en rutas
- Verifica que el directorio raíz esté configurado como `modulo/`
- Asegúrate de que el archivo `server.js` esté en la raíz

### Error de permisos en uploads
- Render creará automáticamente el directorio `uploads/`
- Los archivos se almacenan temporalmente en el servidor

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Render
2. Verifica las variables de entorno
3. Confirma que Supabase esté funcionando
