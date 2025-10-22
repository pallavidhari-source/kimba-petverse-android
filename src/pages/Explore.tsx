import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PetCard } from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dog, Cat, Bird, Rabbit, CalendarIcon, Clock, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import dogImage from "@/assets/dog-1.jpg";
import catImage from "@/assets/cat-1.jpg";
import rabbitImage from "@/assets/rabbit-1.jpg";

const Explore = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const timeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "01:00 PM - 03:00 PM",
    "03:00 PM - 05:00 PM",
    "05:00 PM - 07:00 PM",
  ];

  const petTypes = [
    { id: "dog", label: "Dogs", icon: Dog },
    { id: "cat", label: "Cats", icon: Cat },
    { id: "bird", label: "Birds", icon: Bird },
    { id: "rabbit", label: "Rabbits", icon: Rabbit },
  ];

  const mockPets = [
    {
      id: "1",
      name: "Milo",
      breed: "Golden Retriever",
      type: "dog",
      location: "Banjara Hills",
      rating: 4.9,
      reviews_count: 128,
      price_per_hour: 1200,
      image_url: dogImage,
      is_vaccinated: true,
      is_kid_friendly: true,
      temperament: "Calm",
      available: true,
    },
    {
      id: "2",
      name: "Luna",
      breed: "Persian Cat",
      type: "cat",
      location: "Jubilee Hills",
      rating: 4.8,
      reviews_count: 95,
      price_per_hour: 800,
      image_url: catImage,
      is_vaccinated: true,
      is_kid_friendly: true,
      temperament: "Playful",
      available: true,
    },
    {
      id: "3",
      name: "Cotton",
      breed: "Holland Lop",
      type: "rabbit",
      location: "Gachibowli",
      rating: 4.7,
      reviews_count: 64,
      price_per_hour: 600,
      image_url: rabbitImage,
      is_vaccinated: true,
      is_kid_friendly: true,
      temperament: "Gentle",
      available: true,
    },
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [selectedType, user]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in to explore pet experiences");
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const fetchPets = async () => {
    try {
      setLoading(true);
      
      // First, get approved hosts
      const { data: approvedHosts, error: hostsError } = await supabase
        .from("host_applications")
        .select("user_id")
        .eq("status", "approved");

      if (hostsError) throw hostsError;

      const approvedHostIds = approvedHosts?.map(h => h.user_id) || [];

      if (approvedHostIds.length === 0) {
        // No approved hosts, use mock data
        const filteredMock = selectedType
          ? mockPets.filter((p) => p.type === selectedType)
          : mockPets;
        setPets(filteredMock);
        setLoading(false);
        return;
      }

      // Fetch pets from approved hosts only
      let query = supabase
        .from("pets")
        .select("*")
        .eq("available", true)
        .in("host_id", approvedHostIds);

      if (selectedType) {
        query = query.eq("type", selectedType as "dog" | "cat" | "bird" | "rabbit");
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        setPets(data);
      } else {
        // Use mock data if no real data
        const filteredMock = selectedType
          ? mockPets.filter((p) => p.type === selectedType)
          : mockPets;
        setPets(filteredMock);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
      // Use mock data on error
      const filteredMock = selectedType
        ? mockPets.filter((p) => p.type === selectedType)
        : mockPets;
      setPets(filteredMock);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (!selectedTimeSlot) {
      toast.error("Please select a time slot");
      return;
    }
    toast.success("Searching for available pets...");
    fetchPets();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Explore Pets</h1>
          <p className="text-muted-foreground">
            Find your perfect companion for the day
          </p>
        </div>

        {/* Search Filters */}
        <div className="mb-8 space-y-6">
          {/* Pet Type Filters */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              onClick={() => setSelectedType(null)}
            >
              All Pets
            </Button>
            {petTypes.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={selectedType === id ? "default" : "outline"}
                onClick={() => setSelectedType(id)}
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          {/* Date and Time Filters */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Select Time Slot</label>
              <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <SelectValue placeholder="Choose time slot" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSearch} className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Pet Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : pets.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                id={pet.id}
                name={pet.name}
                breed={pet.breed}
                type={pet.type}
                location={pet.location}
                rating={pet.rating}
                reviewsCount={pet.reviews_count}
                pricePerHour={pet.price_per_hour}
                imageUrl={pet.image_url}
                isVaccinated={pet.is_vaccinated}
                isKidFriendly={pet.is_kid_friendly}
                temperament={pet.temperament}
                hostId={pet.host_id}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              No pets found. Try different filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;