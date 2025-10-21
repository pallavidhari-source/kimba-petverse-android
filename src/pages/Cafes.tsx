import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Coffee, Clock } from "lucide-react";
import cafePawsome from "@/assets/cafe-pawsome.jpg";
import cafeFurry from "@/assets/cafe-furry.jpg";
import cafeWoof from "@/assets/cafe-woof.jpg";

const Cafes = () => {
  const petCafes = [
    {
      id: 1,
      name: "Paws & Coffee",
      type: "Dog Cafe",
      location: "Banjara Hills",
      rating: 4.8,
      speciality: "Specialty Coffee & Treats",
      hours: "9 AM - 9 PM",
      image: cafePawsome,
      features: ["Pet-Friendly", "Outdoor Seating", "Wi-Fi"]
    },
    {
      id: 2,
      name: "Whiskers Cafe",
      type: "Cat Cafe",
      location: "Jubilee Hills",
      rating: 4.9,
      speciality: "Japanese Style Cat Cafe",
      hours: "10 AM - 10 PM",
      image: cafeFurry,
      features: ["Adoptable Cats", "Books", "Board Games"]
    },
    {
      id: 3,
      name: "The Pet Lounge",
      type: "Multi-Pet Cafe",
      location: "Hitech City",
      rating: 4.7,
      speciality: "All Pets Welcome",
      hours: "8 AM - 11 PM",
      image: cafeWoof,
      features: ["Pet Menu", "Play Area", "Photo Booth"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl mb-4">
              Pet Cafes
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Enjoy quality time with your pet at these pet-friendly cafes.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {petCafes.map((cafe) => (
              <Card key={cafe.id}>
                <CardHeader>
                  <img 
                    src={cafe.image} 
                    alt={cafe.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle>{cafe.name}</CardTitle>
                  <CardDescription>{cafe.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    {cafe.rating}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {cafe.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {cafe.hours}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Coffee className="h-4 w-4" />
                    <span className="font-medium">{cafe.speciality}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {cafe.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Reserve Table</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cafes;
