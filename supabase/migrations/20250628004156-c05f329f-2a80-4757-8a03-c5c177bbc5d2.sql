
-- Crear bucket para almacenar imágenes de productos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Crear tabla de productos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en la tabla products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública de productos
CREATE POLICY "Public read access for products" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- Crear política de almacenamiento para el bucket de imágenes
CREATE POLICY "Public read access for product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Public upload access for product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- Insertar los productos con URLs de imágenes de Unsplash
INSERT INTO public.products (name, company, type, description, features, stock, price, image_url) VALUES
('iPhone 15 Pro', 'Apple', 'Smartphone', 'Telefono insignia de Apple que combina un diseno en titanio, sistema iOS y chip A17 Pro. Ofrece rendimiento, fotografia avanzada y conectividad de ultima generacion.', 'Pantalla Super Retina XDR de 6.1" con ProMotion, Always-On, Chip A17 Pro con GPU de 6 nucleos, Camaras traseras: 48 MP + ultra-gran angular + telefoto; zoom optico hasta 3x, Face ID, USB-C, accion satelital SOS, deteccion de choques, iOS con actualizaciones constantes, resistencia IP68', 20, 999.00, 'https://images.unsplash.com/photo-1592286052737-8959927b51b2?w=400&h=400&fit=crop'),

('MacBook Pro 14-inch (M4 Pro)', 'Apple', 'Laptop', 'Portatil profesional de alto rendimiento disenado para tareas intensivas, con pantalla Liquid Retina XDR y el nuevo chip M4 Pro.', 'Pantalla mini-LED de 14.2" con ProMotion, Chip M4 Pro (10 nucleos CPU / 16 nucleos GPU), 16 GB RAM base, SSD desde 512 GB, 3 puertos Thunderbolt 4, HDMI, MagSafe 3, bateria hasta 18 horas, teclado retroiluminado con Touch ID, macOS Sonoma', 12, 1999.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'),

('iPhone 16 Pro', 'Apple', 'Smartphone', 'Proxima generacion del iPhone con mejoras en fotografia, autonomia y desempeno, manteniendo el diseno premium de Apple.', 'Pantalla Super Retina XDR de 6.1", Chip A18 Pro (rumorado), camaras mejoradas con sensor LiDAR, nuevo boton de accion, Face ID, Dynamic Island, compatibilidad con Apple Vision Pro, iOS actualizado', 8, 1199.00, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop'),

('Surface Laptop 6', 'Microsoft', 'Laptop', 'Portatil ultraligero de Microsoft con Windows 11, ideal para productividad movil, autonomia prolongada y diseno moderno.', 'Pantalla PixelSense de 13.5", procesador Intel Core Ultra, 16 GB RAM, SSD desde 256 GB, autonomia hasta 19 horas, Windows Hello, USB-C, teclado premium, Windows 11 Home', 14, 1399.00, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'),

('Xbox Series X', 'Microsoft', 'Game console', 'Consola de videojuegos mas potente de Microsoft, con graficos en 4K, tiempos de carga ultra rapidos y compatibilidad con juegos de generaciones anteriores.', 'Procesador AMD Zen 2 y RDNA 2, 1 TB SSD, juegos hasta 4K a 120 fps, ray tracing, retrocompatibilidad con Xbox One y 360, Quick Resume, puertos USB 3.1, Dolby Atmos y Vision', 25, 499.00, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop'),

('Microsoft HoloLens 2', 'Microsoft', 'Mixed reality headset', 'Gafas de realidad mixta para aplicaciones industriales, medicas y de diseno. Integran hologramas en el entorno real con gran precision.', 'Pantalla holografica 2K por ojo, sensores de seguimiento ocular, reconocimiento de gestos, SoC Snapdragon 850, conectividad Wi-Fi y Bluetooth, compatible con Azure y Dynamics 365, autonomia de hasta 3 horas', 4, 3500.00, 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=400&fit=crop'),

('Samsung Galaxy S24 Ultra', 'Samsung', 'Smartphone', 'Smartphone de gama alta con camara periscopica, pantalla AMOLED 120 Hz y chip Snapdragon de ultima generacion.', 'Pantalla AMOLED QHD+ de 6.8", tasa de refresco 120 Hz, Snapdragon 8 Gen 3, camara cuadruple (200 MP principal), S Pen integrado, One UI sobre Android 14, bateria de 5000 mAh, carga rapida y 5G', 18, 1299.00, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop'),

('Samsung Galaxy Book4 Pro', 'Samsung', 'Laptop', 'Laptop ultra delgada enfocada en productividad y multimedia, con pantalla AMOLED y gran duracion de bateria.', 'Pantalla AMOLED de 14" o 16", Intel Core Ultra 7, 16 GB RAM, SSD 512 GB, teclado retroiluminado, Wi-Fi 6E, lector de huellas, integracion con dispositivos Galaxy, Windows 11', 10, 1699.00, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'),

('Samsung Galaxy Tab S9 Ultra', 'Samsung', 'Tablet', 'Tableta premium con pantalla gigante, ideal para dibujo, productividad y multimedia, compatible con S Pen.', 'Pantalla AMOLED de 14.6", Snapdragon 8 Gen 2, 12 GB RAM, 256 GB almacenamiento, IP68, sonido AKG, S Pen incluido, Android con One UI, carga rapida', 15, 1199.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop'),

('NVIDIA GeForce RTX 4090', 'NVIDIA', 'Graphics card', 'Tarjeta grafica tope de gama con arquitectura Ada Lovelace, ideal para gaming 4K y trabajo en IA, modelado 3D o simulaciones.', '24 GB GDDR6X, Ray Tracing de 3ra gen, DLSS 3.5, 16384 CUDA cores, 2 puertos HDMI, 3 DisplayPort, consumo 450 W, compatible con PCIe 4.0', 6, 1599.00, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop'),

('NVIDIA Jetson Orin Nano', 'NVIDIA', 'AI module', 'Modulo de computacion en el borde para IA, robotica y vision artificial, ideal para desarrolladores.', 'GPU Ampere con 1024 CUDA cores, CPU ARM Cortex-A78AE, hasta 8 GB LPDDR5, interfaces I/O para camaras, sensores y mas, soporte para TensorRT y DeepStream', 10, 599.00, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop'),

('NVIDIA DGX Station A100', 'NVIDIA', 'AI workstation', 'Estacion de trabajo especializada en IA, deep learning y simulaciones complejas, con multiples GPUs A100.', '4 GPUs NVIDIA A100 de 80 GB cada una, CPU AMD EPYC 64 nucleos, 1 TB RAM, 7.68 TB SSD, refrigeracion liquida, soporte para frameworks de IA, diseno torre', 1, 149000.00, 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop'),

('Canon EOS R5', 'Canon', 'Professional camera', 'Camara mirrorless profesional para fotografia de alta resolucion y grabacion en 8K, con sensor full-frame.', 'Sensor CMOS 45 MP, video 8K RAW, Dual Pixel CMOS AF II, estabilizacion en el cuerpo (IBIS), rafaga hasta 20 fps, visor OLED de 5.76M puntos, Wi-Fi/Bluetooth', 5, 3899.00, 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop'),

('Canon imageCLASS MF656Cdw', 'Canon', 'Multifunction printer', 'Impresora multifuncional laser a color, ideal para pequenas oficinas con impresion movil y conectividad en red.', 'Velocidad hasta 22 ppm, impresion a doble cara, escaner y copiadora, Wi-Fi, Ethernet, pantalla tactil, compatibilidad con AirPrint y Canon PRINT', 9, 599.00, 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop'),

('Canon PowerShot V10', 'Canon', 'Compact camera', 'Camara compacta pensada para vloggers y creadores de contenido, con grabacion en 4K y microfono estereo.', 'Sensor CMOS 1", grabacion 4K/30p, pantalla abatible, microfono estereo integrado, conectividad Wi-Fi/Bluetooth, diseno compacto con soporte', 12, 399.00, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop'),

('Tesla Model 3 Long Range', 'Tesla', 'Electric vehicle', 'Sedan electrico con gran autonomia, excelente aceleracion y funciones de asistencia al conductor avanzadas.', 'Autonomia EPA hasta 333 millas, traccion AWD, aceleracion 0–60 mph en 4.2 s, pantalla tactil de 15", piloto automatico, actualizaciones OTA, carga rapida con Supercharger', 3, 47990.00, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=400&fit=crop'),

('Tesla Powerwall 3', 'Tesla', 'Home battery', 'Sistema de almacenamiento de energia domestico que almacena energia solar y proporciona respaldo ante apagones.', 'Capacidad de 13.5 kWh, potencia de salida de 11.5 kW, instalacion en pared o piso, integracion con app Tesla, compatible con energia solar, respaldo automatico', 4, 8800.00, 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop'),

('Tesla Wall Connector (Gen 3)', 'Tesla', 'EV charger', 'Cargador domestico para vehiculos Tesla con carga rapida y conectividad Wi-Fi para control remoto.', 'Hasta 44 millas por hora de carga, cable de 24 pies, potencia ajustable, instalacion interior/exterior, control por app Tesla, Wi-Fi integrado', 15, 475.00, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'),

('Sony WH-1000XM5', 'Sony', 'Wireless headphones', 'Audifonos inalambricos con cancelacion activa de ruido lider en la industria, sonido de alta resolucion y larga autonomia.', 'Cancelacion activa con procesadores duales, 30 h de bateria, carga rapida, soporte LDAC, deteccion de uso, control por gestos, microfonos con IA', 20, 399.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'),

('Sony Alpha 7 IV (A7 IV)', 'Sony', 'Professional camera', 'Camara mirrorless hibrida de fotograma completo ideal para fotografos y videografos, con enfoque automatico avanzado.', 'Sensor full-frame de 33 MP, grabacion 4K 60p, enfoque Eye-AF en humanos/animales, estabilizacion de 5 ejes, doble ranura SD/CFexpress, pantalla abatible', 6, 2499.00, 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop'),

('Sony PlayStation 5', 'Sony', 'Game console', 'Consola de videojuegos de nueva generacion con SSD ultra rapido, graficos avanzados y experiencias inmersivas.', 'CPU AMD Zen 2, GPU RDNA 2, 825 GB SSD, Ray Tracing, juegos 4K/120 fps, mando DualSense con retroalimentacion haptica, soporte HDR y VRR', 22, 499.00, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop');
