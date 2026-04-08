-- ========================================
-- POLÍTICAS PARA EL BUCKET "vehiculos"
-- ========================================
-- Ejecuta estos comandos en SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query


-- 1. ASEGURAR QUE EL BUCKET SEA PÚBLICO
-- ========================================
UPDATE storage.buckets 
SET public = true 
WHERE name = 'vehiculos';


-- 2. POLÍTICA DE LECTURA PÚBLICA (SELECT)
-- ========================================
-- Permite que cualquier persona vea las imágenes
CREATE POLICY "Lectura pública de vehiculos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vehiculos');


-- 3. POLÍTICA DE SUBIDA (INSERT)
-- ========================================
-- Solo usuarios autenticados pueden subir imágenes
CREATE POLICY "Usuarios autenticados pueden subir vehiculos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehiculos');


-- 4. POLÍTICA DE ACTUALIZACIÓN (UPDATE)
-- ========================================
-- Solo usuarios autenticados pueden actualizar
CREATE POLICY "Usuarios autenticados pueden actualizar vehiculos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vehiculos')
WITH CHECK (bucket_id = 'vehiculos');


-- 5. POLÍTICA DE ELIMINACIÓN (DELETE)
-- ========================================
-- Solo usuarios autenticados pueden eliminar imágenes
CREATE POLICY "Usuarios autenticados pueden eliminar vehiculos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vehiculos');


-- ========================================
-- VERIFICACIÓN
-- ========================================
-- Ejecuta esto para verificar que las políticas se crearon:
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%vehiculos%'
ORDER BY policyname;


-- Ver si el bucket es público:
SELECT name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE name = 'vehiculos';
