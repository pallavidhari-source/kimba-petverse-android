import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PawPrint, Clock, IndianRupee, CheckCircle, Loader2 } from "lucide-react";

const indianStatesWithCities: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Gandhinagar"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Manali", "Kullu"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Belgaum"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Navi Mumbai"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Secunderabad"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida", "Ghaziabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
};

const certificationOptions = ["Pet First Aid", "Canine Behavior Training", "Dog Training Certified", "Pet CPR", "Professional Dog Walker", "Animal Behavior Specialist", "Pet Nutrition", "Agility Training"];
const slotOptions = ["Morning (6AM-10AM)", "Afternoon (10AM-2PM)", "Evening (4PM-8PM)", "Night (8PM-10PM)", "Weekends Only", "Full Day Available"];
const specialtyOptions = ["Dogs", "Cats", "Small Dogs", "Large Breeds", "Puppies", "Senior Dogs", "Special Needs", "Active Dogs", "Rabbits"];
const languageOptions = ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "Gujarati", "Bengali", "Punjabi"];

const PetWalkerSignup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedState, setSelectedState] = useState("Telangana");
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    area: "",
    experience: "",
    hourlyRate: "",
    bio: "",
    certifications: [] as string[],
    availableSlots: [] as string[],
    specialties: [] as string[],
    languages: ["English"] as string[],
  });

  const availableCities = indianStatesWithCities[selectedState] || [];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, email: session.user.email || "" }));
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) setFormData(prev => ({ ...prev, email: session.user.email || "" }));
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity(indianStatesWithCities[state]?.[0] || "");
  };

  const handleCheckbox = (field: 'certifications' | 'availableSlots' | 'specialties' | 'languages', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please sign in to register as a pet walker");
      sessionStorage.setItem('pendingPetWalkerSignup', 'true');
      navigate("/auth");
      return;
    }

    if (!formData.fullName || !formData.phone || !selectedCity || !formData.hourlyRate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.availableSlots.length === 0) {
      toast.error("Please select at least one availability slot");
      return;
    }

    if (formData.specialties.length === 0) {
      toast.error("Please select at least one specialty");
      return;
    }

    setLoading(true);

    try {
      // Check if user already applied
      const { data: existing } = await supabase
        .from("pet_walkers" as any)
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        toast.info("You have already submitted an application. We'll review it shortly!");
        setLoading(false);
        return;
      }

      // Save to Supabase
      const { error } = await supabase.from("pet_walkers" as any).insert({
        user_id: user.id,
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email || user.email,
        state: selectedState,
        city: selectedCity,
        area: formData.area,
        experience: formData.experience || "Less than 1 year",
        hourly_rate: parseInt(formData.hourlyRate),
        bio: formData.bio,
        certifications: formData.certifications,
        available_slots: formData.availableSlots,
        specialties: formData.specialties,
        pet_types: formData.specialties.filter(s => ["Dogs", "Cats", "Rabbits"].includes(s)),
        languages: formData.languages,
        is_approved: true, // Auto-approve for demo; set FALSE in production
        availability: "Available",
        rating: 4.5,
        reviews_count: 0,
        total_walks: 0,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("🎉 Application submitted successfully!");

    } catch (error: any) {
      toast.error("Failed to submit application", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted! 🐾</h1>
            <p className="text-gray-500 mb-2">Thank you, <strong>{formData.fullName}</strong>!</p>
            <p className="text-gray-500 mb-8">Your profile is now live on the Pet Walkers page. Pet owners in <strong>{selectedCity}</strong> can now find and book you!</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/pet-walkers")} className="bg-teal-600 hover:bg-teal-700">
                View My Profile →
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Become a Pet Walker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our community of professional pet walkers. Turn your love for animals into income!
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: IndianRupee, title: "Earn ₹200-500/hour", desc: "Set your own rates and get paid directly by pet owners" },
            { icon: Clock, title: "Flexible Schedule", desc: "Choose your own hours — mornings, evenings or weekends" },
            { icon: PawPrint, title: "Work with Pets", desc: "Spend your days with adorable furry friends" },
          ].map(b => (
            <Card key={b.title} className="text-center p-6 border-primary/20">
              <b.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
              <h3 className="text-base font-semibold mb-1">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </Card>
          ))}
        </div>

        {/* Form */}
        <Card className="max-w-2xl mx-auto border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-primary" />
              Pet Walker Registration
            </CardTitle>
            <CardDescription>Fill out the form to start appearing in search results</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input placeholder="Your full name" value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input placeholder="+91 XXXXX XXXXX" value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>State *</Label>
                  <Select value={selectedState} onValueChange={handleStateChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Object.keys(indianStatesWithCities).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-60">
                      {availableCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Area / Locality</Label>
                <Input placeholder="e.g. Banjara Hills, Koramangala" value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })} />
              </div>

              {/* Experience & Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Years of Experience</Label>
                  <Input placeholder="e.g. 2 years" value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Hourly Rate (₹) *</Label>
                  <Input type="number" placeholder="e.g. 250" min={100} max={1000} value={formData.hourlyRate}
                    onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })} required />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label>About You</Label>
                <Textarea placeholder="Tell pet owners about yourself, your experience and why you love animals..." rows={4}
                  value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
              </div>

              {/* Certifications */}
              <div className="space-y-3">
                <Label>Certifications (if any)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {certificationOptions.map(cert => (
                    <div key={cert} className="flex items-center gap-2">
                      <Checkbox id={cert} checked={formData.certifications.includes(cert)}
                        onCheckedChange={() => handleCheckbox('certifications', cert)} />
                      <label htmlFor={cert} className="text-sm cursor-pointer">{cert}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <Label>Availability * <span className="text-xs text-gray-400">(select all that apply)</span></Label>
                <div className="grid grid-cols-2 gap-2">
                  {slotOptions.map(slot => (
                    <div key={slot} className="flex items-center gap-2">
                      <Checkbox id={slot} checked={formData.availableSlots.includes(slot)}
                        onCheckedChange={() => handleCheckbox('availableSlots', slot)} />
                      <label htmlFor={slot} className="text-sm cursor-pointer">{slot}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-3">
                <Label>Specialties * <span className="text-xs text-gray-400">(what pets can you handle?)</span></Label>
                <div className="grid grid-cols-2 gap-2">
                  {specialtyOptions.map(s => (
                    <div key={s} className="flex items-center gap-2">
                      <Checkbox id={s} checked={formData.specialties.includes(s)}
                        onCheckedChange={() => handleCheckbox('specialties', s)} />
                      <label htmlFor={s} className="text-sm cursor-pointer">{s}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-3">
                <Label>Languages Spoken</Label>
                <div className="grid grid-cols-3 gap-2">
                  {languageOptions.map(lang => (
                    <div key={lang} className="flex items-center gap-2">
                      <Checkbox id={lang} checked={formData.languages.includes(lang)}
                        onCheckedChange={() => handleCheckbox('languages', lang)} />
                      <label htmlFor={lang} className="text-sm cursor-pointer">{lang}</label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent" disabled={loading}>
                {loading ? <><Loader2 size={16} className="animate-spin mr-2" /> Submitting...</> : "Submit Application 🐾"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Your profile will be visible to pet owners immediately after submission.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetWalkerSignup;
