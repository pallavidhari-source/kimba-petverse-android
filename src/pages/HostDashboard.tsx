import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PawPrint, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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

const HostDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<Pet[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    checkAuthAndLoadPets();
  }, []);

  const checkAuthAndLoadPets = async () => {
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
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
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
      <div className="container mx-auto px-4 py-16">
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
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Breed</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Price/Hour</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pets.map((pet) => (
                      <TableRow key={pet.id}>
                        <TableCell>
                          {pet.image_url ? (
                            <img
                              src={pet.image_url}
                              alt={pet.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                              <PawPrint className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{pet.name}</TableCell>
                        <TableCell className="capitalize">{pet.type}</TableCell>
                        <TableCell>{pet.breed}</TableCell>
                        <TableCell>{pet.age}y</TableCell>
                        <TableCell>₹{pet.price_per_hour}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{pet.location}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <Badge variant={pet.available ? "default" : "secondary"}>
                            {pet.available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => navigate(`/edit-pet/${pet.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setDeleteId(pet.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
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
