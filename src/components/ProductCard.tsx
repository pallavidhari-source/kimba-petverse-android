import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/data/shopData";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="relative p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {discountPercentage > 0 && (
            <Badge className="absolute left-2 top-2 bg-destructive">
              {discountPercentage}% OFF
            </Badge>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{product.brand}</p>
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {!product.inStock && (
          <Badge variant="secondary" className="text-xs">
            Out of Stock
          </Badge>
        )}
      </CardContent>

      <CardFooter className="gap-2 p-4 pt-0">
        <Button className="flex-1" disabled={!product.inStock}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
