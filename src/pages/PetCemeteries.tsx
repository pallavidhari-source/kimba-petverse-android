import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Heart } from "lucide-react";

const PetCemeteries = () => {
  const cemeteries = [
    {
      id: 1,
      name: "Rainbow Bridge Pet Memorial",
      location: "123 Memorial Lane, Green Valley",
      phone: "+1 (555) 123-4567",
      hours: "Mon-Sat: 9AM-5PM, Sun: 10AM-4PM",
      description: "A peaceful resting place for your beloved companions with beautiful garden settings.",
      services: ["Burial Services", "Cremation", "Memorial Stones", "Garden Plots"],
      image: "https://images.unsplash.com/photo-1604881989793-466e2c35f731?w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Eternal Paws Pet Cemetery",
      location: "456 Peaceful Drive, Meadowbrook",
      phone: "+1 (555) 234-5678",
      hours: "Daily: 8AM-6PM",
      description: "Dedicated to honoring the memory of your cherished pets with compassionate care.",
      services: ["Individual Burial", "Cremation Services", "Urns & Keepsakes", "Memorial Garden"],
      image: "https://images.unsplash.com/photo-1518005068251-37900150dfca?w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Peaceful Meadows Pet Memorial Park",
      location: "789 Serenity Road, Hillside",
      phone: "+1 (555) 345-6789",
      hours: "Mon-Fri: 9AM-6PM, Weekends: 10AM-5PM",
      description: "A tranquil sanctuary where cherished memories live forever in our hearts.",
      services: ["Pet Burial", "Cremation", "Memorial Plaques", "Private Plots"],
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Pet Cemeteries</h1>
          <p className="text-lg text-muted-foreground">
            Honoring the memory of our beloved companions with dignity and love
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cemeteries.map((cemetery) => (
            <Card key={cemetery.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={cemetery.image}
                  alt={cemetery.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  {cemetery.name}
                </CardTitle>
                <CardDescription>{cemetery.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{cemetery.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{cemetery.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{cemetery.hours}</span>
                </div>
                <div className="pt-2">
                  <p className="mb-2 text-sm font-semibold">Services:</p>
                  <div className="flex flex-wrap gap-2">
                    {cemetery.services.map((service, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <Button className="w-full mt-4">Contact Cemetery</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PetCemeteries;
