
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, DollarSign, Zap, Info, AlertCircle } from "lucide-react";
import { useProductRecommendations, ProductRecommendation } from "@/hooks/useProductRecommendations";
import { Product } from "@/hooks/useProducts";
import { useProductEmbeddings } from "@/hooks/useProductEmbeddings";

interface ProductRecommendationsProps {
  productId: string | null;
  onProductClick?: (product: Product) => void;
}

const ProductRecommendations = ({ productId, onProductClick }: ProductRecommendationsProps) => {
  const { data, isLoading, error } = useProductRecommendations(productId);
  const { generateEmbeddings, isGenerating } = useProductEmbeddings();

  if (!productId) return null;

  if (isLoading || isGenerating) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-muted-foreground">
            {isGenerating ? "Generando embeddings..." : "Generando recomendaciones personalizadas..."}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    const isEmbeddingError = error.message.includes('embedding') || error.message.includes('vector');
    
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card className="border-amber-500/50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-amber-500" />
            {isEmbeddingError ? (
              <>
                <p className="text-amber-700 mb-4">Los embeddings aún no están disponibles para este producto</p>
                <Button 
                  onClick={() => generateEmbeddings({})}
                  disabled={isGenerating}
                  className="mb-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    "Generar Embeddings"
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Una vez generados, las recomendaciones aparecerán automáticamente
                </p>
              </>
            ) : (
              <>
                <p className="text-destructive mb-2">Error al cargar recomendaciones</p>
                <p className="text-sm text-muted-foreground">
                  {error.message}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.recommendations?.length) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-6 text-center">
            <Info className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No se encontraron recomendaciones similares</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Recomendaciones Personalizadas</h2>
        </div>
        <p className="text-muted-foreground">
          Basadas en el análisis inteligente de {data.currentProduct.name}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.recommendations.map((product) => (
          <RecommendationCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
};

interface RecommendationCardProps {
  product: ProductRecommendation;
  onProductClick?: (product: Product) => void;
}

const RecommendationCard = ({ product, onProductClick }: RecommendationCardProps) => {
  return (
    <Card className="glass-effect border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 group">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.image_url || `https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.company}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-bold text-primary text-lg">${product.price}</span>
              </div>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary/80">
                {product.type}
              </Badge>
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Análisis IA</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-medium text-primary">Por qué recomendamos:</span>
                <p className="text-muted-foreground mt-1">{product.aiInsights.reason}</p>
              </div>
              
              <div>
                <span className="font-medium text-green-600">Precio:</span>
                <p className="text-muted-foreground mt-1">{product.aiInsights.priceComparison}</p>
              </div>
              
              <div>
                <span className="font-medium text-blue-600">Ideal para:</span>
                <p className="text-muted-foreground mt-1">{product.aiInsights.bestFor}</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={() => onProductClick?.(product)}
            className="w-full tech-gradient hover:opacity-90 transition-opacity text-white font-semibold"
          >
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductRecommendations;
