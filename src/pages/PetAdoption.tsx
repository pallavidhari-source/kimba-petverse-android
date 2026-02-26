import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Search, MapPin, Phone, CheckCircle } from "lucide-react";

const SAMPLE_ADOPTIONS = [
  { id: "a1", pet_name: "Buddy", species: "Dog", breed: "Indie Mix", age: "2 years", gender: "Male", color: "Brown & White", city: "Hyderabad", area: "Banjara Hills", description: "Friendly and vaccinated street dog rescued from road accident. Loves cuddles and kids. House-trained.", vaccinated: true, neutered: true, contact_name: "Animal Aid Hyderabad", contact_phone: "+91 98490 12345", image_emoji: "🐕", urgent: false },
  { id: "a2", pet_name: "Mittens", species: "Cat", breed: "Domestic Shorthair", age: "1 year", gender: "Female", color: "Calico", city: "Bengaluru", area: "Koramangala", description: "Sweet calico cat found as a stray. Gets along well with other cats. Litter trained. Looking for a loving indoor home.", vaccinated: true, neutered: true, contact_name: "Cats of Bengaluru", contact_phone: "+91 90000 11223", image_emoji: "🐈", urgent: false },
  { id: "a3", pet_name: "Rocky", species: "Dog", breed: "German Shepherd Mix", age: "4 months", gender: "Male", color: "Black & Tan", city: "Mumbai", area: "Andheri", description: "Puppy found abandoned. Very playful and learning fast. First vaccinations done. Needs a patient forever home.", vaccinated: true, neutered: false, contact_name: "Mumbai Paws Rescue", contact_phone: "+91 91234 56789", image_emoji: "🐕", urgent: true },
  { id: "a4", pet_name: "Coco", species: "Dog", breed: "Beagle Mix", age: "3 years", gender: "Female", color: "Tricolor", city: "Chennai", area: "Adyar", description: "Gentle beagle mix surrendered by owner moving abroad. Well-behaved, knows commands, loves walks.", vaccinated: true, neutered: true, contact_name: "Chennai Animal Care", contact_phone: "+91 97800 44556", image_emoji: "🐕", urgent: false },
  { id: "a5", pet_name: "Whiskers", species: "Cat", breed: "Persian Mix", age: "5 years", gender: "Male", color: "White", city: "Hyderabad", area: "Jubilee Hills", description: "Senior Persian mix in perfect health. Very calm and affectionate. Previous owner passed away. Urgent home needed.", vaccinated: true, neutered: true, contact_name: "Rainbow Rescue", contact_phone: "+91 98765 43200", image_emoji: "🐈", urgent: true },
  { id: "a6", pet_name: "Tweety", species: "Bird", breed: "Budgerigar", age: "1 year", gender: "Unknown", color: "Green & Yellow", city: "Delhi", area: "Lajpat Nagar", description: "A pair of budgerigars looking for a home together. Friendly birds that chirp beautifully.", vaccinated: false, neutered: false, contact_name: "Delhi Bird Rescue", contact_phone: "+91 96000 22334", image_emoji: "🐦", urgent: false },
];

const SPECIES = ["All", "Dog", "Cat", "Bird", "Rabbit", "Other"];
const CITIES = ["All", "Hyderabad", "Bengaluru", "Mumbai", "Chennai", "Delhi"];

export default function PetAdoption() {
  const { toast } = useToast();
  const [listings, setListings] = useState<any[]>(SAMPLE_ADOPTIONS);
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("All");
  const [city, setCity] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [form, setForm] = useState({
    pet_name: "", species: "Dog", breed: "", age: "", gender: "Male", color: "",
    city: "Hyderabad", area: "", description: "", contact_name: "", contact_phone: "",
    vaccinated: false, neutered: false,
  });

  const filtered = listings.filter(l => {
    const matchSpecies = species === "All" || l.species === species;
    const matchCity = city === "All" || l.city === city;
    const matchSearch = !search || l.pet_name.toLowerCase().includes(search.toLowerCase()) || l.breed?.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase());
    return matchSpecies && matchCity && matchSearch;
  });

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast({ title: "Removed from saved" }); }
      else { next.add(id); toast({ title: "💖 Saved to your wishlist!" }); }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🐾 Pet Adoption</h1>
            <p className="text-sm text-gray-500">Give a pet a forever home</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-rose-500 hover:bg-rose-600 gap-2"><Plus size={16} /> List Pet</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>List a Pet for Adoption</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Pet Name *</Label>
                    <Input placeholder="Name" value={form.pet_name} onChange={e => setForm({ ...form, pet_name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Species</Label>
                    <Select value={form.species} onValueChange={v => setForm({ ...form, species: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{["Dog", "Cat", "Bird", "Rabbit", "Other"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Breed</Label>
                    <Input placeholder="e.g. Lab Mix, Indie" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} />
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input placeholder="e.g. 2 years, 4 months" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Gender</Label>
                    <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{["Male", "Female", "Unknown"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>City</Label>
                    <Select value={form.city} onValueChange={v => setForm({ ...form, city: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CITIES.filter(c => c !== "All").map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea placeholder="Tell adopters about this pet's personality, history, needs..." rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.vaccinated} onChange={e => setForm({ ...form, vaccinated: e.target.checked })} className="rounded" />
                    <span className="text-sm">Vaccinated</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.neutered} onChange={e => setForm({ ...form, neutered: e.target.checked })} className="rounded" />
                    <span className="text-sm">Neutered/Spayed</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Your Name</Label>
                    <Input placeholder="Contact name" value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input placeholder="+91 ..." value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} />
                  </div>
                </div>
                <Button className="w-full bg-rose-500 hover:bg-rose-600" onClick={() => { toast({ title: "🐾 Listing posted!" }); setDialogOpen(false); }}>
                  Post Adoption Listing
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-4 mb-4 text-white">
          <div className="flex justify-around text-center">
            <div><p className="text-2xl font-bold">{listings.length}</p><p className="text-xs opacity-80">Pets waiting</p></div>
            <div><p className="text-2xl font-bold">{listings.filter(l => l.urgent).length}</p><p className="text-xs opacity-80">Urgent</p></div>
            <div><p className="text-2xl font-bold">{listings.filter(l => l.vaccinated).length}</p><p className="text-xs opacity-80">Vaccinated</p></div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search pets..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {SPECIES.map(s => (
            <button key={s} onClick={() => setSpecies(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${species === s ? "bg-rose-500 text-white border-rose-500" : "bg-white text-gray-600 border-gray-200"}`}>
              {s === "Dog" ? "🐕" : s === "Cat" ? "🐈" : s === "Bird" ? "🐦" : s === "Rabbit" ? "🐰" : ""} {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {CITIES.map(c => (
            <button key={c} onClick={() => setCity(c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${city === c ? "bg-gray-800 text-white" : "bg-white text-gray-600 border-gray-200"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Listings */}
        {filtered.length === 0 ? (
          <div className="text-center py-12"><Heart size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-400">No pets found</p></div>
        ) : (
          <div className="space-y-3">
            {filtered.map(pet => (
              <Card key={pet.id} className={`hover:shadow-md transition-shadow ${pet.urgent ? "border-red-200" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center text-3xl flex-shrink-0">
                      {pet.image_emoji || "🐾"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-gray-900">{pet.pet_name}</h3>
                            {pet.urgent && <Badge className="bg-red-100 text-red-700 text-xs border-red-200">⚡ Urgent</Badge>}
                          </div>
                          <p className="text-sm text-gray-500">{pet.breed} • {pet.age} • {pet.gender}</p>
                        </div>
                        <button onClick={() => toggleSave(pet.id)} className="ml-2 flex-shrink-0">
                          <Heart size={20} className={savedIds.has(pet.id) ? "text-rose-500 fill-rose-500" : "text-gray-300"} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={13} className="text-gray-400" />
                        <p className="text-xs text-gray-500">{pet.area}, {pet.city}</p>
                      </div>
                      <div className="flex gap-2 mt-1.5">
                        {pet.vaccinated && <span className="text-xs flex items-center gap-1 text-green-600"><CheckCircle size={11} />Vaccinated</span>}
                        {pet.neutered && <span className="text-xs flex items-center gap-1 text-blue-600"><CheckCircle size={11} />Neutered</span>}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{pet.description}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1 bg-rose-500 hover:bg-rose-600 gap-1.5" onClick={() => window.open(`tel:${pet.contact_phone}`)}>
                          <Phone size={13} /> Adopt
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => setSelectedPet(pet)}>
                          More Info
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pet Detail Modal */}
      {selectedPet && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4" onClick={() => setSelectedPet(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">{selectedPet.image_emoji}</div>
              <h2 className="text-xl font-bold">{selectedPet.pet_name}</h2>
              <p className="text-gray-500 text-sm">{selectedPet.breed} • {selectedPet.age} • {selectedPet.gender}</p>
            </div>
            <p className="text-gray-600 text-sm mb-4">{selectedPet.description}</p>
            <p className="text-sm font-medium text-gray-700 mb-1">Contact: {selectedPet.contact_name}</p>
            <Button className="w-full bg-rose-500 hover:bg-rose-600" onClick={() => window.open(`tel:${selectedPet.contact_phone}`)}>
              <Phone size={16} className="mr-2" /> Call {selectedPet.contact_phone}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
