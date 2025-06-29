
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GenerateEmbeddingsParams {
  productId?: string; // If not provided, generates for all products
}

export const useProductEmbeddings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateEmbeddings = useMutation({
    mutationFn: async (params: GenerateEmbeddingsParams = {}) => {
      console.log('Generating product embeddings...', params);
      
      const { data, error } = await supabase.functions.invoke('generate-product-embeddings', {
        body: { productId: params.productId }
      });

      if (error) {
        console.error('Error generating embeddings:', error);
        throw error;
      }

      console.log('Embeddings generation response:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Embeddings generated successfully:', data);
      
      // Invalidate products query to refetch with new embeddings
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast({
        title: "Embeddings generados",
        description: `Se procesaron ${data.processedCount} productos exitosamente${data.errorCount > 0 ? ` (${data.errorCount} errores)` : ''}`,
      });
    },
    onError: (error: any) => {
      console.error('Error generating embeddings:', error);
      toast({
        title: "Error",
        description: `Hubo un error al generar los embeddings: ${error.message}`,
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
