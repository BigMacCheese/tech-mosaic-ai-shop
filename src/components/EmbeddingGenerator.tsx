
import { Button } from "@/components/ui/button";
import { useProductEmbeddings } from "@/hooks/useProductEmbeddings";
import { Loader2, Zap } from "lucide-react";

interface EmbeddingGeneratorProps {
  productId?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
}

const EmbeddingGenerator = ({ 
  productId, 
  variant = "outline",
  size = "sm" 
}: EmbeddingGeneratorProps) => {
  const { generateEmbeddings, isGenerating } = useProductEmbeddings();

  const handleGenerateEmbeddings = () => {
    generateEmbeddings({ productId });
  };

  return (
    <Button
      onClick={handleGenerateEmbeddings}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className="gap-2"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Zap className="h-4 w-4" />
      )}
      {isGenerating 
        ? "Generando..." 
        : productId 
          ? "Generar Embedding"
          : "Generar Todos los Embeddings"
      }
    </Button>
  );
};

export default EmbeddingGenerator;
