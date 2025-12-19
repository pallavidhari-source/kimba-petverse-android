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
import { PawPrint, CheckCircle, Clock, DollarSign } from "lucide-react";

const indianStatesWithCities: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Kakinada", "Rajahmundry"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Karnal", "Rohtak", "Sonipat"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Manali", "Kullu", "Mandi", "Solan", "Kangra"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Belgaum", "Davangere", "Gulbarga", "Shimoga"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Solapur", "Kolhapur", "Navi Mumbai"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar", "Bhilwara"],
  "Sikkim": ["Gangtok", "Namchi", "Mangan", "Gyalshing", "Ravangla"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Secunderabad", "Mahbubnagar"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Ambassa"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Meerut", "Ghaziabad", "Noida", "Bareilly"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Nainital", "Roorkee", "Haldwani", "Mussoorie"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Darjeeling", "Kharagpur", "Bardhaman"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi"],
  "Chandigarh": ["Chandigarh"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
};

const PetWalkerSignup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("Telangana");
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    experience: "",
    hourlyRate: "",
    bio: "",
    certifications: [] as string[],
    availableSlots: [] as string[],
    specialties: [] as string[],
  });

  const availableCities = indianStatesWithCities[selectedState] || [];

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const cities = indianStatesWithCities[state];
    setSelectedCity(cities?.[0] || "");
  };

  const certificationOptions = [
    "Pet First Aid",
    "Canine Behavior Training",
    "Dog Training Certified",
    "Pet CPR",
    "Professional Dog Walker",
    "Animal Behavior Specialist",
    "Pet Nutrition",
    "Agility Training"
  ];

  const slotOptions = [
    "Morning (6AM-10AM)",
    "Afternoon (10AM-2PM)",
    "Evening (4PM-8PM)",
    "Night (8PM-10PM)",
    "Weekends Only",
    "Full Day Available"
  ];

  const specialtyOptions = [
    "Dogs",
    "Cats",
    "Small Dogs",
    "Large Breeds",
    "Puppies",
    "Senior Dogs",
    "Special Needs",
    "Active Dogs"
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, email: session.user.email || "" }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, email: session.user.email || "" }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCheckboxChange = (field: 'certifications' | 'availableSlots' | 'specialties', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.info("Please sign in to register as a pet walker", {
        action: { label: "OK", onClick: () => {} }
      });
      sessionStorage.setItem('pendingPetWalkerSignup', 'true');
      navigate("/auth");
      return;
    }

    if (!formData.fullName || !formData.phone || !selectedState || !selectedCity || !formData.hourlyRate) {
      toast.error("Please fill in all required fields", {
        action: { label: "OK", onClick: () => {} }
      });
      return;
    }

    setLoading(true);
    
    const location = `${selectedCity}, ${selectedState}`;
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Your pet walker application has been submitted!", {
        description: "We'll review your application and get back to you within 24-48 hours.",
        action: { label: "OK", onClick: () => {} }
      });
      navigate("/pet-walkers");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Become a Pet Walker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our community of professional pet walkers and turn your love for animals into a rewarding career.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6 border-primary/20">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Earn Good Money</h3>
            <p className="text-sm text-muted-foreground">Set your own rates and earn ₹200-₹500 per hour</p>
          </Card>
          <Card className="text-center p-6 border-primary/20">
            <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Flexible Schedule</h3>
            <p className="text-sm text-muted-foreground">Choose your own hours and work when it suits you</p>
          </Card>
          <Card className="text-center p-6 border-primary/20">
            <PawPrint className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Work with Pets</h3>
            <p className="text-sm text-muted-foreground">Spend your days with adorable furry friends</p>
          </Card>
        </div>

        {/* Signup Form */}
        <Card className="max-w-2xl mx-auto border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="h-6 w-6 text-primary" />
              Pet Walker Registration
            </CardTitle>
            <CardDescription>
              Fill out the form below to apply as a pet walker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select value={selectedState} onValueChange={handleStateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border max-h-60">
                      {Object.keys(indianStatesWithCities).map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border max-h-60">
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 2 years"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (₹) *</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    placeholder="e.g., 250"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">About You</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell pet owners about yourself and your experience with animals..."
                  rows={4}
                />
              </div>

              {/* Certifications */}
              <div className="space-y-3">
                <Label>Certifications (if any)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {certificationOptions.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox
                        id={cert}
                        checked={formData.certifications.includes(cert)}
                        onCheckedChange={() => handleCheckboxChange('certifications', cert)}
                      />
                      <label htmlFor={cert} className="text-sm cursor-pointer">{cert}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Slots */}
              <div className="space-y-3">
                <Label>Availability *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {slotOptions.map((slot) => (
                    <div key={slot} className="flex items-center space-x-2">
                      <Checkbox
                        id={slot}
                        checked={formData.availableSlots.includes(slot)}
                        onCheckedChange={() => handleCheckboxChange('availableSlots', slot)}
                      />
                      <label htmlFor={slot} className="text-sm cursor-pointer">{slot}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-3">
                <Label>Specialties</Label>
                <div className="grid grid-cols-2 gap-3">
                  {specialtyOptions.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialty}
                        checked={formData.specialties.includes(specialty)}
                        onCheckedChange={() => handleCheckboxChange('specialties', specialty)}
                      />
                      <label htmlFor={specialty} className="text-sm cursor-pointer">{specialty}</label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By submitting this form, you agree to our terms of service and privacy policy.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetWalkerSignup;