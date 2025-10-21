import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Home, Calendar } from "lucide-react";
import airbnbVilla from "@/assets/airbnb-villa.jpg";
import airbnbSuite from "@/assets/airbnb-suite.jpg";
import airbnbResort from "@/assets/airbnb-resort.jpg";

const PetAirbnb = () => {
  const petStays = [
    {
      id: 1,
      name: "Luxe Pet Villa",
      type: "Entire Villa",
      location: "Banjara Hills",
      rating: 4.9,
      reviews: 127,
      price: "₹3,500",
      duration: "per night",
      image: airbnbVilla,
      features: ["Private Garden", "24/7 Care", "Gourmet Meals", "Webcam Access"]
    },
    {
      id: 2,
      name: "VIP Pet Suite",
      type: "Private Suite",
      location: "Jubilee Hills",
      rating: 4.8,
      reviews: 89,
      price: "₹2,200",
      duration: "per night",
      image: airbnbSuite,
      features: ["Climate Control", "Premium Bedding", "Vet on Call", "Daily Updates"]
    },
    {
      id: 3,
      name: "Pet Paradise Resort",
      type: "Resort Stay",
      location: "Hitech City",
      rating: 5.0,
      reviews: 215,
      price: "₹4,800",
      duration: "per night",
      image: airbnbResort,
      features: ["Pool Access", "Spa & Grooming", "Training Sessions", "Play Park"]
    },
    {
      id: 4,
      name: "Comfort Pet Lodge",
      type: "Shared Space",
      location: "Gachibowli",
      rating: 4.7,
      reviews: 56,
      price: "₹1,500",
      duration: "per night",
      image: airbnbVilla,
      features: ["Socialization", "Group Play", "Standard Care", "Indoor/Outdoor"]
    },
    {
      id: 5,
      name: "Royal Pet Mansion",
      type: "Luxury Villa",
      location: "Madhapur",
      rating: 4.9,
      reviews: 143,
      price: "₹5,500",
      duration: "per night",
      image: airbnbSuite,
      features: ["Butler Service", "Chef-Prepared Meals", "Massage Therapy", "Private Pool"]
    },
    {
      id: 6,
      name: "Paws & Relax Inn",
      type: "Boutique Stay",
      location: "Kondapur",
      rating: 4.6,
      reviews: 72,
      price: "₹1,800",
      duration: "per night",
      image: airbnbResort,
      features: ["Cozy Rooms", "Daily Walks", "Treats Included", "Photo Updates"]
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
