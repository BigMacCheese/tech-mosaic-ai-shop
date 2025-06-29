
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./useProducts";

export interface ProductRecommendation extends Product {
  aiInsights: {
    reason: string;
    priceComparison: string;
    keyDifferences: string;
    bestFor: string;
  };
  similarity?: number;
}

export interface RecommendationsResponse {
  currentProduct: Product;
  recommendations: ProductRecommendation[];
  totalFound: number;
}

export const useProductRecommendations = (productId: string | null) => {
  return useQuery({
    queryKey: ['product-recommendations', productId],
    queryFn: async (): Promise<RecommendationsResponse> => {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      console.log('Fetching recommendations for product:', productId);
      
      const { data, error } = await supabase.functions.invoke('product-recommendations', {
        body: { productId }
      });

      if (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }

      console.log('Recommendations fetched successfully:', data?.totalFound || 0);
      return data as RecommendationsResponse;
    },
    enabled: !!productId,
  });
};
