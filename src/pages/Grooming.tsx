import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock } from "lucide-react";

const Grooming = () => {
  const groomingServices = [
    {
      id: 1,
      name: "Pawfect Grooming",
      services: ["Bath & Brush", "Haircut", "Nail Trim"],
      location: "Madhapur",
      rating: 4.8,
      price: "Starting from ₹599",
      hours: "10 AM - 7 PM",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Pet Spa Deluxe",
      services: ["Full Grooming", "Spa Treatment", "Dental Care"],
      location: "Gachibowli",
      rating: 4.9,
      price: "Starting from ₹899",
      hours: "9 AM - 8 PM",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Happy Tails Salon",
      services: ["Express Grooming", "De-shedding", "Teeth Cleaning"],
      location: "Kondapur",
      rating: 4.7,
      price: "Starting from ₹699",
      hours: "10 AM - 6 PM",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl mb-4">
              Pet Grooming
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Professional grooming services to keep your pet looking and feeling their best.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groomingServices.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    {service.rating}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {service.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {service.hours}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.services.map((s, idx) => (
                      <Badge key={idx} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                  <p className="font-semibold text-primary">{service.price}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Service</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Grooming;
