
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, selectedProduct } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY no está configurada');
    }

    let systemPrompt = `Eres un asistente de ventas especializado en tecnología para TechStock. Tu trabajo es ayudar a los clientes con información sobre productos, recomendaciones y responder preguntas técnicas.

Características importantes:
- Responde siempre en español
- Sé amigable y profesional
- Proporciona información técnica precisa
- Ayuda con recomendaciones de productos
- Si no sabes algo específico, sé honesto al respecto

Productos disponibles en TechStock incluyen: smartphones, laptops, consolas de videojuegos, cámaras, audifonos, tarjetas gráficas, vehículos eléctricos, baterías domésticas, y más dispositivos de tecnología avanzada de marcas como Apple, Microsoft, Samsung, NVIDIA, Canon, Tesla y Sony.`;

    if (selectedProduct) {
      systemPrompt += `\n\nProducto actual seleccionado: ${selectedProduct.name} de ${selectedProduct.company}
Descripción: ${selectedProduct.description}
Precio: $${selectedProduct.price}
Stock disponible: ${selectedProduct.stock}
Características: ${selectedProduct.features}`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `Usuario: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lo siento, no pude procesar tu pregunta.';

    console.log('Gemini response:', aiResponse);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
