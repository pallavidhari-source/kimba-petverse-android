import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { vetAppointmentSchema, type VetAppointmentFormData } from "@/lib/validations/vet-appointment";
import { ArrowLeft, MapPin, Star, Phone, Clock, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VetDetails {
  id: number;
  name: string;
  specialization: string;
  clinic: string;
  location: string;
  rating: number;
  phone: string;
  hours: string;
}

const BookVetAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Get vet details from navigation state
  const vetDetails = location.state?.vet as VetDetails | undefined;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in to book an appointment");
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const form = useForm<VetAppointmentFormData>({
    resolver: zodResolver(vetAppointmentSchema),
    defaultValues: {
      petParentName: "",
      countryCode: "+91",
      phoneNumber: "",
      petName: "",
      petType: "",
      petGender: undefined,
      appointmentReason: "",
      preferredDate: "",
      preferredTime: "",
    },
  });

  const onSubmit = async (data: VetAppointmentFormData) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Integrate with backend API/Supabase to save to database
      // For now, simulate API call and store in state
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const fullAppointmentData = {
        ...data,
        fullPhoneNumber: `${data.countryCode} ${data.phoneNumber}`,
        vetId: vetDetails?.id,
        vetName: vetDetails?.name,
        vetSpecialization: vetDetails?.specialization,
        clinic: vetDetails?.clinic,
        clinicLocation: vetDetails?.location,
        clinicPhone: vetDetails?.phone,
        status: "pending",
        bookedAt: new Date().toISOString(),
        userId: user?.id,
      };

      console.log("Appointment Data:", fullAppointmentData);

      setAppointmentData(fullAppointmentData);
      setShowSuccess(true);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Redirect to user dashboard after 3 seconds
      setTimeout(() => {
        navigate("/user-dashboard", { 
          state: { 
            newAppointment: fullAppointmentData,
            showAppointments: true 
          } 
        });
      }, 3000);
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/vets")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Veterinarians
        </Button>

        {showSuccess && appointmentData && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Appointment Booked Successfully!</AlertTitle>
            <AlertDescription className="text-green-700">
              <div className="mt-2 space-y-1">
                <p><strong>Pet:</strong> {appointmentData.petName} ({appointmentData.petType})</p>
                <p><strong>Date:</strong> {appointmentData.preferredDate}</p>
                <p><strong>Time:</strong> {appointmentData.preferredTime}</p>
                <p><strong>Vet:</strong> {appointmentData.vetName}</p>
                <p><strong>Clinic:</strong> {appointmentData.clinic}</p>
                <p className="mt-3 text-sm">Redirecting to your dashboard...</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Vet Details Card */}
          {vetDetails && (
            <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle>Appointment With</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{vetDetails.name}</h3>
                  <p className="text-sm text-muted-foreground">{vetDetails.specialization}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">{vetDetails.clinic}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {vetDetails.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    {vetDetails.rating}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {vetDetails.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {vetDetails.hours}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appointment Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
              <CardDescription>
                Fill in the details below to schedule your pet's veterinary appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="petParentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Parent Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Phone Number</FormLabel>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                          <FormItem className="w-32">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Code" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background z-50">
                                <SelectItem value="+91">🇮🇳 +91</SelectItem>
                                <SelectItem value="+1">🇺🇸 +1</SelectItem>
                                <SelectItem value="+44">🇬🇧 +44</SelectItem>
                                <SelectItem value="+61">🇦🇺 +61</SelectItem>
                                <SelectItem value="+971">🇦🇪 +971</SelectItem>
                                <SelectItem value="+65">🇸🇬 +65</SelectItem>
                                <SelectItem value="+60">🇲🇾 +60</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="petName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your pet's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="petType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select pet type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="dog">Dog</SelectItem>
                            <SelectItem value="cat">Cat</SelectItem>
                            <SelectItem value="rabbit">Rabbit</SelectItem>
                            <SelectItem value="turtle">Turtle</SelectItem>
                            <SelectItem value="bird">Bird</SelectItem>
                            <SelectItem value="hamster">Hamster</SelectItem>
                            <SelectItem value="guinea-pig">Guinea Pig</SelectItem>
                            <SelectItem value="fish">Fish</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="petGender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Pet Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male">Male</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female">Female</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="appointmentReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Appointment</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe the reason for your visit (e.g., routine checkup, vaccination, skin issues, etc.)"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Booking..." : "Book Appointment"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookVetAppointment;
