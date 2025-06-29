
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!openaiApiKey || !geminiApiKey) {
      throw new Error('API keys not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { productId } = await req.json();

    console.log(`Getting recommendations for product: ${productId}`);

    // Get the current product
    const { data: currentProduct, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !currentProduct) {
      throw new Error('Product not found');
    }

    // If the current product doesn't have an embedding, generate it first
    if (!currentProduct.embedding) {
      console.log('Current product missing embedding, generating...');
      
      const productText = `
        Nombre: ${currentProduct.name}
        Empresa: ${currentProduct.company}
        Tipo: ${currentProduct.type}
        Descripción: ${currentProduct.description}
        Características: ${currentProduct.features}
        Precio: $${currentProduct.price}
        Stock: ${currentProduct.stock} unidades disponibles
      `.trim();

      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: productText,
          encoding_format: 'float'
        }),
      });

      if (!embeddingResponse.ok) {
        throw new Error(`OpenAI API error: ${embeddingResponse.status}`);
      }

      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.data[0].embedding;

      // Update current product with embedding
      await supabase
        .from('products')
        .update({ 
          embedding: `[${embedding.join(',')}]`,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      currentProduct.embedding = `[${embedding.join(',')}]`;
    }

    // Find similar products using vector similarity
    const { data: similarProducts, error: similarError } = await supabase.rpc(
      'match_products',
      {
        query_embedding: currentProduct.embedding,
        match_threshold: 0.7,
        match_count: 6
      }
    );

    if (similarError) {
      console.error('Vector similarity search error:', similarError);
      // Fallback: get products from same category
      const { data: fallbackProducts } = await supabase
        .from('products')
        .select('*')
        .eq('type', currentProduct.type)
        .neq('id', productId)
        .limit(5);
      
      var recommendedProducts = fallbackProducts || [];
    } else {
      // Filter out the current product and limit results
      var recommendedProducts = similarProducts
        .filter((p: any) => p.id !== productId)
        .slice(0, 5);
    }

    // Create context for Gemini
    const contextProducts = recommendedProducts.map((p: any) => ({
      name: p.name,
      company: p.company,
      type: p.type,
      price: p.price,
      features: p.features,
      description: p.description
    }));

    const currentProductContext = {
      name: currentProduct.name,
      company: currentProduct.company,
      type: currentProduct.type,
      price: currentProduct.price,
      features: currentProduct.features,
      description: currentProduct.description
    };

    // Generate recommendations using Gemini
    const geminiPrompt = `
Como experto en recomendaciones de productos tecnológicos, analiza el siguiente producto que el usuario está viendo:

PRODUCTO ACTUAL:
${JSON.stringify(currentProductContext, null, 2)}

PRODUCTOS SIMILARES ENCONTRADOS:
${JSON.stringify(contextProducts, null, 2)}

Genera recomendaciones contextuales y útiles. Para cada producto recomendado, proporciona:
1. Por qué es una buena alternativa
2. Comparación de precios (más barato, similar, más caro)
3. Diferencias clave en características
4. Cuándo sería mejor elegir cada opción

Responde en formato JSON con esta estructura:
{
  "recommendations": [
    {
      "productName": "nombre del producto",
      "reason": "razón principal de recomendación",
      "priceComparison": "comparación de precio",
      "keyDifferences": "diferencias clave",
      "bestFor": "cuándo elegir esta opción"
    }
  ]
}

Limita a máximo 4 recomendaciones y sé conciso pero informativo.
`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: geminiPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    let aiRecommendations;

    try {
      const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      aiRecommendations = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      aiRecommendations = { recommendations: [] };
    }

    // Combine product data with AI recommendations
    const finalRecommendations = recommendedProducts.map((product: any) => {
      const aiRec = aiRecommendations.recommendations?.find(
        (rec: any) => rec.productName.toLowerCase().includes(product.name.toLowerCase()) ||
                     product.name.toLowerCase().includes(rec.productName.toLowerCase())
      );

      return {
        ...product,
        aiInsights: aiRec || {
          reason: "Producto similar en tu categoría de interés",
          priceComparison: product.price < currentProduct.price ? "Precio más bajo" : 
                          product.price > currentProduct.price ? "Precio más alto" : "Precio similar",
          keyDifferences: "Consulta las especificaciones para más detalles",
          bestFor: "Una alternativa a considerar"
        }
      };
    });

    console.log(`Generated ${finalRecommendations.length} recommendations`);

    return new Response(
      JSON.stringify({ 
        currentProduct,
        recommendations: finalRecommendations,
        totalFound: finalRecommendations.length
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in product-recommendations function:', error);
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
