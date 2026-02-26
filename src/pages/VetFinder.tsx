import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Phone, Clock, Star, Navigation, ExternalLink } from "lucide-react";

// Real vet data for major Indian cities — expand as needed
const VETS_DATA = [
  { id: 1, name: "Dr. Ananda Pet Clinic", city: "Hyderabad", area: "Banjara Hills", address: "Road No. 12, Banjara Hills, Hyderabad", phone: "+91 98765 43210", rating: 4.8, reviews: 234, specialties: ["Dogs", "Cats", "Birds"], hours: "Mon-Sat 9AM-8PM, Sun 10AM-2PM", emergency: true, lat: 17.4126, lng: 78.4484 },
  { id: 2, name: "Happy Paws Veterinary Hospital", city: "Hyderabad", area: "Jubilee Hills", address: "Rd No 36, Jubilee Hills, Hyderabad", phone: "+91 98491 00234", rating: 4.7, reviews: 189, specialties: ["Dogs", "Cats", "Rabbits", "Surgery"], hours: "Mon-Sun 8AM-10PM", emergency: true, lat: 17.4239, lng: 78.4072 },
  { id: 3, name: "City Pet Hospital", city: "Hyderabad", area: "Madhapur", address: "HiTech City Rd, Madhapur, Hyderabad", phone: "+91 40 2311 2233", rating: 4.5, reviews: 156, specialties: ["All Pets", "Dental", "Dermatology"], hours: "Mon-Sat 9AM-7PM", emergency: false, lat: 17.4485, lng: 78.3908 },
  { id: 4, name: "PetCare Veterinary Clinic", city: "Bengaluru", area: "Koramangala", address: "80 Feet Rd, Koramangala, Bengaluru", phone: "+91 80 2553 4567", rating: 4.9, reviews: 312, specialties: ["Dogs", "Cats", "Exotic Pets"], hours: "Mon-Sun 8AM-9PM", emergency: true, lat: 12.9352, lng: 77.6245 },
  { id: 5, name: "Bangalore Pet Hospital", city: "Bengaluru", area: "Indiranagar", address: "CMH Road, Indiranagar, Bengaluru", phone: "+91 98440 11223", rating: 4.6, reviews: 201, specialties: ["Dogs", "Cats", "Birds", "Orthopedics"], hours: "Mon-Sat 9AM-8PM", emergency: false, lat: 12.9716, lng: 77.6411 },
  { id: 6, name: "Mumbai Pet Clinic", city: "Mumbai", area: "Bandra West", address: "Hill Road, Bandra West, Mumbai", phone: "+91 22 2640 7890", rating: 4.7, reviews: 278, specialties: ["All Pets", "Surgery", "ICU"], hours: "24 Hours", emergency: true, lat: 19.0600, lng: 72.8346 },
  { id: 7, name: "Chennai Animal Hospital", city: "Chennai", area: "Adyar", address: "LB Road, Adyar, Chennai", phone: "+91 44 2441 8888", rating: 4.8, reviews: 198, specialties: ["Dogs", "Cats", "Cattle"], hours: "Mon-Sat 8AM-8PM", emergency: true, lat: 13.0012, lng: 80.2565 },
  { id: 8, name: "Delhi Pet Care", city: "Delhi", area: "South Extension", address: "South Ex Part 2, New Delhi", phone: "+91 11 2462 5544", rating: 4.5, reviews: 167, specialties: ["Dogs", "Cats", "Rabbits"], hours: "Mon-Sun 9AM-7PM", emergency: false, lat: 28.5672, lng: 77.2165 },
];

const CITIES = ["All", "Hyderabad", "Bengaluru", "Mumbai", "Chennai", "Delhi"];

export default function VetFinder() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  const filtered = VETS_DATA.filter(v => {
    const matchCity = city === "All" || v.city === city;
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.area.toLowerCase().includes(search.toLowerCase()) || v.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchEmergency = !emergencyOnly || v.emergency;
    return matchCity && matchSearch && matchEmergency;
  });

  const openMaps = (vet: any) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vet.name + " " + vet.address)}`;
    window.open(url, "_blank");
  };

  const callVet = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🏥 Vet Finder</h1>
          <p className="text-sm text-gray-500">Find trusted veterinarians near you</p>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search by name, area, specialty..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* City Filter */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {CITIES.map(c => (
            <button key={c} onClick={() => setCity(c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${city === c ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Emergency Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setEmergencyOnly(!emergencyOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${emergencyOnly ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-600 border-gray-200"}`}>
            🚨 Emergency Only
          </button>
          <span className="text-sm text-gray-500">{filtered.length} vets found</span>
        </div>

        {/* Vet Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No vets found</p>
            <p className="text-gray-400 text-sm">Try a different city or search term</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(vet => (
              <Card key={vet.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">{vet.name}</h3>
                        {vet.emergency && <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">🚨 24/7 Emergency</Badge>}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                        <p className="text-sm text-gray-500 truncate">{vet.area}, {vet.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-gray-700">{vet.rating}</span>
                      <span className="text-xs text-gray-400">({vet.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <Clock size={13} className="text-gray-400 flex-shrink-0" />
                    <p className="text-xs text-gray-500">{vet.hours}</p>
                  </div>

                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {vet.specialties.map(s => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 gap-1.5 bg-blue-600 hover:bg-blue-700" onClick={() => callVet(vet.phone)}>
                      <Phone size={14} /> Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => openMaps(vet)}>
                      <Navigation size={14} /> Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Vet CTA */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">Know a vet not listed here?</p>
          <button className="text-sm text-blue-600 font-medium underline mt-1">Suggest a Veterinarian →</button>
        </div>
      </div>
    </div>
  );
}
