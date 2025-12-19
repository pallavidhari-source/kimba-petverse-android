import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, CheckCircle, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const PetWalkers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const petWalkers = [
    {
      id: 1,
      name: "Rahul Sharma",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      hourlyCharge: 250,
      rating: 4.9,
      reviewsCount: 156,
      availability: "Available",
      availableSlots: ["Morning (6AM-10AM)", "Evening (4PM-8PM)"],
      isCertified: true,
      certifications: ["Pet First Aid", "Canine Behavior Training"],
      location: "Koramangala, Bangalore",
      phone: "+91 98765 43210",
      experience: "3 years",
      specialties: ["Dogs", "Large Breeds"],
      bio: "Passionate dog lover with extensive experience in handling all breeds. Certified in pet first aid and behavior training."
    },
    {
      id: 2,
      name: "Priya Patel",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      hourlyCharge: 200,
      rating: 4.8,
      reviewsCount: 98,
      availability: "Available",
      availableSlots: ["Morning (7AM-11AM)", "Afternoon (2PM-5PM)"],
      isCertified: true,
      certifications: ["Dog Training Certified", "Pet CPR"],
      location: "HSR Layout, Bangalore",
      phone: "+91 87654 32109",
      experience: "2 years",
      specialties: ["Small Dogs", "Puppies"],
      bio: "Specialized in handling small breeds and puppies. Gentle and patient approach to pet walking."
    },
    {
      id: 3,
      name: "Amit Kumar",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      hourlyCharge: 300,
      rating: 4.95,
      reviewsCount: 234,
      availability: "Busy",
      availableSlots: ["Evening (5PM-9PM)"],
      isCertified: true,
      certifications: ["Professional Dog Walker", "Animal Behavior Specialist", "Pet Nutrition"],
      location: "Indiranagar, Bangalore",
      phone: "+91 76543 21098",
      experience: "5 years",
      specialties: ["All Breeds", "Senior Dogs", "Special Needs"],
      bio: "Highly experienced walker with specialty in senior and special needs dogs. Trained in animal behavior."
    },
    {
      id: 4,
      name: "Sneha Reddy",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      hourlyCharge: 180,
      rating: 4.7,
      reviewsCount: 67,
      availability: "Available",
      availableSlots: ["Morning (6AM-9AM)", "Evening (6PM-9PM)"],
      isCertified: false,
      certifications: [],
      location: "Whitefield, Bangalore",
      phone: "+91 65432 10987",
      experience: "1 year",
      specialties: ["Dogs", "Cats"],
      bio: "Animal lover providing reliable and caring pet walking services. Great with both dogs and cats."
    },
    {
      id: 5,
      name: "Vikram Singh",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      hourlyCharge: 275,
      rating: 4.85,
      reviewsCount: 189,
      availability: "Available",
      availableSlots: ["Full Day Available"],
      isCertified: true,
      certifications: ["Certified Dog Trainer", "Pet First Aid", "Agility Training"],
      location: "JP Nagar, Bangalore",
      phone: "+91 54321 09876",
      experience: "4 years",
      specialties: ["Active Dogs", "Training Walks"],
      bio: "Former professional dog trainer offering walking services with training elements. Perfect for energetic dogs."
    },
    {
      id: 6,
      name: "Meera Krishnan",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      hourlyCharge: 220,
      rating: 4.75,
      reviewsCount: 112,
      availability: "Weekend Only",
      availableSlots: ["Saturday & Sunday (All Day)"],
      isCertified: true,
      certifications: ["Pet Care Certified"],
      location: "BTM Layout, Bangalore",
      phone: "+91 43210 98765",
      experience: "2.5 years",
      specialties: ["Weekend Walks", "Park Visits"],
      bio: "Weekend specialist offering extended walks and park visits. Great for busy pet parents."
    }
  ];

  const handleBookWalker = (walker: any) => {
    if (!user) {
      sessionStorage.setItem('pendingWalkerBooking', JSON.stringify(walker));
      toast.info("Please sign in to book a pet walker", {
        action: {
          label: "OK",
          onClick: () => {}
        }
      });
      navigate("/auth");
      return;
    }

    toast.success(`Booking request sent to ${walker.name}!`, {
      description: "They will contact you shortly to confirm the walk.",
      action: {
        label: "OK",
        onClick: () => {}
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Professional Pet Walkers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find trusted and certified pet walkers in your area. Our walkers are background-verified and trained to provide the best care for your furry friends.
          </p>
          <Button 
            onClick={() => navigate("/pet-walker-signup")} 
            className="mt-6 bg-gradient-to-r from-primary to-accent"
          >
            Become a Pet Walker
          </Button>
        </div>

        {/* Walkers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {petWalkers.map((walker) => (
            <Card key={walker.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/20">
              <div className="relative">
                <img
                  src={walker.image}
                  alt={walker.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant={walker.availability === "Available" ? "default" : walker.availability === "Busy" ? "destructive" : "secondary"}
                    className="font-semibold"
                  >
                    {walker.availability}
                  </Badge>
                </div>
                {walker.isCertified && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-green-500 text-white flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Certified
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{walker.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {walker.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold">{walker.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({walker.reviewsCount} reviews)</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{walker.bio}</p>
                
                <div className="flex flex-wrap gap-1">
                  {walker.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {walker.isCertified && walker.certifications.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-green-600">Certifications:</span>
                    <div className="flex flex-wrap gap-1">
                      {walker.certifications.slice(0, 2).map((cert, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-700">
                          {cert}
                        </Badge>
                      ))}
                      {walker.certifications.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{walker.certifications.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground">Available Slots:</span>
                  <div className="flex flex-wrap gap-1">
                    {walker.availableSlots.map((slot, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <span className="text-2xl font-bold text-primary">₹{walker.hourlyCharge}</span>
                    <span className="text-sm text-muted-foreground">/hour</span>
                  </div>
                  <Button 
                    onClick={() => handleBookWalker(walker)}
                    disabled={walker.availability === "Busy"}
                    className="bg-gradient-to-r from-primary to-accent"
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PetWalkers;