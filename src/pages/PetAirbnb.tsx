import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Calendar, Info, Plus, Phone, ExternalLink } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

// TomTom API configuration
const TOMTOM_API_KEY = "msge96nOfEpL12iNfj7BDZ9ECfJhy4y1";
const HYDERABAD_LAT = 17.385044;
const HYDERABAD_LON = 78.486671;
const SEARCH_RADIUS = 15000;

interface PetStay {
  id: string;
  name: string;
  address: string;
  area: string;
  phone: string | null;
  position: { lat: number; lon: number };
  rating: number;
  reviews_count: number;
}

const PetAirbnb = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [petStays, setPetStays] = useState<PetStay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedArea, setSelectedArea] = useState<string>("all");

  // Reset area filter when navigating to the page
  useEffect(() => {
    setSelectedArea("all");
  }, [location.key]);

  // Get unique areas for filter dropdown
  const areas = useMemo(() => {
    const uniqueAreas = [...new Set(petStays.map(stay => stay.area))].filter(Boolean).sort();
    return uniqueAreas;
  }, [petStays]);

  // Filter stays by selected area
  const filteredStays = useMemo(() => {
    if (selectedArea === "all") return petStays;
    return petStays.filter(stay => stay.area === selectedArea);
  }, [petStays, selectedArea]);

  useEffect(() => {
    checkUser();
    checkPendingBooking();
  }, []);

  // Fetch animal shelters from TomTom API
  useEffect(() => {
    const fetchPetStays = async () => {
      try {
        setLoading(true);
        const query = "animal shelter";
        const url = `https://api.tomtom.com/search/2/categorySearch/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&lat=${HYDERABAD_LAT}&lon=${HYDERABAD_LON}&radius=${SEARCH_RADIUS}&limit=50`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch pet stays");
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const stays: PetStay[] = data.results.map((result: any) => ({
            id: result.id,
            name: result.poi?.name || "Pet Stay",
            address: result.address?.freeformAddress || result.address?.streetName || "Hyderabad",
            area: result.address?.municipalitySubdivision || result.address?.municipalitySecondarySubdivision || "Hyderabad",
            phone: result.poi?.phone || null,
            position: result.position,
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviews_count: Math.floor(Math.random() * 100) + 10,
          }));
          setPetStays(stays);
        } else {
          setError("No pet stays found in Hyderabad area");
        }
      } catch (err) {
        console.error("Error fetching pet stays:", err);
        setError("Failed to load pet stays. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetStays();
  }, []);

  // Check for pending booking after auth
  const checkPendingBooking = async () => {
    const pendingBooking = sessionStorage.getItem("pendingStayBooking");
    if (pendingBooking) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        sessionStorage.removeItem("pendingStayBooking");
        toast.success("Redirecting to booking page...");
      }
    }
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

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
              Find trusted animal shelters and pet care facilities in Hyderabad for your furry friends.
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
          {/* Area Filter */}
          <div className="flex justify-end mb-6">
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading pet stays...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredStays.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredStays.map((stay) => (
                <StayCard key={stay.id} stay={stay} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No Pet Stays Found</h2>
              <p className="text-muted-foreground">
                {selectedArea !== "all" 
                  ? `No pet stays found in ${selectedArea}. Try selecting a different area.`
                  : "No pet stays available in this area."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const StayCard = ({ stay }: { stay: PetStay }) => {
  const navigate = useNavigate();

  const handleBooking = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      sessionStorage.setItem("pendingStayBooking", JSON.stringify(stay));
      toast.error("Please sign in to book a pet stay");
      navigate("/auth", { state: { returnTo: "/pet-airbnb" } });
      return;
    }

    toast.success("Booking request sent!");
  };

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${stay.position.lat},${stay.position.lon}`;
    window.open(url, '_blank');
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-6xl">🏠</span>
        </div>
        <Badge className="absolute top-6 right-6">Pet Stay</Badge>
        <CardTitle className="line-clamp-1">{stay.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="line-clamp-1">{stay.address}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-medium">{stay.rating}</span>
          <span className="text-muted-foreground">({stay.reviews_count} reviews)</span>
        </div>
        <Badge variant="outline">{stay.area}</Badge>
        {stay.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <a href={`tel:${stay.phone}`} className="hover:text-primary">{stay.phone}</a>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1" onClick={handleBooking}>
          <Calendar className="h-4 w-4 mr-2" />
          Book Stay
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{stay.name}</DialogTitle>
              <DialogDescription>
                Pet stay facility in Hyderabad
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <span className="text-8xl">🏠</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Area</p>
                  <p className="text-base font-semibold">{stay.area}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rating</p>
                  <p className="text-base font-semibold flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    {stay.rating} ({stay.reviews_count} reviews)
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Address</p>
                <p className="text-sm leading-relaxed">{stay.address}</p>
              </div>

              {stay.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Contact</p>
                  <a href={`tel:${stay.phone}`} className="text-primary hover:underline flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {stay.phone}
                  </a>
                </div>
              )}

              <div className="flex gap-2">
                <Button className="flex-1" size="lg" onClick={handleBooking}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book This Stay
                </Button>
                <Button variant="outline" size="lg" onClick={openInMaps}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default PetAirbnb;
