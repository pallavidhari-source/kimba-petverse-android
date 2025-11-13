import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useProductCartStore } from "@/stores/cartStore";
import { ShoppingCart, Sparkles, Filter } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  original_price: number;
  color: string;
  material: string;
  sizes: string[];
  gender: string;
  images: string[];
  features: string[];
  in_stock: boolean;
  rating: number;
  reviews_count: number;
}

export default function EthnicWear() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  const addToCart = useProductCartStore(state => state.addItem);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("pet_products")
        .select("*")
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
    if (selectedGender !== "all" && product.gender !== selectedGender && product.gender !== "unisex") return false;
    return true;
  });

  const handleAddToCart = (product: Product) => {
    const size = selectedSize[product.id] || product.sizes[0];
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size,
      image: product.images[0],
      category: product.category,
    });
    toast.success(`Added ${product.name} to cart!`, {
      description: `Size: ${size}`,
    });
  };

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];
  const genders = ["all", "male", "female", "unisex"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pet Ethnic Wear Collection</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dress your furry friends in traditional elegance. Premium ethnic wear for special occasions.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Filters:</span>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedGender} onValueChange={setSelectedGender}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              {genders.map((gen) => (
                <SelectItem key={gen} value={gen}>
                  {gen === "all" ? "All Genders" : gen.charAt(0).toUpperCase() + gen.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-muted"></div>
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <CardHeader className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    {product.original_price > product.price && (
                      <Badge variant="destructive" className="text-xs">
                        Save ${(product.original_price - product.price).toFixed(0)}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">{product.gender}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                    {product.original_price > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Size:</label>
                    <Select
                      value={selectedSize[product.id] || product.sizes[0]}
                      onValueChange={(value) => setSelectedSize({ ...selectedSize, [product.id]: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {product.sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}