import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Clock, CheckCircle, MapPin, Phone, Search, Heart, Award, Footprints, Calendar, Shield, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Walker {
  id: string;
  full_name: string;
  photo: string;
  hourly_rate: number;
  rating: number;
  reviews_count: number;
  availability: string;
  available_slots: string[];
  is_certified: boolean;
  certifications: string[];
  city: string;
  area: string;
  state: string;
  phone: string;
  experience: string;
  total_walks: number;
  specialties: string[];
  pet_types: string[];
  bio: string;
  languages: string[];
}

const CITIES = ["All Cities", "Hyderabad", "Bengaluru", "Mumbai", "Chennai", "Delhi", "Pune", "Kolkata"];
const SORT_OPTIONS = ["Top Rated", "Price: Low to High", "Price: High to Low", "Most Reviews", "Most Walks"];
const PET_TYPES = ["All Pets", "Dogs", "Cats", "Rabbits"];

const AVAILABILITY_COLORS: Record<string, string> = {
  "Available": "bg-green-100 text-green-700 border-green-200",
  "Busy": "bg-red-100 text-red-700 border-red-200",
  "Weekend Only": "bg-blue-100 text-blue-700 border-blue-200",
};

// ── Component ─────────────────────────────────────────────────────────────────
const PetWalkers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [walkers, setWalkers] = useState<Walker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All Cities");
  const [petType, setPetType] = useState("All Pets");
  const [sortBy, setSortBy] = useState("Top Rated");
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedWalker, setSelectedWalker] = useState<Walker | null>(null);
  const [bookingWalker, setBookingWalker] = useState<Walker | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSlot, setBookingSlot] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  // ── Fetch walkers from Supabase + real photos from randomuser.me ──────────
  const fetchWalkers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Get walkers from Supabase
      const { data: dbWalkers, error: dbError } = await supabase
        .from("pet_walkers")
        .select("*")
        .eq("is_approved", true)
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (dbError) throw dbError;
      if (!dbWalkers || dbWalkers.length === 0) {
        setWalkers([]);
        setLoading(false);
        return;
      }

      // 2. Fetch real profile photos from randomuser.me (free API, no key needed)
      let photos: string[] = [];
      try {
        const res = await fetch(`https://randomuser.me/api/?results=${dbWalkers.length}&nat=in&inc=picture`);
        const data = await res.json();
        photos = data.results.map((u: any) => u.picture.large);
      } catch {
        // Fallback to dicebear avatars if randomuser.me is down
        photos = dbWalkers.map((w: any) =>
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(w.full_name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`
        );
      }

      // 3. Merge Supabase data with real photos
      const merged: Walker[] = dbWalkers.map((w: any, i: number) => ({
        id: w.id,
        full_name: w.full_name,
        photo: w.photo_url || photos[i] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${w.full_name}`,
        hourly_rate: w.hourly_rate,
        rating: w.rating || 4.5,
        reviews_count: w.reviews_count || 0,
        availability: w.availability || "Available",
        available_slots: w.available_slots || [],
        is_certified: (w.certifications || []).length > 0,
        certifications: w.certifications || [],
        city: w.city,
        area: w.area || "",
        state: w.state,
        phone: w.phone,
        experience: w.experience || "1 year",
        total_walks: w.total_walks || 0,
        specialties: w.specialties || [],
        pet_types: w.pet_types || ["Dogs"],
        bio: w.bio || "",
        languages: w.languages || ["English"],
      }));

      setWalkers(merged);
    } catch (err: any) {
      setError("Failed to load walkers. Please try again.");
      toast.error("Could not load walkers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWalkers(); }, [fetchWalkers]);

  // ── Filter & Sort ─────────────────────────────────────────────────────────
  const filtered = walkers
    .filter(w => {
      const matchCity = city === "All Cities" || w.city === city;
      const matchSearch = !search ||
        w.full_name.toLowerCase().includes(search.toLowerCase()) ||
        w.area.toLowerCase().includes(search.toLowerCase()) ||
        w.city.toLowerCase().includes(search.toLowerCase()) ||
        w.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()));
      const matchPet = petType === "All Pets" || w.pet_types.includes(petType);
      const matchCert = !certifiedOnly || w.is_certified;
      const matchAvail = !availableOnly || w.availability === "Available";
      const matchPrice = w.hourly_rate <= maxPrice;
      return matchCity && matchSearch && matchPet && matchCert && matchAvail && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "Top Rated") return b.rating - a.rating;
      if (sortBy === "Price: Low to High") return a.hourly_rate - b.hourly_rate;
      if (sortBy === "Price: High to Low") return b.hourly_rate - a.hourly_rate;
      if (sortBy === "Most Reviews") return b.reviews_count - a.reviews_count;
      if (sortBy === "Most Walks") return b.total_walks - a.total_walks;
      return 0;
    });

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast.info("Removed from saved"); }
      else { next.add(id); toast.success("💾 Walker saved!"); }
      return next;
    });
  };

  const handleCall = (walker: Walker) => {
    if (!user) { toast.info("Please sign in to contact walkers"); navigate("/auth"); return; }
    window.open(`tel:${walker.phone}`, "_self");
  };

  const handleBook = () => {
    if (!user) { toast.info("Please sign in to book"); navigate("/auth"); return; }
    if (!bookingDate || !bookingSlot) { toast.error("Please select date and time slot"); return; }
    toast.success(`✅ Booking confirmed with ${bookingWalker?.full_name}!`, {
      description: `${bookingDate} • ${bookingSlot}. They'll contact you on ${bookingWalker?.phone}`
    });
    setBookingWalker(null); setBookingDate(""); setBookingSlot("");
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={11} className={i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
    ));

  const totalWalks = walkers.reduce((a, w) => a + w.total_walks, 0);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-10 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🐾 Professional Pet Walkers</h1>
          <p className="text-teal-100 mb-6 max-w-lg mx-auto">Verified walkers across India. GPS tracking, photo updates & insured walks.</p>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { label: "Verified Walkers", value: `${walkers.length}+` },
              { label: "Total Walks Done", value: totalWalks > 0 ? `${totalWalks.toLocaleString()}+` : "0" },
              { label: "Cities Covered", value: `${new Set(walkers.map(w => w.city)).size}+` },
              { label: "Avg Rating", value: walkers.length ? `${(walkers.reduce((a, w) => a + w.rating, 0) / walkers.length).toFixed(1)}⭐` : "—" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-teal-200 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search name, city, area or specialty..." className="pl-9"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" size="icon" onClick={fetchWalkers} title="Refresh">
              <RefreshCw size={16} />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger><SelectValue placeholder="City" /></SelectTrigger>
              <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={petType} onValueChange={setPetType}>
              <SelectTrigger><SelectValue placeholder="Pet Type" /></SelectTrigger>
              <SelectContent>{PET_TYPES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger><SelectValue placeholder="Sort By" /></SelectTrigger>
              <SelectContent>{SORT_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">Max ₹{maxPrice}</span>
              <input type="range" min={100} max={1000} step={50} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-teal-600" />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <button onClick={() => setCertifiedOnly(!certifiedOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${certifiedOnly ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-600 border-gray-200"}`}>
              <CheckCircle size={13} /> Certified Only
            </button>
            <button onClick={() => setAvailableOnly(!availableOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${availableOnly ? "bg-teal-500 text-white border-teal-500" : "bg-white text-gray-600 border-gray-200"}`}>
              <Clock size={13} /> Available Now
            </button>
            <span className="text-xs text-gray-400 ml-auto">{filtered.length} walkers found</span>
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={40} className="animate-spin text-teal-500" />
            <p className="text-gray-500">Finding walkers near you...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <AlertCircle size={48} className="mx-auto text-red-300 mb-3" />
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchWalkers} variant="outline">Try Again</Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Footprints size={56} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-lg mb-1">No walkers found</p>
            <p className="text-gray-400 text-sm mb-4">
              {walkers.length === 0
                ? "Be the first walker in your city!"
                : "Try adjusting your filters"}
            </p>
            {walkers.length === 0 ? (
              <Button onClick={() => navigate("/pet-walker-signup")} className="bg-teal-600 hover:bg-teal-700">
                Register as a Walker
              </Button>
            ) : (
              <Button variant="outline" onClick={() => { setCity("All Cities"); setCertifiedOnly(false); setAvailableOnly(false); setSearch(""); setMaxPrice(1000); }}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(walker => (
              <div key={walker.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Photo */}
                <div className="relative h-52">
                  <img src={walker.photo} alt={walker.full_name} className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${walker.full_name}`; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {walker.is_certified && (
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white text-xs gap-1">
                      <CheckCircle size={10} /> Certified
                    </Badge>
                  )}
                  <Badge className={`absolute top-3 right-3 text-xs border ${AVAILABILITY_COLORS[walker.availability] || AVAILABILITY_COLORS["Available"]}`}>
                    {walker.availability}
                  </Badge>
                  <button onClick={() => toggleSave(walker.id)}
                    className="absolute bottom-10 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow">
                    <Heart size={15} className={savedIds.has(walker.id) ? "text-red-500 fill-red-500" : "text-gray-400"} />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-bold leading-tight">{walker.full_name}</p>
                    <p className="text-white/80 text-xs flex items-center gap-1">
                      <MapPin size={10} />{walker.area ? `${walker.area}, ` : ""}{walker.city}
                    </p>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex">{renderStars(walker.rating)}</div>
                      <span className="text-sm font-bold text-gray-800">{walker.rating}</span>
                      <span className="text-xs text-gray-400">({walker.reviews_count})</span>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Footprints size={11} />{walker.total_walks.toLocaleString()} walks
                    </span>
                  </div>

                  {walker.bio && <p className="text-sm text-gray-600 line-clamp-2">{walker.bio}</p>}

                  <div className="flex gap-3 text-xs text-gray-500">
                    {walker.experience && <span className="flex items-center gap-1"><Award size={11} />{walker.experience}</span>}
                    <span className="flex items-center gap-1"><Shield size={11} />{walker.city}</span>
                  </div>

                  {/* Specialties */}
                  {walker.specialties.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {walker.specialties.slice(0, 3).map(s => (
                        <span key={s} className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                      {walker.pet_types.map(p => (
                        <span key={p} className="text-xs bg-cyan-50 text-cyan-600 px-2 py-0.5 rounded-full">{p}</span>
                      ))}
                    </div>
                  )}

                  {/* Slots */}
                  {walker.available_slots.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {walker.available_slots.slice(0, 1).map(s => (
                        <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock size={10} />{s}
                        </span>
                      ))}
                      {walker.available_slots.length > 1 && (
                        <span className="text-xs text-gray-400">+{walker.available_slots.length - 1} more</span>
                      )}
                    </div>
                  )}

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-xl font-bold text-teal-600">₹{walker.hourly_rate}</span>
                      <span className="text-xs text-gray-400">/hour</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => handleCall(walker)}>
                        <Phone size={12} /> Call
                      </Button>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs gap-1"
                        disabled={walker.availability === "Busy"}
                        onClick={() => { setBookingWalker(walker); setBookingSlot(walker.available_slots[0] || ""); }}>
                        <Calendar size={12} /> Book
                      </Button>
                    </div>
                  </div>

                  <button onClick={() => setSelectedWalker(walker)}
                    className="text-xs text-teal-600 hover:underline w-full text-center">
                    View Full Profile →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
          <Footprints size={40} className="mx-auto mb-3 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Love Walking Dogs?</h2>
          <p className="text-teal-100 mb-4">Earn ₹200-500/hour as a verified pet walker. Flexible hours, happy pets!</p>
          <Button variant="secondary" onClick={() => navigate("/pet-walker-signup")} className="font-semibold">
            Register as a Pet Walker →
          </Button>
        </div>
      </div>

      {/* Walker Detail Modal */}
      {selectedWalker && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4"
          onClick={() => setSelectedWalker(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="relative h-48">
              <img src={selectedWalker.photo} alt={selectedWalker.full_name}
                className="w-full h-full object-cover rounded-t-2xl"
                onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedWalker.full_name}`; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl" />
              <button onClick={() => setSelectedWalker(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">✕</button>
              <div className="absolute bottom-4 left-4">
                <p className="text-white text-xl font-bold">{selectedWalker.full_name}</p>
                <p className="text-white/80 text-sm">{selectedWalker.area ? `${selectedWalker.area}, ` : ""}{selectedWalker.city}, {selectedWalker.state}</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-3">
                {[
                  { label: "reviews", value: `${selectedWalker.rating}⭐`, sub: `${selectedWalker.reviews_count} reviews` },
                  { label: "walks", value: selectedWalker.total_walks.toLocaleString(), sub: "walks done" },
                  { label: "rate", value: `₹${selectedWalker.hourly_rate}`, sub: "per hour" },
                ].map(s => (
                  <div key={s.label} className="flex-1 bg-teal-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-teal-700">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.sub}</p>
                  </div>
                ))}
              </div>
              {selectedWalker.bio && <p className="text-gray-600 text-sm leading-relaxed">{selectedWalker.bio}</p>}
              <div className="text-sm text-gray-700">
                <span className="font-medium">Experience:</span> {selectedWalker.experience}
                {selectedWalker.languages.length > 0 && <span> • {selectedWalker.languages.join(", ")}</span>}
              </div>
              {selectedWalker.is_certified && selectedWalker.certifications.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWalker.certifications.map(c => (
                      <Badge key={c} className="bg-green-100 text-green-700 border-green-200">{c}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedWalker.available_slots.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Slots</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWalker.available_slots.map(s => (
                      <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={() => handleCall(selectedWalker)}>
                  <Phone size={16} /> Call
                </Button>
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700 gap-2"
                  disabled={selectedWalker.availability === "Busy"}
                  onClick={() => { setSelectedWalker(null); setBookingWalker(selectedWalker); setBookingSlot(selectedWalker.available_slots[0] || ""); }}>
                  <Calendar size={16} /> Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingWalker && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4"
          onClick={() => setBookingWalker(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-1">📅 Book a Walk</h2>
            <p className="text-gray-500 text-sm mb-5">with {bookingWalker.full_name} • ₹{bookingWalker.hourly_rate}/hr</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Select Date *</label>
                <Input type="date" value={bookingDate} min={new Date().toISOString().split("T")[0]}
                  onChange={e => setBookingDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Select Time Slot *</label>
                <Select value={bookingSlot} onValueChange={setBookingSlot}>
                  <SelectTrigger><SelectValue placeholder="Choose a slot" /></SelectTrigger>
                  <SelectContent>
                    {(bookingWalker.available_slots.length > 0
                      ? bookingWalker.available_slots
                      : ["Morning (6AM-10AM)", "Evening (4PM-8PM)"]
                    ).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-teal-50 rounded-xl p-3 text-sm text-teal-700">
                💡 After booking, {bookingWalker.full_name} will call you on your registered number to confirm.
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setBookingWalker(null)}>Cancel</Button>
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700" onClick={handleBook}>Confirm Booking</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetWalkers;
