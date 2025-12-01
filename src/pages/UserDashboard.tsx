import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, DollarSign, User, PawPrint, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

const UserDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [vetAppointments, setVetAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Check if there's a new appointment from the booking page
    if (location.state?.newAppointment) {
      setVetAppointments(prev => [location.state.newAppointment, ...prev]);
    }
  }, [location.state]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in to view your dashboard");
      navigate("/auth");
      return;
    }
    setUser(session.user);
    fetchBookings(session.user.id);
  };

  const fetchBookings = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          pets (
            id,
            name,
            breed,
            type,
            image_url,
            host_id
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch host profiles separately
      if (data && data.length > 0) {
        const hostIds = [...new Set(data.map(b => b.pets?.host_id).filter(Boolean))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, phone, location")
          .in("id", hostIds);

        // Map profiles to bookings
        const bookingsWithProfiles = data.map(booking => ({
          ...booking,
          hostProfile: profiles?.find(p => p.id === booking.pets?.host_id)
        }));

        setBookings(bookingsWithProfiles);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const filterBookings = (status: string) => {
    if (status === "all") return bookings;
    return bookings.filter((b) => b.status === status);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">My Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your pet experience bookings and vet appointments
          </p>
        </div>

        <Tabs defaultValue={location.state?.showAppointments ? "vet-appointments" : "all"} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="vet-appointments">Vet Appointments</TabsTrigger>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="vet-appointments" className="space-y-4">
            {vetAppointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {vetAppointments.map((appointment, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            {appointment.vetName}
                          </CardTitle>
                          <CardDescription>
                            {appointment.vetSpecialization} • {appointment.clinic}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {appointment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="border-b pb-3">
                        <p className="text-xs text-muted-foreground mb-1">Pet Details</p>
                        <div className="flex items-center gap-2 text-sm">
                          <PawPrint className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.petName} ({appointment.petType}) - {appointment.petGender}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.petParentName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.fullPhoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.preferredDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.preferredTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.clinicLocation}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Reason for Visit</p>
                        <p className="text-sm">{appointment.appointmentReason}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <PawPrint className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground mb-2">
                  No vet appointments found
                </p>
                <Button onClick={() => navigate("/vets")}>
                  Book Vet Appointment
                </Button>
              </div>
            )}
          </TabsContent>

          {["all", "pending", "confirmed", "completed"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : filterBookings(status).length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {filterBookings(status).map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {booking.pets?.image_url && (
                              <img
                                src={booking.pets.image_url}
                                alt={booking.pets.name}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <CardTitle className="text-xl">
                                {booking.pets?.name || "Pet"}
                              </CardTitle>
                              <CardDescription>
                                {booking.pets?.breed} • {booking.pets?.type}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(booking.booking_date), "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {booking.start_time} - {booking.end_time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">₹{booking.total_price}</span>
                        </div>
                        {booking.hostProfile && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Host Details</p>
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.hostProfile.full_name}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`/pet/${booking.pet_id}`)}
                          >
                            <PawPrint className="h-3 w-3 mr-1" />
                            View Pet
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <PawPrint className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground mb-2">
                    No {status !== "all" ? status : ""} bookings found
                  </p>
                  <Button onClick={() => navigate("/explore")}>
                    Explore Pet Experiences
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
