from sentence_transformers import SentenceTransformer
import json
import os
from supabase import create_client, Client
from datetime import datetime
from dotenv import load_dotenv

# Cargar variables de entorno desde archivo .env
load_dotenv()

# Configuración de Supabase desde .env
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Verificar que las variables estén configuradas
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError(
        "❌ Error: Variables de entorno no configuradas.\n"
        "Crea un archivo .env con:\n"
        "SUPABASE_URL=https://tu-proyecto.supabase.co\n"
        "SUPABASE_ANON_KEY=tu_clave_anonima_aqui"
    )

# Inicializar cliente de Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Cargar el modelo
print("Cargando modelo Sentence Transformers...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ Modelo cargado exitosamente!")

def load_products_from_json(filename="products.json"):
    """Carga productos desde archivo JSON"""
    try:
        if not os.path.exists(filename):
            raise FileNotFoundError(f"No se encontró el archivo {filename}")
        
        with open(filename, 'r', encoding='utf-8') as file:
            productos = json.load(file)
        
        print(f"✅ Cargados {len(productos)} productos desde {filename}")
        return productos
    
    except Exception as e:
        print(f"❌ Error cargando productos: {e}")
        return []

def generate_product_text(product):
    """Combina información del producto en texto para embedding"""
    return f"""
Name: {product['name']}
Company: {product['company']}
Type: {product['type']}
Description: {product['description']}
Features: {product['features']}
Price: ${product['price']}
Stock: {product['stock']} unidades
""".strip()

def test_supabase_connection():
    """Prueba la conexión con Supabase"""
    try:
        print("🔍 Probando conexión con Supabase...")
        
        # Intentar obtener algunos productos para probar conexión
        response = supabase.table('products').select('id, name').limit(1).execute()
        
        print(f"📊 Respuesta de conexión:")
        print(f"   - Datos: {response.data}")
        print(f"   - Cantidad: {len(response.data) if response.data else 0}")
        
        if hasattr(response, 'error') and response.error:
            print(f"❌ Error en conexión: {response.error}")
            return False
        
        print(f"✅ Conexión exitosa con Supabase. Productos en BD: {len(response.data)}")
        
        # Verificar estructura de la tabla
        if response.data:
            print(f"📋 Ejemplo de producto en BD:")
            first_product = response.data[0]
            for key, value in first_product.items():
                print(f"   - {key}: {type(value).__name__}")
        
        return True
    
    except Exception as e:
        print(f"❌ Error conectando con Supabase: {type(e).__name__}: {e}")
        import traceback
        print(f"📍 Traceback completo:")
        traceback.print_exc()
        print("💡 Verifica tus credenciales en el archivo .env")
        return False

def generate_and_update_embeddings(productos):
    """Genera embeddings y actualiza la base de datos"""
    
    if not productos:
        print("❌ No hay productos para procesar")
        return
    
    successful_updates = 0
    failed_updates = 0
    
    print(f"🚀 Iniciando actualización de {len(productos)} productos...\n")
    
    for i, producto in enumerate(productos, 1):
        try:
            product_id = producto['id']
            product_name = producto['name']
            
            print(f"🔄 Procesando ({i}/{len(productos)}): {product_name} (ID: {product_id})")
            
            # Verificar si el producto existe primero
            check_response = supabase.table('products').select('id, name').eq('id', product_id).execute()
            print(f"🔍 Verificación de existencia: {len(check_response.data)} registros encontrados")
            
            if not check_response.data:
                print(f"❌ Producto con ID {product_id} no existe en la base de datos")
                failed_updates += 1
                continue
            
            # Generar texto combinado
            texto_producto = generate_product_text(producto)
            print(f"📝 Texto generado: {texto_producto[:100]}...")
            
            # Generar embedding
            embedding = model.encode(texto_producto)
            embedding_list = embedding.tolist()
            print(f"🧮 Embedding generado: {len(embedding_list)} dimensiones")
            
            # Actualizar en Supabase con debugging completo
            print(f"📤 Enviando actualización a Supabase...")
            response = supabase.table('products').update({
                'embedding': embedding_list,
                'updated_at': datetime.now().isoformat()
            }).eq('id', product_id).execute()
            
            # Debug completo de la respuesta
            print(f"📥 Respuesta completa:")
            print(f"   - response.data: {response.data}")
            print(f"   - response.count: {getattr(response, 'count', 'N/A')}")
            print(f"   - response.status_code: {getattr(response, 'status_code', 'N/A')}")
            
            if hasattr(response, 'error') and response.error:
                print(f"❌ Error en respuesta: {response.error}")
                failed_updates += 1
                continue
            
            if response.data and len(response.data) > 0:
                print(f"✅ Actualizado exitosamente: {product_name}")
                successful_updates += 1
            else:
                print(f"⚠️  Sin cambios o producto no encontrado: {product_name}")
                print(f"   Datos de respuesta: {response.data}")
                failed_updates += 1
                
        except Exception as e:
            print(f"❌ Error procesando {product_name}: {type(e).__name__}: {e}")
            import traceback
            print(f"📍 Traceback completo:")
            traceback.print_exc()
            failed_updates += 1
            continue
        
        print("-" * 50)  # Separador entre productos
    
    # Resumen final
    print(f"\n{'='*60}")
    print(f"📊 RESUMEN DE ACTUALIZACIÓN")
    print(f"{'='*60}")
    print(f"✅ Exitosos: {successful_updates}")
    print(f"❌ Fallidos: {failed_updates}")
    print(f"📋 Total procesados: {len(productos)}")
    print(f"{'='*60}")

def verify_embeddings():
    """Verifica que los embeddings se hayan insertado correctamente"""
    try:
        print("\n🔍 Verificando embeddings en la base de datos...")
        
        # Obtener productos con embeddings
        response = supabase.table('products').select('id, name, embedding').execute()
        
        products_with_embeddings = 0
        products_without_embeddings = 0
        
        for product in response.data:
            if product['embedding'] and len(product['embedding']) > 0:
                products_with_embeddings += 1
                print(f"✅ {product['name']}: {len(product['embedding'])} dimensiones")
            else:
                products_without_embeddings += 1
                print(f"❌ {product['name']}: Sin embedding")
        
        print(f"\n📈 Productos con embeddings: {products_with_embeddings}")
        print(f"📉 Productos sin embeddings: {products_without_embeddings}")
        
    except Exception as e:
        print(f"❌ Error verificando embeddings: {e}")

def main():
    """Función principal"""
    try:
        print(f"🔑 Configuración cargada desde .env:")
        print(f"   SUPABASE_URL: {SUPABASE_URL[:30]}...")
        print(f"   SUPABASE_KEY: {'*' * 20}...{SUPABASE_KEY[-10:]}")
        print()
        
        # Verificar conexión con Supabase
        if not test_supabase_connection():
            return
        
        # Cargar productos desde JSON
        productos = load_products_from_json("products.json")
        
        if not productos:
            print("❌ No se pudieron cargar productos")
            return
        
        # Mostrar productos cargados
        print(f"\n📋 Productos a procesar:")
        for p in productos:
            print(f"  • {p['name']} ({p['company']}) - ID: {p['id']}")
        
        # Confirmar antes de proceder
        confirmar = input(f"\n¿Proceder con la actualización de {len(productos)} productos? (s/n): ")
        
        if confirmar.lower() in ['s', 'sí', 'si', 'y', 'yes']:
            # Generar y actualizar embeddings
            generate_and_update_embeddings(productos)
            
            # Verificar resultados
            verify_embeddings()
            
            print(f"\n🎉 Proceso completado!")
            
        else:
            print("❌ Proceso cancelado por el usuario")
            
    except Exception as e:
        print(f"❌ Error general: {e}")

if __name__ == "__main__":
    print("🚀 GENERADOR DE EMBEDDINGS PARA SUPABASE")
    print("="*50)
    
    main()