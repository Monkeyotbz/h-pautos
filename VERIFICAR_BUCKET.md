# ✅ Verificación del Bucket "vehículos"

## 1. Verificar que el bucket sea PÚBLICO

1. En Supabase Storage, haz click en el bucket **"vehículos"**
2. En el menú de los 3 puntos (...) o en configuración del bucket
3. Verifica que **"Public bucket"** esté ACTIVADO ✅
4. Si no lo está, actívalo

## 2. Verificar las Políticas (IMPORTANTE)

1. Click en el bucket **"vehículos"**
2. Ve a la pestaña **"Policies"** (Políticas)
3. Deberías ver algo como esto:

### Política necesaria para VER las imágenes:

```
Nombre: Public Read Access (o similar)
Operación: SELECT
Target roles: public ✅ (DEBE estar marcado)
Policy definition: true
```

### Si NO existe una política pública de lectura:

1. Click en **"New policy"**
2. Selecciona **"Get started quickly"** → **"Public access"** → **"Select"**
   
   O si prefieres hacerlo manualmente:
   - Click en "For full customization"
   - Nombre: `Public Read`
   - Allowed operation: **SELECT**
   - Target roles: Marca **`public`** ✅
   - Policy definition (USING): `true`
   - Click **"Review"** → **"Save policy"**

### Política para SUBIR imágenes (solo autenticados):

```
Nombre: Authenticated users can upload
Operación: INSERT
Target roles: authenticated ✅
Policy definition: auth.role() = 'authenticated'
```

## 3. Probar una URL directamente

Intenta abrir una de tus imágenes directamente en el navegador:

```
https://grhosiwkympkdgolpwkq.supabase.co/storage/v1/object/public/veh%C3%ADculos/[ID_VEHICULO]/[NOMBRE_IMAGEN].jpg
```

**Si la imagen NO se muestra:**
- ❌ El bucket no es público o falta la política de lectura pública

**Si la imagen SÍ se muestra:**
- ✅ El bucket está bien configurado
- El problema está en cómo se generan/guardan las URLs en la base de datos

## 4. Verificar URLs en la base de datos

En Supabase, ve a **Table Editor** → tabla `vehicle_images`:

```sql
SELECT url FROM vehicle_images LIMIT 5;
```

Las URLs deberían verse así:
```
https://grhosiwkympkdgolpwkq.supabase.co/storage/v1/object/public/veh%C3%ADculos/abc-123/imagen.jpg
```

O con la tilde sin codificar:
```
https://grhosiwkympkdgolpwkq.supabase.co/storage/v1/object/public/vehículos/abc-123/imagen.jpg
```

## 5. Limpiar y volver a intentar

Si nada funciona, prueba:

1. Eliminar un vehículo de prueba (con sus imágenes)
2. Crear un vehículo nuevo desde cero
3. Subir 1-2 imágenes
4. Verificar en la consola del navegador (F12) los logs que agregué
5. Intentar ver el vehículo en el catálogo
