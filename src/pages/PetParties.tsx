import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Users, Cake, Music, Utensils } from "lucide-react";

const PetParties = () => {
  const venues = [
    {
      id: 1,
      name: "Pawsome Party Resort",
      description: "Spacious outdoor resort with dedicated pet play areas, pool access, and party decorations",
      location: "Shamirpet, Hyderabad",
      phone: "+91 98765 43210",
      capacity: "50-100 pets & guests",
      amenities: ["Outdoor Play Area", "Swimming Pool", "Catering Service", "Party Decorations", "Pet-Safe Equipment"],
      price: "₹15,000 - ₹30,000",
      image: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=800&q=80"
    },
    {
      id: 2,
      name: "Furry Friends Function Hall",
      description: "Indoor air-conditioned hall perfect for all-season celebrations with professional event management",
      location: "Gachibowli, Hyderabad",
      phone: "+91 98765 43211",
      capacity: "30-60 pets & guests",
      amenities: ["Air Conditioning", "Professional Photography", "Themed Decorations", "Pet Menu Options", "Sound System"],
      price: "₹12,000 - ₹25,000",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80"
    },
    {
      id: 3,
      name: "Green Paws Farmhouse",
      description: "Rustic farmhouse setting with open fields, natural shade, and farm animals for entertainment",
      location: "Kompally, Hyderabad",
      phone: "+91 98765 43212",
      capacity: "40-80 pets & guests",
      amenities: ["Open Fields", "Natural Shade", "Farm Animals", "BBQ Setup", "Parking Space"],
      price: "₹10,000 - ₹20,000",
      image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80"
    },
    {
      id: 4,
      name: "Petopia Celebration Center",
      description: "Modern venue with both indoor and outdoor spaces, fully equipped for memorable pet celebrations",
      location: "Madhapur, Hyderabad",
      phone: "+91 98765 43213",
      capacity: "20-50 pets & guests",
      amenities: ["Indoor & Outdoor", "Event Coordinator", "Pet Bakery Options", "Music System", "Valet Parking"],
      price: "₹18,000 - ₹35,000",
      image: "https://images.unsplash.com/photo-1519167758481-83f29da8ae39?w=800&q=80"
    },
    {
      id: 5,
      name: "Wagging Tails Party Lawn",
      description: "Beautiful garden venue with manicured lawns, perfect for outdoor birthday parties and celebrations",
      location: "Kondapur, Hyderabad",
      phone: "+91 98765 43214",
      capacity: "60-120 pets & guests",
      amenities: ["Garden Setting", "Outdoor Lighting", "Tent Setup", "Catering Kitchen", "Pet Activities"],
      price: "₹20,000 - ₹40,000",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80"
    },
    {
      id: 6,
      name: "Paws & Celebrate Villa",
      description: "Luxury villa rental with pool, lawn, and indoor spaces for exclusive pet party experiences",
      location: "Jubilee Hills, Hyderabad",
      phone: "+91 98765 43215",
      capacity: "25-50 pets & guests",
      amenities: ["Private Pool", "Luxury Interior", "Full Kitchen", "DJ Services", "Premium Catering"],
      price: "₹25,000 - ₹50,000",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cake className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Kimba Pet Pawrties</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Celebrate your furry friend's special moments at the best pet-friendly venues in and around Hyderabad. 
            From birthdays to adoption anniversaries, make every occasion unforgettable!
          </p>
        </div>

        {/* Venues Grid */}
        {venues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No party venues available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={venue.image} 
                  alt={venue.name}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {venue.name}
                  </CardTitle>
                  <CardDescription>{venue.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>{venue.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{venue.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary flex-shrink-0" />
                      <span><strong>Capacity:</strong> {venue.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cake className="w-4 h-4 text-primary flex-shrink-0" />
                      <span><strong>Price Range:</strong> {venue.price}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Music className="w-4 h-4 text-primary" />
                      Amenities:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {venue.amenities.map((amenity, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-primary/5 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-primary" />
            Why Choose Kimba Pet Pawrties?
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Pet-Safe Environments</h3>
              <p className="text-muted-foreground">All venues are thoroughly vetted for pet safety with secure spaces and pet-friendly amenities.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Professional Services</h3>
              <p className="text-muted-foreground">From decoration to catering, enjoy professional event management tailored for pets.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Flexible Packages</h3>
              <p className="text-muted-foreground">Choose from various packages to suit your budget and party size.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Memorable Experiences</h3>
              <p className="text-muted-foreground">Create lasting memories with photography, entertainment, and special activities for your pets.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetParties;
