
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, Building, ShoppingCart } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import ProductRecommendations from "./ProductRecommendations";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onProductClick?: (product: Product) => void;
}

const ProductModal = ({ product, isOpen, onClose, onProductClick }: ProductModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto glass-effect border-primary/30 z-[60]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-primary/20">
              <img
                src={product.image_url || `https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-medium">{product.company}</span>
              </div>
              
              <Badge 
                variant="outline" 
                className="border-primary/30 text-primary"
              >
                {product.type}
              </Badge>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Características</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.features}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass-effect rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <span className="text-3xl font-bold text-primary">${product.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg">
                    <span className="font-semibold">{product.stock}</span> en stock
                  </span>
                </div>
              </div>

              <Button 
                className="w-full tech-gradient hover:opacity-90 transition-opacity text-white font-semibold py-3 text-lg"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock > 0 ? "Agregar al Carrito" : "Agotado"}
              </Button>
            </div>
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="border-t border-border/50 pt-8">
          <ProductRecommendations 
            productId={product.id}
            onProductClick={onProductClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
