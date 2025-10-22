import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PetCard } from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dog, Cat, Bird, Rabbit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import dogImage from "@/assets/dog-1.jpg";
import catImage from "@/assets/cat-1.jpg";
import rabbitImage from "@/assets/rabbit-1.jpg";

const Explore = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchPets();
  }, [selectedType]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("pets")
        .select("*")
        .eq("available", true);

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

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
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