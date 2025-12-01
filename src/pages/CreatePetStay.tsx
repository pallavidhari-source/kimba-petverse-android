import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { createPetStaySchema } from "@/lib/validations/host";

const CreatePetStay = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "individual" as "commercial" | "individual",
    location: "",
    description: "",
    price_per_night: "",
    max_capacity: "",
    pet_types: "",
    check_in_time: "",
    check_out_time: "",
    image_url: "",
    features: "",
    amenities: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a pet stay");
        navigate("/auth");
        return;
      }

      // Validate form data
      const validatedData = createPetStaySchema.parse({
        name: formData.name,
        type: formData.type,
        location: formData.location,
        description: formData.description || undefined,
        price_per_night: parseFloat(formData.price_per_night),
        max_capacity: formData.max_capacity || undefined,
        pet_types: formData.pet_types || undefined,
        check_in_time: formData.check_in_time || undefined,
        check_out_time: formData.check_out_time || undefined,
        image_url: formData.image_url || "",
        features: formData.features || undefined,
        amenities: formData.amenities || undefined,
      });

      const featuresArray = validatedData.features
        ? validatedData.features.split(',').map(f => f.trim()).filter(f => f.length > 0)
        : [];

      const amenitiesArray = validatedData.amenities
        ? validatedData.amenities.split(',').map(a => a.trim()).filter(a => a.length > 0)
        : [];

      const { error } = await supabase
        .from('pet_stays')
        .insert({
          host_id: user.id,
          name: validatedData.name,
          type: validatedData.type,
          location: validatedData.location,
          description: validatedData.description || null,
          price_per_night: validatedData.price_per_night,
          max_capacity: validatedData.max_capacity || null,
          pet_types: validatedData.pet_types || null,
          check_in_time: validatedData.check_in_time || null,
          check_out_time: validatedData.check_out_time || null,
          image_url: validatedData.image_url || null,
          features: featuresArray,
          amenities: amenitiesArray
        });

      if (error) throw error;

      toast.success("Pet stay created successfully!");
      navigate("/pet-airbnb");
    } catch (error: any) {
      if (error.name === "ZodError") {
        toast.error(error.errors[0]?.message || "Invalid form data");
      } else {
        toast.error(error.message || "Failed to create pet stay");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/pet-airbnb")}
            className="mb-4 text-primary-foreground hover:text-primary-foreground/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pet Stays
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl mb-4">
              List Your Pet Stay
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Share your space or facility with pet owners looking for trusted care.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Pet Stay Details</CardTitle>
              <CardDescription>
                Provide information about your pet accommodation facility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Stay Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "commercial" | "individual") =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial Facility</SelectItem>
                      <SelectItem value="individual">Individual/Home Stay</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose "Commercial" for registered businesses or "Individual" for personal home stays
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Stay Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Paws Paradise Resort"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Banjara Hills, Hyderabad"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price Per Night (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 1500"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="check_in">Check-In Time</Label>
                    <Input
                      id="check_in"
                      placeholder="e.g., 10:00 AM"
                      value={formData.check_in_time}
                      onChange={(e) => setFormData({ ...formData, check_in_time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="check_out">Check-Out Time</Label>
                    <Input
                      id="check_out"
                      placeholder="e.g., 12:00 PM"
                      value={formData.check_out_time}
                      onChange={(e) => setFormData({ ...formData, check_out_time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_capacity">Maximum Capacity</Label>
                  <Input
                    id="max_capacity"
                    placeholder="e.g., 4 pets"
                    value={formData.max_capacity}
                    onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pet_types">Pet Types Accepted</Label>
                  <Input
                    id="pet_types"
                    placeholder="e.g., Dogs, Cats, Small Pets"
                    value={formData.pet_types}
                    onChange={(e) => setFormData({ ...formData, pet_types: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your pet stay facility..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Key Features</Label>
                  <Input
                    id="features"
                    placeholder="e.g., 24/7 Care, Webcam Access, Climate Control (comma-separated)"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple features with commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities</Label>
                  <Input
                    id="amenities"
                    placeholder="e.g., Swimming Pool, Grooming, Training (comma-separated)"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple amenities with commas
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Pet Stay"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default CreatePetStay;
