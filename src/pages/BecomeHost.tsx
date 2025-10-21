import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";

const timeSlots = [
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM",
  "6:00 PM - 7:00 PM",
  "7:00 PM - 8:00 PM",
  "8:00 PM - 9:00 PM",
  "9:00 PM - 10:00 PM",
  "10:00 PM - 11:00 PM",
  "11:00 PM - 12:00 AM",
];

const parseTimeSlot = (slot: string): number => {
  const startTime = slot.split(" - ")[0];
  const [time, period] = startTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
};

const isSlotDisabled = (slot: string, selectedDate: Date | undefined): boolean => {
  if (!selectedDate) return false;
  
  const today = new Date();
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  
  if (!isToday) return false;
  
  const currentMinutes = today.getHours() * 60 + today.getMinutes();
  const slotMinutes = parseTimeSlot(slot);
  
  return slotMinutes < currentMinutes;
};

const BecomeHost = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('edit');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState<Date | undefined>();
  const [currentTimeSlots, setCurrentTimeSlots] = useState<string[]>([]);
  const [dateTimeSlotsMap, setDateTimeSlotsMap] = useState<Record<string, string[]>>({});
  const [kycDocument, setKycDocument] = useState<File | null>(null);
  const [vaccinationCert, setVaccinationCert] = useState<File | null>(null);
  const [petImages, setPetImages] = useState<File[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      
      // Load existing application if editing
      if (applicationId) {
        loadApplication(applicationId);
      }
    });
  }, [navigate, applicationId]);

  const loadApplication = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("host_applications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        // Pre-fill form fields
        (document.getElementById("fullName") as HTMLInputElement).value = data.full_name || "";
        (document.getElementById("phone") as HTMLInputElement).value = data.phone || "";
        (document.getElementById("petName") as HTMLInputElement).value = data.pet_name || "";
        
        // Load date-time slots map
        if (data.available_dates_slots) {
          setDateTimeSlotsMap(data.available_dates_slots as Record<string, string[]>);
        }
      }
    } catch (error: any) {
      toast.error("Failed to load application");
      console.error(error);
    }
  };

  const toggleTimeSlot = (slot: string) => {
    setCurrentTimeSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  const addDateWithSlots = () => {
    if (!currentDate) {
      toast.error("Please select a date first");
      return;
    }
    if (currentTimeSlots.length === 0) {
      toast.error("Please select at least one time slot");
      return;
    }

    const dateKey = format(currentDate, "yyyy-MM-dd");
    setDateTimeSlotsMap(prev => ({
      ...prev,
      [dateKey]: currentTimeSlots
    }));
    
    // Reset selections
    setCurrentDate(undefined);
    setCurrentTimeSlots([]);
    toast.success("Date and time slots added");
  };

  const removeDateSlots = (dateKey: string) => {
    setDateTimeSlotsMap(prev => {
      const newMap = { ...prev };
      delete newMap[dateKey];
      return newMap;
    });
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    
    if (error) throw error;
    
    // Return file path instead of public URL for security
    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const fullName = formData.get("fullName") as string;
      const phone = formData.get("phone") as string;
      const petName = formData.get("petName") as string;
      const petType = formData.get("petType") as string;
      const petGender = formData.get("petGender") as string;

      if (Object.keys(dateTimeSlotsMap).length === 0) {
        toast.error("Please add at least one date with time slots");
        return;
      }

      if (!kycDocument || !vaccinationCert) {
        toast.error("Please upload all required documents");
        return;
      }

      if (petImages.length === 0) {
        toast.error("Please upload at least one pet image");
        return;
      }

      // Upload files
      const kycUrl = await uploadFile(
        kycDocument,
        "kyc-documents",
        `${user.id}/kyc-${Date.now()}.${kycDocument.name.split('.').pop()}`
      );

      const vaccinationUrl = await uploadFile(
        vaccinationCert,
        "kyc-documents",
        `${user.id}/vaccination-${Date.now()}.${vaccinationCert.name.split('.').pop()}`
      );

      const petImageUrls = await Promise.all(
        petImages.map((img, idx) =>
          uploadFile(
            img,
            "kyc-documents",
            `${user.id}/pet-${idx}-${Date.now()}.${img.name.split('.').pop()}`
          )
        )
      );

      // Submit application
      if (applicationId) {
        // Update existing application
        const { error } = await supabase
          .from("host_applications")
          .update({
            full_name: fullName,
            phone,
            pet_name: petName,
            pet_type: petType,
            pet_gender: petGender,
            available_dates_slots: dateTimeSlotsMap,
            kyc_document_url: kycUrl,
            vaccination_certificate_url: vaccinationUrl,
            pet_images_urls: petImageUrls,
          })
          .eq("id", applicationId);

        if (error) throw error;
        toast.success("Application updated successfully!");
      } else {
        // Create new application
        const { error } = await supabase.from("host_applications").insert({
          user_id: user.id,
          full_name: fullName,
          phone,
          pet_name: petName,
          pet_type: petType,
          pet_gender: petGender,
          available_dates_slots: dateTimeSlotsMap,
          kyc_document_url: kycUrl,
          vaccination_certificate_url: vaccinationUrl,
          pet_images_urls: petImageUrls,
          status: "pending",
        });

        if (error) throw error;
        toast.success("Application submitted successfully! We'll review it soon.");
      }
      
      navigate("/host-dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-2xl shadow-medium">
          <CardHeader>
            <CardTitle className="text-2xl">Become a Host</CardTitle>
            <CardDescription>
              Join our community of verified pet hosts and share the joy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="petName">Pet Name</Label>
                <Input
                  id="petName"
                  name="petName"
                  required
                  placeholder="Your pet's name"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="petType">Pet Type</Label>
                  <Select name="petType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="rabbit">Rabbit</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="petGender">Pet Gender</Label>
                  <Select name="petGender" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Available Date</Label>
                <div className="rounded-lg border p-4">
                  <Calendar
                    mode="single"
                    selected={currentDate}
                    onSelect={setCurrentDate}
                    className="rounded-md pointer-events-auto"
                    disabled={(date) => {
                      const dateKey = format(date, "yyyy-MM-dd");
                      return date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                             dateKey in dateTimeSlotsMap;
                    }}
                  />
                </div>
              </div>

              {currentDate && (
                <div className="space-y-2">
                  <Label>Available Time Slots for {format(currentDate, "PPP")}</Label>
                  <div className="grid grid-cols-2 gap-2 rounded-lg border p-4">
                    {timeSlots.map((slot) => {
                      const disabled = isSlotDisabled(slot, currentDate);
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => !disabled && toggleTimeSlot(slot)}
                          disabled={disabled}
                          className={`rounded-md px-3 py-2 text-sm transition-colors ${
                            disabled
                              ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                              : currentTimeSlots.includes(slot)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    type="button"
                    onClick={addDateWithSlots}
                    className="w-full"
                    disabled={currentTimeSlots.length === 0}
                  >
                    Add Date with Selected Time Slots
                  </Button>
                </div>
              )}

              {Object.keys(dateTimeSlotsMap).length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Availability Schedule</Label>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time Slots</TableHead>
                          <TableHead className="w-[50px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(dateTimeSlotsMap)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([dateKey, slots]) => (
                            <TableRow key={dateKey}>
                              <TableCell className="font-medium">
                                {format(new Date(dateKey), "PPP")}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {slots.map((slot, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block rounded-md bg-primary/10 px-2 py-1 text-xs"
                                    >
                                      {slot}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeDateSlots(dateKey)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="kycDocument">KYC Document (Aadhaar/PAN/DL)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="kycDocument"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setKycDocument(e.target.files?.[0] || null)}
                    required
                  />
                  {kycDocument && (
                    <span className="text-sm text-muted-foreground">✓</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaccinationCert">Pet Vaccination Certificate</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="vaccinationCert"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setVaccinationCert(e.target.files?.[0] || null)}
                    required
                  />
                  {vaccinationCert && (
                    <span className="text-sm text-muted-foreground">✓</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="petImages">Pet Pictures (Upload multiple)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="petImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setPetImages(Array.from(e.target.files || []))}
                    required
                  />
                  {petImages.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {petImages.length} file(s) selected
                    </span>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (applicationId ? "Updating..." : "Submitting...") : (applicationId ? "Update Application" : "Submit Application")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BecomeHost;
