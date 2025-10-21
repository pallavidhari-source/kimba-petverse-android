import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MapPin } from "lucide-react";
import buyGermanShepherd from "@/assets/buy-german-shepherd.jpg";
import buySiamese from "@/assets/buy-siamese.jpg";
import buyBeagle from "@/assets/buy-beagle.jpg";

const BuyPets = () => {
  const petsForSale = [
    {
      id: 1,
      name: "German Shepherd Puppy",
      breed: "German Shepherd",
      age: "3 months",
      price: "₹25,000",
      location: "Madhapur",
      image: buyGermanShepherd,
      certified: true
    },
    {
      id: 2,
      name: "Siamese Kitten",
      breed: "Siamese Cat",
      age: "2 months",
      price: "₹18,000",
      location: "Gachibowli",
      image: buySiamese,
      certified: true
    },
    {
      id: 3,
      name: "Beagle Puppy",
      breed: "Beagle",
      age: "4 months",
      price: "₹22,000",
      location: "Kondapur",
      image: buyBeagle,
      certified: true
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl mb-4">
              Buy Pets
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Find your perfect companion from certified breeders with health guarantees.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {petsForSale.map((pet) => (
              <Card key={pet.id}>
                <CardHeader>
                  <img 
                    src={pet.image} 
                    alt={pet.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  {pet.certified && (
                    <Badge className="absolute top-6 right-6 bg-secondary">Certified</Badge>
                  )}
                  <CardTitle>{pet.name}</CardTitle>
                  <CardDescription>{pet.breed} • {pet.age}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    {pet.location}
                  </div>
                  <div className="text-2xl font-bold text-primary">{pet.price}</div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuyPets;
