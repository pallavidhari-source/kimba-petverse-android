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
import { MapPin, Phone, Star, Heart, Plus, Search, Flame } from "lucide-react";

const SERVICES_INFO: Record<string, string> = {
  "burial": "Individual Burial",
  "cremation": "Cremation",
  "memorial-garden": "Memorial Garden",
  "online-memorial": "Online Memorial",
};

const SAMPLE_MEMORIALS = [
  { id: "m1", pet_name: "Bruno", species: "Dog", breed: "Golden Retriever", date_of_birth: "2015-03-10", date_of_passing: "2024-11-20", tribute: "Our golden sunshine for 9 wonderful years. You brought joy to every room. Forever in our hearts, buddy. 🐾", candles_count: 34, is_public: true },
  { id: "m2", pet_name: "Luna", species: "Cat", breed: "Persian", date_of_birth: "2013-07-04", date_of_passing: "2024-09-15", tribute: "Our gentle princess who purred us through every hard day. Rest in soft sunshine, Luna. ❤️", candles_count: 28, is_public: true },
  { id: "m3", pet_name: "Biscuit", species: "Dog", breed: "Beagle", date_of_birth: "2018-01-22", date_of_passing: "2025-01-08", tribute: "You sniffed out every adventure with us. The house feels quiet without your howls. Miss you every single day.", candles_count: 19, is_public: true },
];

export default function PetCemeteries() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"cemeteries" | "memorials">("cemeteries");
  const [cemeteries, setCemeteries] = useState<any[]>([]);
  const [memorials, setMemorials] = useState<any[]>(SAMPLE_MEMORIALS);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [litCandles, setLitCandles] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    pet_name: "", species: "Dog", breed: "", date_of_birth: "", date_of_passing: "", tribute: "", is_public: true,
  });

  useEffect(() => {
    fetchCemeteries();
    fetchMemorials();
  }, []);

  const fetchCemeteries = async () => {
    const { data } = await supabase.from("pet_cemeteries").select("*").order("name");
    if (data && data.length > 0) setCemeteries(data);
    else {
      // Fallback sample data
      setCemeteries([
        { id: "c1", name: "Rainbow Bridge Pet Memorial", city: "Hyderabad", state: "Telangana", address: "12 Garden Road, Jubilee Hills", services: ["burial", "cremation", "memorial-garden", "online-memorial"], description: "A peaceful garden sanctuary for beloved pets.", rating: 4.8, phone: "+91 98765 00001", is_verified: true },
        { id: "c2", name: "Pawsome Rest", city: "Hyderabad", state: "Telangana", address: "45 Green Valley, Banjara Hills", services: ["cremation", "memorial-garden"], description: "Dignified cremation and memorial services.", rating: 4.5, phone: "+91 98765 00002", is_verified: true },
        { id: "c3", name: "Furever Home Cemetery", city: "Bengaluru", state: "Karnataka", address: "78 Serene Lane, Koramangala", services: ["burial", "cremation", "online-memorial"], description: "Beautiful peaceful grounds with personalized memorial stones.", rating: 4.7, phone: "+91 98765 00003", is_verified: true },
        { id: "c4", name: "Pets Paradise Memorial", city: "Mumbai", state: "Maharashtra", address: "23 Harmony Road, Andheri West", services: ["burial", "cremation", "memorial-garden"], description: "Premium pet memorial services.", rating: 4.6, phone: "+91 98765 00004", is_verified: false },
        { id: "c5", name: "Eternal Paws", city: "Chennai", state: "Tamil Nadu", address: "56 Peaceful Colony, Adyar", services: ["cremation", "online-memorial"], description: "Compassionate cremation and digital memorial services.", rating: 4.4, phone: "+91 98765 00005", is_verified: true },
      ]);
    }
  };

  const fetchMemorials = async () => {
    const { data } = await supabase.from("pet_memorials").select("*").eq("is_public", true).order("created_at", { ascending: false }).limit(20);
    if (data && data.length > 0) setMemorials([...data, ...SAMPLE_MEMORIALS]);
  };

  const handleCreateMemorial = async () => {
    if (!form.pet_name || !form.date_of_passing) {
      toast({ title: "Please fill required fields", variant: "destructive" }); return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast({ title: "Please sign in", variant: "destructive" }); return; }

    const { error } = await supabase.from("pet_memorials").insert({ ...form, user_id: user.id, date_of_birth: form.date_of_birth || null });
    if (error) { toast({ title: "Error creating memorial", variant: "destructive" }); }
    else {
      toast({ title: "🕯️ Memorial created. May they rest in peace." });
      setDialogOpen(false);
      setForm({ pet_name: "", species: "Dog", breed: "", date_of_birth: "", date_of_passing: "", tribute: "", is_public: true });
      fetchMemorials();
    }
  };

  const lightCandle = (id: string) => {
    setLitCandles(prev => {
      const next = new Set(prev);
      if (!next.has(id)) {
        next.add(id);
        setMemorials(m => m.map(mem => mem.id === id ? { ...mem, candles_count: mem.candles_count + 1 } : mem));
        toast({ title: "🕯️ You lit a candle in their memory" });
      }
      return next;
    });
  };

  const filteredCemeteries = cemeteries.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase())
  );

  const yearsLived = (dob: string, dop: string) => {
    if (!dob || !dop) return null;
    const years = Math.floor((new Date(dop).getTime() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000));
    return years > 0 ? `${years} year${years > 1 ? "s" : ""}` : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🕊️ Pet Cemeteries & Memorials</h1>
          <p className="text-sm text-gray-500 mt-1">Honoring our beloved companions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab("cemeteries")} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "cemeteries" ? "bg-gray-800 text-white" : "bg-white text-gray-600 border"}`}>
            🏛️ Cemeteries
          </button>
          <button onClick={() => setTab("memorials")} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "memorials" ? "bg-gray-800 text-white" : "bg-white text-gray-600 border"}`}>
            🕯️ Memorials
          </button>
        </div>

        {tab === "cemeteries" ? (
          <>
            <div className="relative mb-4">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search by name or city..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="space-y-3">
              {filteredCemeteries.map(cem => (
                <Card key={cem.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{cem.name}</h3>
                          {cem.is_verified && <Badge className="text-xs bg-green-100 text-green-700 border-green-200">✓ Verified</Badge>}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={13} className="text-gray-400" />
                          <p className="text-sm text-gray-500">{cem.city}, {cem.state}</p>
                        </div>
                      </div>
                      {cem.rating && (
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-semibold">{cem.rating}</span>
                        </div>
                      )}
                    </div>
                    {cem.description && <p className="text-sm text-gray-600 mb-3">{cem.description}</p>}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {cem.services?.map((s: string) => (
                        <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{SERVICES_INFO[s] || s}</span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {cem.phone && (
                        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.open(`tel:${cem.phone}`)}>
                          <Phone size={13} /> Call
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(cem.name + " " + cem.city)}`, "_blank")}>
                        <MapPin size={13} /> Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Create Memorial Button */}
            <div className="flex justify-end mb-4">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 border-gray-300"><Plus size={16} /> Create Memorial</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>🕊️ Create a Memorial</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div>
                      <Label>Pet's Name *</Label>
                      <Input placeholder="Name" value={form.pet_name} onChange={e => setForm({ ...form, pet_name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Species</Label>
                        <Select value={form.species} onValueChange={v => setForm({ ...form, species: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["Dog", "Cat", "Bird", "Rabbit", "Fish", "Other"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Breed</Label>
                        <Input placeholder="e.g. Labrador" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Date of Birth</Label>
                        <Input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} />
                      </div>
                      <div>
                        <Label>Date of Passing *</Label>
                        <Input type="date" value={form.date_of_passing} onChange={e => setForm({ ...form, date_of_passing: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <Label>Tribute Message</Label>
                      <Textarea placeholder="Share your memories and love for your companion..." rows={4} value={form.tribute} onChange={e => setForm({ ...form, tribute: e.target.value })} />
                    </div>
                    <Button onClick={handleCreateMemorial} className="w-full bg-gray-800 hover:bg-gray-900">Create Memorial</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Memorials */}
            <div className="space-y-3">
              {memorials.map(mem => {
                const years = yearsLived(mem.date_of_birth, mem.date_of_passing);
                const candleLit = litCandles.has(mem.id);
                return (
                  <Card key={mem.id} className="border-gray-200">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl">
                          {mem.species === "Dog" ? "🐕" : mem.species === "Cat" ? "🐈" : mem.species === "Bird" ? "🐦" : "🐾"}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{mem.pet_name}</h3>
                          <p className="text-sm text-gray-500">
                            {mem.breed && `${mem.breed} • `}
                            {years && `${years} of love • `}
                            {new Date(mem.date_of_passing).getFullYear()}
                          </p>
                        </div>
                      </div>
                      {mem.tribute && (
                        <p className="text-sm text-gray-600 italic mb-4 leading-relaxed">"{mem.tribute}"</p>
                      )}
                      <div className="flex items-center justify-between">
                        <button onClick={() => lightCandle(mem.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${candleLit ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-white text-gray-500 border-gray-200 hover:border-amber-300"}`}>
                          <Flame size={14} fill={candleLit ? "currentColor" : "none"} />
                          {candleLit ? "Candle Lit" : "Light a Candle"}
                          <span className="text-xs">({mem.candles_count})</span>
                        </button>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Heart size={12} />
                          <span>Forever remembered</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
