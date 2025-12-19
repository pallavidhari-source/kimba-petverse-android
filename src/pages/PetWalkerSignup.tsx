import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PawPrint, CheckCircle, Clock, DollarSign } from "lucide-react";

const PetWalkerSignup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    location: "",
    experience: "",
    hourlyRate: "",
    bio: "",
    certifications: [] as string[],
    availableSlots: [] as string[],
    specialties: [] as string[],
  });

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

    if (!formData.fullName || !formData.phone || !formData.location || !formData.hourlyRate) {
      toast.error("Please fill in all required fields", {
        action: { label: "OK", onClick: () => {} }
      });
      return;
    }

    setLoading(true);
    
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    disabled={!!user}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location/Area *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Koramangala, Bangalore"
                    required
                  />
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