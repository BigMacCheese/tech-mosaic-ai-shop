
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign } from "lucide-react";

interface Product {
  id: number;
  name: string;
  company: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <Card 
      className="glass-effect border-primary/20 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-primary/20 group"
      onClick={() => onClick(product)}
    >
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={`https://images.unsplash.com/${product.image}?w=400&h=400&fit=crop`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.company}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="font-bold text-primary text-lg">${product.price}</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{product.stock} disponibles</span>
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className="text-xs border-primary/30 text-primary/80"
          >
            {product.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
