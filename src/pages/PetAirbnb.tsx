import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Star, Home, Calendar, Info, Wifi, Camera, UtensilsCrossed, Droplets, Wind } from "lucide-react";
import { useState } from "react";
import airbnbVilla from "@/assets/airbnb-villa.jpg";
import airbnbSuite from "@/assets/airbnb-suite.jpg";
import airbnbResort from "@/assets/airbnb-resort.jpg";

const PetAirbnb = () => {
  const [selectedStay, setSelectedStay] = useState<any>(null);
  
  const petStays: any[] = [];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl mb-4">
              Kimba Pet Stays
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Book premium stays for your pets while you're away. Trusted homes with verified pet care.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {petStays.length > 0 ? (
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
                <CardFooter className="flex gap-2">
                  <Button className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Stay
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setSelectedStay(stay)}>
                        <Info className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{stay.name}</DialogTitle>
                        <DialogDescription>
                          Complete details about this pet accommodation
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <img 
                            src={stay.image} 
                            alt={stay.name}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Type</p>
                            <p className="text-base font-semibold">{stay.type}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Location</p>
                            <p className="text-base font-semibold">{stay.location}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Rating</p>
                            <p className="text-base font-semibold flex items-center gap-1">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              {stay.rating} ({stay.reviews} reviews)
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Price</p>
                            <p className="text-base font-semibold">{stay.price} / night</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Max Capacity</p>
                            <p className="text-base font-semibold">{stay.maxCapacity}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Pet Types</p>
                            <p className="text-base font-semibold">{stay.petTypes}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Check-In</p>
                            <p className="text-base font-semibold">{stay.checkIn}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Check-Out</p>
                            <p className="text-base font-semibold">{stay.checkOut}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                          <p className="text-sm leading-relaxed">{stay.description}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-3">Amenities</p>
                          <div className="grid grid-cols-2 gap-2">
                            {stay.amenities.map((amenity: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                {amenity}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Key Features</p>
                          <div className="flex flex-wrap gap-2">
                            {stay.features.map((feature: string, idx: number) => (
                              <Badge key={idx} variant="secondary">{feature}</Badge>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full" size="lg">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book This Stay
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No Pet Stays Available</h2>
              <p className="text-muted-foreground">Check back soon for premium pet accommodation options.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PetAirbnb;
