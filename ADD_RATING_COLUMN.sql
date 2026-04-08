-- ========================================
-- AGREGAR CAMPO DE RATING (ESTRELLAS) A VEHÍCULOS
-- ========================================
-- Ejecuta este comando en SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query

-- 1. Agregar columna 'rating' a la tabla vehicles
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5);

-- 2. Actualizar el comentario de la columna
COMMENT ON COLUMN vehicles.rating IS 'Calificación del vehículo de 0 a 5 estrellas (permite .5)';

-- 3. Establecer valores por defecto para vehículos existentes
-- Vehículos nuevos: 5 estrellas
UPDATE vehicles 
SET rating = 5.0 
WHERE condition = 'nuevo' AND rating IS NULL;

-- Vehículos usados: 4 estrellas por defecto
UPDATE vehicles 
SET rating = 4.0 
WHERE condition = 'usado' AND rating IS NULL;

-- 4. Verificar que la columna se creó correctamente
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'vehicles' AND column_name = 'rating';

-- 5. Ver los vehículos con sus ratings
SELECT id, title, condition, rating 
FROM vehicles 
ORDER BY rating DESC;
