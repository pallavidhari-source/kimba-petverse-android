import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Home, Calendar, Info, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PetAirbnb = () => {
  const navigate = useNavigate();
  const [selectedStay, setSelectedStay] = useState<any>(null);
  const [petStays, setPetStays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    fetchPetStays();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchPetStays = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_stays')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPetStays(data || []);
    } catch (error: any) {
      console.error('Error fetching pet stays:', error);
      toast.error('Failed to load pet stays');
    } finally {
      setLoading(false);
    }
  };

  const commercialStays = petStays.filter(stay => stay.type === 'commercial');
  const individualStays = petStays.filter(stay => stay.type === 'individual');

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl mb-4">
              Kimba Pet Stays
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-6">
              Book premium stays for your pets while you're away. Trusted homes with verified pet care.
            </p>
            {user && (
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/create-pet-stay')}
              >
                <Plus className="h-5 w-5 mr-2" />
                List Your Pet Stay
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="all">All Stays</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
              <TabsTrigger value="individual">Homes</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading pet stays...</p>
                </div>
              ) : petStays.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {petStays.map((stay) => (
                    <StayCard key={stay.id} stay={stay} setSelectedStay={setSelectedStay} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold mb-2">No Pet Stays Available</h2>
                  <p className="text-muted-foreground">Be the first to list your pet accommodation!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="commercial">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading commercial stays...</p>
                </div>
              ) : commercialStays.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {commercialStays.map((stay) => (
                    <StayCard key={stay.id} stay={stay} setSelectedStay={setSelectedStay} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold mb-2">No Commercial Stays Available</h2>
                  <p className="text-muted-foreground">Check back soon for commercial boarding facilities.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="individual">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading homes...</p>
                </div>
              ) : individualStays.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {individualStays.map((stay) => (
                    <StayCard key={stay.id} stay={stay} setSelectedStay={setSelectedStay} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-semibold mb-2">No Homes Available</h2>
                  <p className="text-muted-foreground">Check back soon for home pet accommodations.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

const StayCard = ({ stay, setSelectedStay }: any) => {
  const navigate = useNavigate();

  const handleBooking = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please sign in to book a pet stay");
      navigate("/auth", { state: { returnTo: "/pet-airbnb" } });
      return;
    }

    // TODO: Navigate to booking page with stay details
    toast.success("Redirecting to booking page...");
  };

  return (
    <Card>
      <CardHeader>
        {stay.image_url && (
          <img 
            src={stay.image_url} 
            alt={stay.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <Badge className="absolute top-6 right-6 capitalize">{stay.type}</Badge>
        <CardTitle>{stay.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="h-3 w-3" />
          {stay.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-medium">{stay.rating || 0}</span>
          <span className="text-muted-foreground">({stay.reviews_count || 0} reviews)</span>
        </div>
        {stay.features && stay.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {stay.features.slice(0, 3).map((feature: string, idx: number) => (
              <Badge key={idx} variant="outline">{feature}</Badge>
            ))}
          </div>
        )}
        <div className="pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">₹{stay.price_per_night}</span>
            <span className="text-sm text-muted-foreground">per night</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1" onClick={handleBooking}>
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
              {stay.image_url && (
                <div>
                  <img 
                    src={stay.image_url} 
                    alt={stay.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-base font-semibold capitalize">{stay.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-base font-semibold">{stay.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rating</p>
                  <p className="text-base font-semibold flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    {stay.rating || 0} ({stay.reviews_count || 0} reviews)
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p className="text-base font-semibold">₹{stay.price_per_night} / night</p>
                </div>
                {stay.max_capacity && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Max Capacity</p>
                    <p className="text-base font-semibold">{stay.max_capacity}</p>
                  </div>
                )}
                {stay.pet_types && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pet Types</p>
                    <p className="text-base font-semibold">{stay.pet_types}</p>
                  </div>
                )}
                {stay.check_in_time && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Check-In</p>
                    <p className="text-base font-semibold">{stay.check_in_time}</p>
                  </div>
                )}
                {stay.check_out_time && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Check-Out</p>
                    <p className="text-base font-semibold">{stay.check_out_time}</p>
                  </div>
                )}
              </div>

              {stay.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                  <p className="text-sm leading-relaxed">{stay.description}</p>
                </div>
              )}

              {stay.amenities && stay.amenities.length > 0 && (
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
              )}

              {stay.features && stay.features.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Key Features</p>
                  <div className="flex flex-wrap gap-2">
                    {stay.features.map((feature: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{feature}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button className="w-full" size="lg" onClick={handleBooking}>
                <Calendar className="h-4 w-4 mr-2" />
                Book This Stay
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default PetAirbnb;
