import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Phone, Clock, Loader2, Filter, Coffee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PetCafe {
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

const Cafes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [petCafes, setPetCafes] = useState<PetCafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>("all");

  // Reset filter when navigating to this page
  useEffect(() => {
    setSelectedArea("all");
  }, [location.key]);

  // Get unique areas from data
  const areas = useMemo(() => {
    const uniqueAreas = [...new Set(petCafes.map(v => v.area).filter(Boolean))];
    return uniqueAreas.sort();
  }, [petCafes]);

  // Filter cafes by area
  const filteredCafes = useMemo(() => {
    if (selectedArea === "all") return petCafes;
    return petCafes.filter(v => v.area === selectedArea);
  }, [petCafes, selectedArea]);

  // Fetch cafes from TomTom API
  useEffect(() => {
    const fetchPetCafes = async () => {
      try {
        setLoading(true);
        // Using "cafe" as TomTom doesn't have specific "pet friendly cafe" category data for Hyderabad
        const query = "cafe";
        const url = `https://api.tomtom.com/search/2/categorySearch/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&lat=${HYDERABAD_LAT}&lon=${HYDERABAD_LON}&radius=${SEARCH_RADIUS}&limit=50`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch cafes");
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const cafes: PetCafe[] = data.results.map((result: any) => ({
            id: result.id,
            name: result.poi?.name || "Cafe",
            address: result.address?.freeformAddress || result.address?.streetName || "Hyderabad",
            area: result.address?.municipalitySubdivision || result.address?.municipalitySecondarySubdivision || "Hyderabad",
            phone: result.poi?.phone || null,
            rating: result.score ? Math.min(5, (result.score / 2)).toFixed(1) : null,
            distance: result.dist ? Math.round(result.dist) : 0,
            position: result.position
          }));
          setPetCafes(cafes);
        } else {
          setError("No cafes found in Hyderabad area");
        }
      } catch (err) {
        console.error("Error fetching cafes:", err);
        setError("Failed to load cafes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetCafes();
  }, []);

  // Check for pending reservation after auth
  useEffect(() => {
    const checkPendingReservation = async () => {
      const pendingReservation = sessionStorage.getItem("pendingCafeReservation");
      if (pendingReservation) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const cafe = JSON.parse(pendingReservation);
          sessionStorage.removeItem("pendingCafeReservation");
          toast.success(`Reserving table at ${cafe.name}...`);
        }
      }
    };
    checkPendingReservation();
  }, [navigate]);

  const handleReservation = async (cafe: PetCafe) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      sessionStorage.setItem("pendingCafeReservation", JSON.stringify(cafe));
      toast.error("Please sign in to reserve a table");
      navigate("/auth", { state: { returnTo: "/cafes" } });
      return;
    }

    toast.success(`Reserving table at ${cafe.name}...`);
  };

  const handleViewOnMap = (cafe: PetCafe) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${cafe.position.lat},${cafe.position.lon}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl mb-4">
              Pet-Friendly Cafes in Hyderabad
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Enjoy quality time with your pet at these pet-friendly cafes. Real-time data from cafes near you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filter Section */}
          {!loading && !error && petCafes.length > 0 && (
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
                Showing {filteredCafes.length} of {petCafes.length} cafes
              </span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading pet-friendly cafes in Hyderabad...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCafes.map((cafe) => (
                <Card key={cafe.id}>
                  <CardHeader>
                    <div className="w-full h-48 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-lg mb-4 flex items-center justify-center">
                      <Coffee className="h-16 w-16 text-amber-600" />
                    </div>
                    <CardTitle className="line-clamp-1">{cafe.name}</CardTitle>
                    <CardDescription>Pet-Friendly Cafe</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-2">{cafe.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded text-xs font-medium">
                        {cafe.area}
                      </span>
                    </div>
                    {cafe.rating && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        {cafe.rating}
                      </div>
                    )}
                    {cafe.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {cafe.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {(cafe.distance / 1000).toFixed(1)} km away
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleReservation(cafe)}
                    >
                      Reserve Table
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleViewOnMap(cafe)}
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

export default Cafes;
