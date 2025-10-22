import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PawPrint, Plus, Pencil, Trash2, Loader2, MapPin, IndianRupee, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const timeSlots = [
  "6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM", "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM",
  "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM", "8:00 PM - 9:00 PM", "9:00 PM - 10:00 PM",
  "10:00 PM - 11:00 PM", "11:00 PM - 12:00 AM",
];

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  price_per_hour: number;
  location: string;
  available: boolean;
  is_vaccinated: boolean;
  is_trained: boolean;
  is_kid_friendly: boolean;
  image_url: string | null;
  created_at: string;
}

interface HostApplication {
  id: string;
  status: string;
  available_dates_slots?: Record<string, string[]>;
}

const HostDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<Pet[]>([]);
  const [hostApplication, setHostApplication] = useState<HostApplication | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showAvailabilityManager, setShowAvailabilityManager] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>();
  const [currentTimeSlots, setCurrentTimeSlots] = useState<string[]>([]);
  const [dateTimeSlotsMap, setDateTimeSlotsMap] = useState<Record<string, string[]>>({});

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to access host dashboard");
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
        toast.error("Access denied. Host verification required.");
        navigate("/");
        return;
      }

      await loadPets(session.user.id);
      await loadHostApplication(session.user.id);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadHostApplication = async (userId: string) => {
    const { data, error } = await supabase
      .from("host_applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Failed to load host application:", error);
      return;
    }

    if (data) {
      setHostApplication({
        id: data.id,
        status: data.status,
        available_dates_slots: data.available_dates_slots as Record<string, string[]> || {},
      });
      if (data.available_dates_slots) {
        setDateTimeSlotsMap(data.available_dates_slots as Record<string, string[]>);
      }
    }
  };

  const loadPets = async (userId: string) => {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("host_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load pets");
      return;
    }

    setPets(data || []);
  };

  const toggleTimeSlot = (slot: string) => {
    setCurrentTimeSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const addDateWithTimeSlots = async () => {
    if (!currentDate || currentTimeSlots.length === 0) {
      toast.error("Please select a date and at least one time slot");
      return;
    }

    const dateKey = format(currentDate, "yyyy-MM-dd");
    const updatedMap = {
      ...dateTimeSlotsMap,
      [dateKey]: currentTimeSlots,
    };

    setDateTimeSlotsMap(updatedMap);
    setCurrentDate(undefined);
    setCurrentTimeSlots([]);

    await updateAvailability(updatedMap);
    toast.success(`Availability added for ${format(currentDate, "PPP")}`);
  };

  const removeDateSlot = async (dateKey: string) => {
    const updatedMap = { ...dateTimeSlotsMap };
    delete updatedMap[dateKey];
    setDateTimeSlotsMap(updatedMap);
    
    await updateAvailability(updatedMap);
    toast.success("Date removed from availability");
  };

  const updateAvailability = async (availabilityMap: Record<string, string[]>) => {
    if (!hostApplication) return;

    const { error } = await supabase
      .from("host_applications")
      .update({ available_dates_slots: availabilityMap })
      .eq("id", hostApplication.id);

    if (error) {
      console.error("Error updating availability:", error);
      toast.error("Failed to update availability");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success("Pet experience deleted successfully");
      setPets(pets.filter(pet => pet.id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      console.error("Error deleting pet:", error);
      toast.error("Failed to delete pet experience");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 space-y-6">
        {/* Application Status */}
        {hostApplication && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Your host application status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={hostApplication.status === "approved" ? "default" : "secondary"}>
                  {hostApplication.status}
                </Badge>
              </div>
              {hostApplication.status === "pending" && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Your application is under review. You'll be able to set your availability after approval.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Availability Management (Only for approved hosts) */}
        {hostApplication?.status === "approved" && (
          <>
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Manage Your Availability</CardTitle>
                    <CardDescription>Set your available dates and time slots</CardDescription>
                  </div>
                  <Button
                    variant={showAvailabilityManager ? "outline" : "default"}
                    onClick={() => setShowAvailabilityManager(!showAvailabilityManager)}
                  >
                    {showAvailabilityManager ? "Hide" : "Set Availability"}
                  </Button>
                </div>
              </CardHeader>
              {showAvailabilityManager && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <CalendarComponent
                      mode="single"
                      selected={currentDate}
                      onSelect={setCurrentDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  {currentDate && (
                    <>
                      <div className="space-y-2">
                        <Label>Available Time Slots for {format(currentDate, "PPP")}</Label>
                        <div className="grid grid-cols-2 gap-2 rounded-lg border p-4">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => toggleTimeSlot(slot)}
                              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                                currentTimeSlots.includes(slot)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                        <Button
                          type="button"
                          onClick={addDateWithTimeSlots}
                          disabled={currentTimeSlots.length === 0}
                          className="w-full mt-2"
                        >
                          Add Date with Selected Time Slots
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Availability Schedule Table */}
            {Object.keys(dateTimeSlotsMap).length > 0 && (
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Your Availability Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Available Time Slots</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
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
                              <div className="flex flex-wrap gap-2">
                                {slots.map((slot, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {slot}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeDateSlot(dateKey)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Pet Experiences */}
        {hostApplication?.status === "approved" && (
          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <PawPrint className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Pet Experiences</CardTitle>
                    <CardDescription>Manage your registered pet experiences</CardDescription>
                  </div>
                </div>
                <Button onClick={() => navigate("/register-pet")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Pet Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pets.length === 0 ? (
                <div className="text-center py-12">
                  <PawPrint className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No pet experiences registered yet</p>
                  <Button onClick={() => navigate("/register-pet")}>
                    Register Your First Pet
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pets.map((pet) => (
                    <Card key={pet.id} className="overflow-hidden">
                      <div className="relative h-48 bg-muted">
                        {pet.image_url ? (
                          <img
                            src={pet.image_url}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PawPrint className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant={pet.available ? "default" : "secondary"}>
                            {pet.available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg">{pet.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {pet.breed} • {pet.age} years old
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <IndianRupee className="h-4 w-4 text-primary" />
                            <span className="font-medium">₹{pet.price_per_hour}/hour</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{pet.location}</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {pet.is_vaccinated && (
                              <Badge variant="secondary" className="text-xs">Vaccinated</Badge>
                            )}
                            {pet.is_trained && (
                              <Badge variant="secondary" className="text-xs">Trained</Badge>
                            )}
                            {pet.is_kid_friendly && (
                              <Badge variant="secondary" className="text-xs">Kid-Friendly</Badge>
                            )}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => navigate(`/edit-pet/${pet.id}`)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setDeleteId(pet.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pet Experience?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the pet experience
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HostDashboard;
