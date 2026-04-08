// Script temporal de diagnóstico
import { supabase } from '../lib/supabase';

export async function diagnoseImages() {
  console.log('=== DIAGNÓSTICO DE IMÁGENES ===\n');

  // 1. Verificar vehículos en la BD
  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select('id, title, cover_image_url, vehicle_images (url)')
    .limit(5);

  if (vehiclesError) {
    console.error('❌ Error al obtener vehículos:', vehiclesError);
    return;
  }

  console.log(`✓ Total de vehículos encontrados: ${vehicles?.length || 0}\n`);

  vehicles?.forEach((vehicle, index) => {
    console.log(`\n📋 Vehículo ${index + 1}: ${vehicle.title}`);
    console.log(`   ID: ${vehicle.id}`);
    console.log(`   Cover URL: ${vehicle.cover_image_url || 'NO DEFINIDA'}`);
    console.log(`   Imágenes: ${vehicle.vehicle_images?.length || 0}`);
    
    if (vehicle.vehicle_images && vehicle.vehicle_images.length > 0) {
      vehicle.vehicle_images.forEach((img: { url: string }, i: number) => {
        console.log(`   Imagen ${i + 1}: ${img.url}`);
      });
    }
  });

  // 2. Verificar bucket de storage
  console.log('\n\n=== VERIFICANDO STORAGE ===\n');
  
  const { data: buckets, error: bucketsError } = await supabase
    .storage
    .listBuckets();

  if (bucketsError) {
    console.error('❌ Error al listar buckets:', bucketsError);
  } else {
    console.log('✓ Buckets disponibles:');
    buckets?.forEach(bucket => {
      console.log(`   - ${bucket.name} (público: ${bucket.public})`);
    });
  }

  // 3. Intentar listar archivos en el bucket
  console.log('\n\n=== VERIFICANDO ARCHIVOS EN BUCKET ===\n');
  
  const bucketNames = ['vehículos', 'vehiculos'];
  
  for (const bucketName of bucketNames) {
    console.log(`\nProbando bucket: "${bucketName}"`);
    const { data: files, error: filesError } = await supabase
      .storage
      .from(bucketName)
      .list('', { limit: 10 });

    if (filesError) {
      console.error(`   ❌ Error: ${filesError.message}`);
    } else {
      console.log(`   ✓ Archivos encontrados: ${files?.length || 0}`);
      files?.forEach(file => {
        console.log(`      - ${file.name}`);
      });
    }
  }

  console.log('\n\n=== FIN DEL DIAGNÓSTICO ===\n');
}
