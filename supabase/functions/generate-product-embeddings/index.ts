
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY no está configurada');
    }

    // Create Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { productId } = await req.json();

    let products;
    
    if (productId) {
      // Generate embedding for a specific product
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      products = [data];
    } else {
      // Generate embeddings for all products
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      products = data;
    }

    console.log(`Processing ${products.length} products for embeddings`);

    let processedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        // Create a comprehensive text representation of the product
        const productText = `
          Nombre: ${product.name}
          Empresa: ${product.company}
          Tipo: ${product.type}
          Descripción: ${product.description}
          Características: ${product.features}
          Precio: $${product.price}
          Stock: ${product.stock} unidades disponibles
        `.trim();

        console.log(`Generating embedding for product: ${product.name}`);

        // Generate embedding using OpenAI
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

        // Update the product with the embedding
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            embedding: `[${embedding.join(',')}]`,
            updated_at: new Date().toISOString()
          })
          .eq('id', product.id);

        if (updateError) {
          console.error(`Error updating product ${product.id}:`, updateError);
          errorCount++;
        } else {
          console.log(`Successfully updated embedding for product: ${product.name}`);
          processedCount++;
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
        errorCount++;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processed ${processedCount} products successfully, ${errorCount} errors`,
        processedCount,
        errorCount,
        totalProducts: products.length
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in generate-product-embeddings function:', error);
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
