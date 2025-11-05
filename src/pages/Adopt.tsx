import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MapPin, Info } from "lucide-react";
import { useState } from "react";
import adoptMax from "@/assets/adopt-max.jpg";
import adoptLuna from "@/assets/adopt-luna.jpg";
import adoptRocky from "@/assets/adopt-rocky.jpg";

const Adopt = () => {
  const [selectedPet, setSelectedPet] = useState<any>(null);
  
  const adoptionPets = [
    {
      id: 1,
      name: "ChatGT Pom",
      breed: "Pomeranian",
      age: "Adult",
      gender: "male",
      isNeutered: true,
      location: "Banjara Hills, Hyderabad",
      image: adoptMax,
      description: "Sweet Pomeranian looking for a loving home"
    },
    {
      id: 2,
      name: "Onix",
      breed: "American Shorthair",
      age: "Young",
      gender: "male",
      isSpayed: true,
      location: "Jubilee Hills, Hyderabad",
      image: adoptLuna,
      description: "Affectionate young cat, great companion"
    },
    {
      id: 3,
      name: "Alpine Pup - Montage",
      breed: "Dachshund Terrier Mix",
      age: "Puppy",
      gender: "male",
      isNeutered: false,
      location: "Gachibowli, Hyderabad",
      image: adoptRocky,
      description: "Energetic puppy ready for adventures"
    },
    {
      id: 4,
      name: "Bella",
      breed: "Labrador Retriever Mix",
      age: "2 years",
      gender: "female",
      isSpayed: true,
      location: "Madhapur, Hyderabad",
      image: adoptMax,
      description: "Friendly, well-trained, and loves kids"
    },
    {
      id: 5,
      name: "Whiskers",
      breed: "Domestic Shorthair",
      age: "3 years",
      gender: "female",
      isSpayed: true,
      location: "Hitech City, Hyderabad",
      image: adoptLuna,
      description: "Calm indoor cat, perfect for apartment living"
    },
    {
      id: 6,
      name: "Max",
      breed: "German Shepherd Mix",
      age: "4 years",
      gender: "male",
      isNeutered: true,
      location: "Kondapur, Hyderabad",
      image: adoptRocky,
      description: "Loyal companion, great with families"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl mb-4">
              Adopt a Pet
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Give a loving home to pets in need. All pets are vaccinated and vet-checked.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {adoptionPets.map((pet) => (
              <Card key={pet.id}>
                <CardHeader>
                  <img 
                    src={pet.image} 
                    alt={pet.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle>{pet.name}</CardTitle>
                  <CardDescription>{pet.breed} • {pet.age}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    {pet.location}
                  </div>
                  <p className="text-sm">{pet.description}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    Adopt
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedPet(pet)}>
                        <Info className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pet Details</DialogTitle>
                        <DialogDescription>
                          Complete information about {pet.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                            <p className="text-base font-semibold">{pet.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Gender</p>
                            <p className="text-base font-semibold capitalize">{pet.gender}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Age</p>
                            <p className="text-base font-semibold">{pet.age}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Breed</p>
                            <p className="text-base font-semibold">{pet.breed}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {pet.gender === "male" ? "Neutered" : "Spayed"}
                            </p>
                            <p className="text-base font-semibold">
                              {pet.gender === "male" 
                                ? (pet.isNeutered ? "Yes" : "No")
                                : (pet.isSpayed ? "Yes" : "No")
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Location</p>
                            <p className="text-base font-semibold">{pet.location}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                          <p className="text-sm">{pet.description}</p>
                        </div>
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

export default Adopt;
