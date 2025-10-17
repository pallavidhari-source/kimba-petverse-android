import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PawPrint, Upload, Loader2 } from "lucide-react";

const RegisterPet = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [petData, setPetData] = useState({
    name: "",
    type: "" as "dog" | "cat" | "bird" | "rabbit" | "",
    breed: "",
    age: "",
    temperament: "",
    description: "",
    price_per_hour: "",
    location: "",
    is_vaccinated: false,
    is_trained: false,
    is_kid_friendly: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please sign in to register a pet");
      navigate("/auth");
      return;
    }

    // Check if user is a host
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "host")
      .single();

    if (!roles) {
      toast.error("You must be a verified host to register pets");
      navigate("/profile");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
    const filePath = `pet-images/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('kyc-documents')
      .upload(filePath, imageFile);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('kyc-documents')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!petData.name || !petData.type || !petData.breed || !petData.age || !petData.price_per_hour || !petData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setUploading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expired. Please sign in again.");
        navigate("/auth");
        return;
      }

      // Upload image
      const imageUrl = await uploadImage();
      setUploading(false);

      // Insert pet data
      const { error } = await supabase
        .from("pets")
        .insert({
          host_id: session.user.id,
          name: petData.name,
          type: petData.type,
          breed: petData.breed,
          age: parseInt(petData.age),
          temperament: petData.temperament,
          description: petData.description,
          price_per_hour: parseFloat(petData.price_per_hour),
          location: petData.location,
          is_vaccinated: petData.is_vaccinated,
          is_trained: petData.is_trained,
          is_kid_friendly: petData.is_kid_friendly,
          image_url: imageUrl,
          available: true,
        });

      if (error) throw error;

      toast.success("Pet registered successfully!");
      navigate("/host-dashboard", { replace: true });
    } catch (error: any) {
      console.error("Error registering pet:", error);
      toast.error(error.message || "Failed to register pet");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-3xl shadow-medium">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <PawPrint className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Register Your Pet</CardTitle>
                <CardDescription>Add your pet to start hosting pet experiences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pet Image */}
              <div className="space-y-2">
                <Label htmlFor="image">Pet Image</Label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Pet preview" className="h-24 w-24 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Upload a clear photo of your pet</p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input
                    id="name"
                    value={petData.name}
                    onChange={(e) => setPetData({ ...petData, name: e.target.value })}
                    placeholder="e.g., Milo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Pet Type *</Label>
                  <Select
                    value={petData.type}
                    onValueChange={(value: "dog" | "cat" | "bird" | "rabbit") =>
                      setPetData({ ...petData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="rabbit">Rabbit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed *</Label>
                  <Input
                    id="breed"
                    value={petData.breed}
                    onChange={(e) => setPetData({ ...petData, breed: e.target.value })}
                    placeholder="e.g., Golden Retriever"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age (years) *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    value={petData.age}
                    onChange={(e) => setPetData({ ...petData, age: e.target.value })}
                    placeholder="e.g., 3"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperament">Temperament</Label>
                  <Input
                    id="temperament"
                    value={petData.temperament}
                    onChange={(e) => setPetData({ ...petData, temperament: e.target.value })}
                    placeholder="e.g., Calm, Playful"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Hour (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="100"
                    value={petData.price_per_hour}
                    onChange={(e) => setPetData({ ...petData, price_per_hour: e.target.value })}
                    placeholder="e.g., 1200"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={petData.location}
                  onChange={(e) => setPetData({ ...petData, location: e.target.value })}
                  placeholder="e.g., Banjara Hills, Hyderabad"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={petData.description}
                  onChange={(e) => setPetData({ ...petData, description: e.target.value })}
                  placeholder="Tell visitors about your pet's personality, habits, and what makes them special..."
                  rows={4}
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <Label>Pet Characteristics</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vaccinated"
                      checked={petData.is_vaccinated}
                      onCheckedChange={(checked) =>
                        setPetData({ ...petData, is_vaccinated: checked as boolean })
                      }
                    />
                    <label htmlFor="vaccinated" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Vaccinated
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trained"
                      checked={petData.is_trained}
                      onCheckedChange={(checked) =>
                        setPetData({ ...petData, is_trained: checked as boolean })
                      }
                    />
                    <label htmlFor="trained" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Trained
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="kid-friendly"
                      checked={petData.is_kid_friendly}
                      onCheckedChange={(checked) =>
                        setPetData({ ...petData, is_kid_friendly: checked as boolean })
                      }
                    />
                    <label htmlFor="kid-friendly" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Kid Friendly
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {uploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-pulse" />
                      Uploading...
                    </>
                  ) : loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Pet"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPet;
