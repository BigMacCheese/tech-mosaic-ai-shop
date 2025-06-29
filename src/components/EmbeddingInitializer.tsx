
import { useEffect } from "react";
import { useProductEmbeddings } from "@/hooks/useProductEmbeddings";
import { useProducts } from "@/hooks/useProducts";

const EmbeddingInitializer = () => {
  const { data: products } = useProducts();
  const { generateEmbeddings, isGenerating } = useProductEmbeddings();

  useEffect(() => {
    // Check if we have products but no embeddings
    if (products && products.length > 0) {
      const productsWithoutEmbeddings = products.filter(p => !p.embedding);
      
      if (productsWithoutEmbeddings.length > 0) {
        console.log(`Found ${productsWithoutEmbeddings.length} products without embeddings. Generating...`);
        generateEmbeddings({});
      }
    }
  }, [products, generateEmbeddings]);

  if (isGenerating) {
    return (
      <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Generando embeddings...</span>
        </div>
      </div>
    );
  }

  return null;
};

export default EmbeddingInitializer;
