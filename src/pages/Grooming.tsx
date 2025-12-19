import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Phone, Clock, Loader2, Filter, Scissors } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GroomingService {
  id: string;
  name: string;
  address: string;
  area: string;
  phone?: string;
  rating?: number;
  distance: number;
  position: {
    lat: number;
    lon: number;
  };
}

const TOMTOM_API_KEY = "msge96nOfEpL12iNfj7BDZ9ECfJhy4y1";
const HYDERABAD_LAT = 17.385044;
const HYDERABAD_LON = 78.486671;
const SEARCH_RADIUS = 15000;

const Grooming = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [groomingServices, setGroomingServices] = useState<GroomingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>("all");

  // Reset filter when navigating to this page
  useEffect(() => {
    setSelectedArea("all");
  }, [location.key]);

  // Get unique areas from data
  const areas = useMemo(() => {
    const uniqueAreas = [...new Set(groomingServices.map(v => v.area).filter(Boolean))];
    return uniqueAreas.sort();
  }, [groomingServices]);

  // Filter services by area
  const filteredServices = useMemo(() => {
    if (selectedArea === "all") return groomingServices;
    return groomingServices.filter(v => v.area === selectedArea);
  }, [groomingServices, selectedArea]);

  // Fetch pet grooming services from TomTom API
  useEffect(() => {
    const fetchGroomingServices = async () => {
      try {
        setLoading(true);
        const query = "pet grooming";
        const url = `https://api.tomtom.com/search/2/categorySearch/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&lat=${HYDERABAD_LAT}&lon=${HYDERABAD_LON}&radius=${SEARCH_RADIUS}&limit=50`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch grooming services");
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const services: GroomingService[] = data.results.map((result: any) => ({
            id: result.id,
            name: result.poi?.name || "Pet Grooming",
            address: result.address?.freeformAddress || result.address?.streetName || "Hyderabad",
            area: result.address?.municipalitySubdivision || result.address?.municipalitySecondarySubdivision || "Hyderabad",
            phone: result.poi?.phone || null,
            rating: result.score ? Math.min(5, (result.score / 2)).toFixed(1) : null,
            distance: result.dist ? Math.round(result.dist) : 0,
            position: result.position
          }));
          setGroomingServices(services);
        } else {
          setError("No pet grooming services found in Hyderabad area");
        }
      } catch (err) {
        console.error("Error fetching grooming services:", err);
        setError("Failed to load grooming services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroomingServices();
  }, []);

  // Check for pending booking after auth
  useEffect(() => {
    const checkPendingBooking = async () => {
      const pendingBooking = sessionStorage.getItem("pendingGroomingBooking");
      if (pendingBooking) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const service = JSON.parse(pendingBooking);
          sessionStorage.removeItem("pendingGroomingBooking");
          toast.success(`Booking ${service.name}...`);
        }
      }
    };
    checkPendingBooking();
  }, [navigate]);

  const handleBooking = async (service: GroomingService) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      sessionStorage.setItem("pendingGroomingBooking", JSON.stringify(service));
      toast.error("Please sign in to book grooming service");
      navigate("/auth", { state: { returnTo: "/grooming" } });
      return;
    }

    toast.success(`Booking ${service.name}...`);
  };

  const handleViewOnMap = (service: GroomingService) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${service.position.lat},${service.position.lon}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl mb-4">
              Pet Grooming in Hyderabad
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Professional grooming services to keep your pet looking and feeling their best. Real-time data from salons near you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filter Section */}
          {!loading && !error && groomingServices.length > 0 && (
            <div className="mb-8 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Filter by Area:</span>
              </div>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-[220px] bg-background">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                Showing {filteredServices.length} of {groomingServices.length} services
              </span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading pet grooming services in Hyderabad...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="w-full h-48 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-lg mb-4 flex items-center justify-center">
                      <Scissors className="h-16 w-16 text-pink-500" />
                    </div>
                    <CardTitle className="line-clamp-1">{service.name}</CardTitle>
                    <CardDescription>Pet Grooming & Spa</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-2">{service.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 px-2 py-0.5 rounded text-xs font-medium">
                        {service.area}
                      </span>
                    </div>
                    {service.rating && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        {service.rating}
                      </div>
                    )}
                    {service.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {service.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {(service.distance / 1000).toFixed(1)} km away
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleBooking(service)}
                    >
                      Book Service
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleViewOnMap(service)}
                    >
                      Map
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Grooming;
