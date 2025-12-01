import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { vetAppointmentSchema, type VetAppointmentFormData } from "@/lib/validations/vet-appointment";
import { ArrowLeft, MapPin, Star, Phone, Clock } from "lucide-react";

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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get vet details from navigation state
  const vetDetails = location.state?.vet as VetDetails | undefined;

  const form = useForm<VetAppointmentFormData>({
    resolver: zodResolver(vetAppointmentSchema),
    defaultValues: {
      petParentName: "",
      petName: "",
      petGender: undefined,
      appointmentReason: "",
      preferredDate: "",
      preferredTime: "",
    },
  });

  const onSubmit = async (data: VetAppointmentFormData) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Integrate with backend API/Supabase
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Appointment Data:", {
        ...data,
        vetId: vetDetails?.id,
        vetName: vetDetails?.name,
        clinic: vetDetails?.clinic,
      });

      toast({
        title: "Appointment Requested!",
        description: `Your appointment with ${vetDetails?.name || "the veterinarian"} has been requested. We'll confirm shortly.`,
      });

      // Redirect to user dashboard or confirmation page
      navigate("/user-dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
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
