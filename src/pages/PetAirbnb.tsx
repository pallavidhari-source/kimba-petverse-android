import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Home, Calendar } from "lucide-react";

const PetAirbnb = () => {
  const petStays = [
    {
      id: 1,
      name: "Cozy Pet Villa",
      type: "Entire Home",
      location: "Banjara Hills",
      rating: 4.9,
      reviews: 45,
      price: "₹2,500",
      duration: "per night",
      image: "/placeholder.svg",
      features: ["Pet-Safe Garden", "24/7 Care", "Premium Food"]
    },
    {
      id: 2,
      name: "Luxury Pet Suite",
      type: "Private Room",
      location: "Jubilee Hills",
      rating: 4.8,
      reviews: 32,
      price: "₹1,800",
      duration: "per night",
      image: "/placeholder.svg",
      features: ["AC Room", "Playtime", "Vet on Call"]
    },
    {
      id: 3,
      name: "Pet Paradise Resort",
      type: "Entire Home",
      location: "Hitech City",
      rating: 5.0,
      reviews: 67,
      price: "₹3,200",
      duration: "per night",
      image: "/placeholder.svg",
      features: ["Pool Access", "Grooming", "Training Sessions"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl mb-4">
              Pet Airbnb
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Book premium stays for your pets while you're away. Trusted homes with verified pet care.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {petStays.map((stay) => (
              <Card key={stay.id}>
                <CardHeader>
                  <img 
                    src={stay.image} 
                    alt={stay.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <Badge className="absolute top-6 right-6">{stay.type}</Badge>
                  <CardTitle>{stay.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {stay.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-medium">{stay.rating}</span>
                    <span className="text-muted-foreground">({stay.reviews} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stay.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                  <div className="pt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary">{stay.price}</span>
                      <span className="text-sm text-muted-foreground">{stay.duration}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Stay
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

export default PetAirbnb;
