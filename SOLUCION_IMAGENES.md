# Solución al problema de imágenes no visibles

## Diagnóstico

Las imágenes no se muestran porque probablemente el bucket de Supabase Storage no está configurado correctamente.

## Pasos para solucionar:

### 1. Verificar/Crear el bucket en Supabase

Ve a tu dashboard de Supabase: https://grhosiwkympkdgolpwkq.supabase.co

1. Ve a **Storage** en el menú lateral
2. Verifica si existe un bucket llamado "vehículos" o "vehiculos"
3. Si NO existe, créalo con estos pasos:
   - Click en "New bucket"
   - Nombre: **vehiculos** (SIN tilde, solo caracteres ASCII)
   - Marca la opción **"Public bucket"** ✓
   - Click en "Create bucket"

### 2. Configurar políticas de acceso público

Si el bucket ya existe pero las imágenes no se ven:

1. Ve a **Storage** > Click en el bucket "vehículos" o "vehiculos"
2. Ve a la pestaña **"Policies"**
3. Crea una nueva política:
   - Click en "New policy"
   - Selecciona "For full customization"
   - Nombre: `Public Access`
   - Operación permitida: **SELECT**
   - Target roles: marca **`public`**
   - USING expression: `true`
   - Click en "Save"

### 3. Actualizar el código (si el bucket se llama "vehiculos" sin tilde)

Si creaste el bucket como "vehiculos" (sin tilde), actualiza el archivo:
`src/components/admin/VehicleForm.tsx` línea 26:

```tsx
const BUCKET_NAME = 'vehiculos'; // Cambiar de 'vehículos' a 'vehiculos'
```

### 4. Re-subir las imágenes (si ya tenías algunas)

Si ya habías subido imágenes al bucket con tilde:
1. Descárgalas del bucket anterior
2. Elimina el bucket con tilde "vehículos"
3. Súbelas nuevamente usando el formulario del admin

## Verificación rápida

Para verificar si funciona, abre la consola del navegador (F12) y ejecuta:

```javascript
// En la página de administración después de subir una imagen
console.log(window.location.origin);
```

La URL de la imagen debería verse así:
```
https://grhosiwkympkdgolpwkq.supabase.co/storage/v1/object/public/vehiculos/[ID_VEHICULO]/[IMAGEN].jpg
```

## Comandos SQL útiles (si necesitas limpiar datos)

```sql
-- Ver todas las imágenes registradas
SELECT * FROM vehicle_images;

-- Ver vehículos con sus URLs de portada
SELECT id, title, cover_image_url FROM vehicles;

-- Limpiar imágenes rotas (CUIDADO - ejecuta solo si estás seguro)
-- DELETE FROM vehicle_images WHERE url LIKE '%vehículos%';
```
