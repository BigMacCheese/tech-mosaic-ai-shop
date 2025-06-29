
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

    console.log('Starting embedding generation process...');

    // Create Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { productId } = await req.json() || {};

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
      console.log(`Processing single product: ${data.name}`);
    } else {
      // Generate embeddings for all products without embeddings
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .is('embedding', null);

      if (error) throw error;
      products = data;
      console.log(`Found ${products.length} products without embeddings`);
    }

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No products found that need embeddings',
          processedCount: 0,
          errorCount: 0,
          totalProducts: 0
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    let processedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        // Create a comprehensive text representation following the exact format requested
        const productText = `name: ${product.name}, company: ${product.company}, type: ${product.type}, description: ${product.description}, features: ${product.features}, stock: ${product.stock}, price: ${product.price}`;

        console.log(`Generating embedding for product: ${product.name}`);
        console.log(`Product text: ${productText}`);

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
          const errorText = await embeddingResponse.text();
          console.error(`OpenAI API error for product ${product.id}:`, errorText);
          throw new Error(`OpenAI API error: ${embeddingResponse.status} - ${errorText}`);
        }

        const embeddingData = await embeddingResponse.json();
        const embedding = embeddingData.data[0].embedding;

        console.log(`Generated embedding with ${embedding.length} dimensions for ${product.name}`);

        // Convert the embedding array to the format expected by pgvector
        const embeddingString = `[${embedding.join(',')}]`;

        // Update the product with the embedding
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            embedding: embeddingString,
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
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
        errorCount++;
      }
    }

    console.log(`Embedding generation completed. Processed: ${processedCount}, Errors: ${errorCount}`);

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
