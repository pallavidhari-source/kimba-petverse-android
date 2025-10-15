import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Star } from "lucide-react";

const Shop = () => {
  const petProducts = [
    {
      id: 1,
      name: "Pet Bed Deluxe",
      price: "₹2,499",
      rating: 4.5,
      image: "/placeholder.svg",
      category: "Accessories"
    },
    {
      id: 2,
      name: "Interactive Toy Set",
      price: "₹899",
      rating: 4.8,
      image: "/placeholder.svg",
      category: "Toys"
    },
    {
      id: 3,
      name: "Pet Grooming Kit",
      price: "₹1,599",
      rating: 4.6,
      image: "/placeholder.svg",
      category: "Grooming"
    },
    {
      id: 4,
      name: "Travel Carrier",
      price: "₹3,299",
      rating: 4.7,
      image: "/placeholder.svg",
      category: "Accessories"
    }
  ];

  const petFood = [
    {
      id: 1,
      name: "Premium Dog Food 10kg",
      price: "₹2,999",
      rating: 4.9,
      image: "/placeholder.svg",
      category: "Dog Food"
    },
    {
      id: 2,
      name: "Cat Food Variety Pack",
      price: "₹1,499",
      rating: 4.7,
      image: "/placeholder.svg",
      category: "Cat Food"
    },
    {
      id: 3,
      name: "Puppy Nutrition 5kg",
      price: "₹1,899",
      rating: 4.8,
      image: "/placeholder.svg",
      category: "Puppy Food"
    },
    {
      id: 4,
      name: "Kitten Formula 3kg",
      price: "₹1,299",
      rating: 4.6,
      image: "/placeholder.svg",
      category: "Kitten Food"
    }
  ];

  const ProductCard = ({ product }: { product: any }) => (
    <Card>
      <CardHeader>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-accent text-accent" />
          {product.rating}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{product.price}</div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl mb-4">
              Pet Shop
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Everything your pet needs - from premium food to toys and accessories.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="products">Pet Products</TabsTrigger>
              <TabsTrigger value="food">Pet Food</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {petProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="food">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {petFood.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Shop;
