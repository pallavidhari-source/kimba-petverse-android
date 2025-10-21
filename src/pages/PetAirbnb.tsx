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
      features: ["Private Garden", "24/7 Care", "Gourmet Meals", "Webcam Access"],
      description: "Spacious luxury villa with 2000 sq ft dedicated pet space. Perfect for large dogs or multiple pets. Features include climate-controlled rooms, premium orthopedic beds, and a private garden with play equipment.",
      amenities: ["Climate Control", "WiFi Cameras", "Premium Food", "Daily Walks", "Grooming", "Vet on Call"],
      maxCapacity: "4 pets",
      petTypes: "Dogs, Cats",
      checkIn: "10:00 AM",
      checkOut: "12:00 PM"
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
      features: ["Climate Control", "Premium Bedding", "Vet on Call", "Daily Updates"],
      description: "Modern pet suite with luxury amenities and personalized care. Each suite is soundproofed and features entertainment options including pet TV and calming music.",
      amenities: ["AC Rooms", "Orthopedic Beds", "Webcam", "Playtime Sessions", "Treats", "Emergency Care"],
      maxCapacity: "2 pets",
      petTypes: "Dogs, Cats, Small Pets",
      checkIn: "9:00 AM",
      checkOut: "11:00 AM"
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
      features: ["Pool Access", "Spa & Grooming", "Training Sessions", "Play Park"],
      description: "Ultimate pet resort experience with swimming pool, spa services, and professional training programs. Our 5-acre facility includes indoor and outdoor play areas, agility courses, and a dedicated cat zone.",
      amenities: ["Swimming Pool", "Spa Services", "Professional Grooming", "Training Classes", "Play Park", "Luxury Suites"],
      maxCapacity: "6 pets",
      petTypes: "All Pets Welcome",
      checkIn: "8:00 AM",
      checkOut: "6:00 PM"
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
      features: ["Socialization", "Group Play", "Standard Care", "Indoor/Outdoor"],
      description: "Affordable and friendly pet lodge perfect for social pets. Features include supervised group play sessions, indoor climate-controlled space, and outdoor play area.",
      amenities: ["Group Activities", "Basic Care", "Daily Walks", "Standard Meals", "Play Area", "Comfortable Beds"],
      maxCapacity: "8 pets",
      petTypes: "Dogs, Cats",
      checkIn: "9:00 AM",
      checkOut: "10:00 AM"
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
      features: ["Butler Service", "Chef-Prepared Meals", "Massage Therapy", "Private Pool"],
      description: "The pinnacle of luxury pet accommodation. Features dedicated butler service, chef-prepared organic meals, therapeutic massage, and a private heated pool. Perfect for VIP pets.",
      amenities: ["Butler Service", "Gourmet Kitchen", "Massage Therapy", "Private Pool", "Luxury Suites", "24/7 Monitoring"],
      maxCapacity: "3 pets",
      petTypes: "Dogs, Cats",
      checkIn: "Flexible",
      checkOut: "Flexible"
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
      features: ["Cozy Rooms", "Daily Walks", "Treats Included", "Photo Updates"],
      description: "Cozy boutique inn with a homely atmosphere. Perfect for first-time boarders. Includes multiple daily walks, photo updates, and plenty of love and attention.",
      amenities: ["Cozy Environment", "Multiple Walks", "Photo Updates", "Treats", "Play Sessions", "Cuddle Time"],
      maxCapacity: "5 pets",
      petTypes: "Dogs, Cats, Rabbits",
      checkIn: "10:00 AM",
      checkOut: "11:00 AM"
    }
  ];

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
        </div>
      </section>
    </div>
  );
};

export default PetAirbnb;
