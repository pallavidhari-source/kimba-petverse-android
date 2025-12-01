import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Star, Phone, Clock } from "lucide-react";

const Vets = () => {
  const navigate = useNavigate();

  const veterinarians = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      specialization: "General Practice",
      clinic: "Pet Care Clinic",
      location: "Banjara Hills",
      rating: 4.8,
      phone: "+91 98765 43210",
      hours: "9 AM - 8 PM",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      specialization: "Surgery & Emergency",
      clinic: "Animal Hospital",
      location: "Jubilee Hills",
      rating: 4.9,
      phone: "+91 98765 43211",
      hours: "24/7",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Dr. Anil Reddy",
      specialization: "Dermatology",
      clinic: "Skin & Coat Clinic",
      location: "Hitech City",
      rating: 4.7,
      phone: "+91 98765 43212",
      hours: "10 AM - 7 PM",
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
              Veterinarians
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Connect with certified veterinarians for your pet's health needs.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {veterinarians.map((vet) => (
              <Card key={vet.id}>
                <CardHeader>
                  <img 
                    src={vet.image} 
                    alt={vet.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle>{vet.name}</CardTitle>
                  <CardDescription>{vet.specialization}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-semibold">{vet.clinic}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {vet.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    {vet.rating}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {vet.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {vet.hours}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => navigate("/book-vet-appointment", { state: { vet } })}
                  >
                    Book Appointment
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

export default Vets;
