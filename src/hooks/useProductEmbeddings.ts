
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GenerateEmbeddingsParams {
  productId?: string; // If not provided, generates for all products
}

export const useProductEmbeddings = () => {
  const { toast } = useToast();

  const generateEmbeddings = useMutation({
    mutationFn: async (params: GenerateEmbeddingsParams = {}) => {
      console.log('Generating product embeddings...');
      
      const { data, error } = await supabase.functions.invoke('generate-product-embeddings', {
        body: { productId: params.productId }
      });

      if (error) {
        console.error('Error generating embeddings:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('Embeddings generated successfully:', data);
      toast({
        title: "Embeddings generados",
        description: `Se procesaron ${data.processedCount} productos exitosamente`,
      });
    },
    onError: (error) => {
      console.error('Error generating embeddings:', error);
      toast({
        title: "Error",
        description: "Hubo un error al generar los embeddings",
        variant: "destructive",
      });
    },
  });

  return {
    generateEmbeddings: generateEmbeddings.mutate,
    isGenerating: generateEmbeddings.isPending,
    error: generateEmbeddings.error,
  };
};
