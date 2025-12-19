import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Star, Phone, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VetClinic {
  id: string;
  name: string;
  address: string;
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
const SEARCH_RADIUS = 15000; // 15km radius

const Vets = () => {
  const navigate = useNavigate();
  const [veterinarians, setVeterinarians] = useState<VetClinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pet clinics from TomTom API
  useEffect(() => {
    const fetchPetClinics = async () => {
      try {
        setLoading(true);
        const query = "veterinary clinic";
        const url = `https://api.tomtom.com/search/2/categorySearch/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&lat=${HYDERABAD_LAT}&lon=${HYDERABAD_LON}&radius=${SEARCH_RADIUS}&limit=20`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch pet clinics");
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const clinics: VetClinic[] = data.results.map((result: any) => ({
            id: result.id,
            name: result.poi?.name || "Pet Clinic",
            address: result.address?.freeformAddress || result.address?.streetName || "Hyderabad",
            phone: result.poi?.phone || null,
            rating: result.score ? Math.min(5, (result.score / 2)).toFixed(1) : null,
            distance: result.dist ? Math.round(result.dist) : 0,
            position: result.position
          }));
          setVeterinarians(clinics);
        } else {
          setError("No pet clinics found in Hyderabad area");
        }
      } catch (err) {
        console.error("Error fetching pet clinics:", err);
        setError("Failed to load pet clinics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetClinics();
  }, []);

  // Check for pending booking after auth
  useEffect(() => {
    const checkPendingBooking = async () => {
      const pendingBooking = sessionStorage.getItem("pendingVetBooking");
      if (pendingBooking) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const vet = JSON.parse(pendingBooking);
          sessionStorage.removeItem("pendingVetBooking");
          navigate("/book-vet-appointment", { state: { vet } });
        }
      }
    };
    checkPendingBooking();
  }, [navigate]);

  const handleBookAppointment = async (vet: VetClinic) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      sessionStorage.setItem("pendingVetBooking", JSON.stringify({
        id: vet.id,
        name: vet.name,
        specialization: "General Veterinary Care",
        clinic: vet.name,
        location: vet.address,
        rating: vet.rating || 4.5,
        phone: vet.phone || "Contact clinic",
        hours: "9 AM - 8 PM",
        image: "/placeholder.svg"
      }));
      toast.error("Please sign in to book an appointment");
      navigate("/auth", { state: { returnTo: "/vets" } });
      return;
    }

    navigate("/book-vet-appointment", { state: { vet: {
      id: vet.id,
      name: vet.name,
      specialization: "General Veterinary Care",
      clinic: vet.name,
      location: vet.address,
      rating: vet.rating || 4.5,
      phone: vet.phone || "Contact clinic",
      hours: "9 AM - 8 PM",
      image: "/placeholder.svg"
    }}});
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl mb-4">
              Veterinarians in Hyderabad
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Connect with certified veterinarians for your pet's health needs. Real-time data from clinics near you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading pet clinics in Hyderabad...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {veterinarians.map((vet) => (
                <Card key={vet.id}>
                  <CardHeader>
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-6xl">🏥</span>
                    </div>
                    <CardTitle className="line-clamp-1">{vet.name}</CardTitle>
                    <CardDescription>General Veterinary Care</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-2">{vet.address}</span>
                    </div>
                    {vet.rating && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        {vet.rating}
                      </div>
                    )}
                    {vet.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {vet.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {(vet.distance / 1000).toFixed(1)} km away
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleBookAppointment(vet)}
                    >
                      Book Appointment
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

export default Vets;
