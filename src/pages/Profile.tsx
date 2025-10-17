import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, User, Mail, Phone, Shield } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [hasPets, setHasPets] = useState(false);
  const [checkingPets, setCheckingPets] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Load roles
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (rolesData) {
        setRoles(rolesData.map(r => r.role));
        
        // If user is a host, check if they have registered pets
        if (rolesData.some(r => r.role === 'host')) {
          setCheckingPets(true);
          const { data: petsData } = await supabase
            .from("pets")
            .select("id")
            .eq("host_id", session.user.id)
            .limit(1);
          
          setHasPets(petsData && petsData.length > 0);
          setCheckingPets(false);
        }
      }
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-2xl shadow-medium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Profile</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-base font-medium">
                    {profile?.full_name || "Not provided"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-base">{user.email}</span>
                </div>
              </div>

              {profile?.phone && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base">{profile.phone}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Role Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Account Status</label>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <Badge key={role} variant="secondary" className="capitalize">
                        Signed in as {role}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-base">Regular User</span>
                  )}
                </div>
              </div>
            </div>

            {/* Host Dashboard Link */}
            {roles.includes("host") && (
              <div className="space-y-3">
                {!hasPets && !checkingPets && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="mb-2 text-sm font-medium">Register your pet to start hosting!</p>
                    <p className="mb-3 text-xs text-muted-foreground">
                      You haven't registered any pets yet. Add your pet to start offering pet experiences.
                    </p>
                    <Button
                      onClick={() => navigate("/register-pet")}
                      className="w-full"
                    >
                      Register Your Pet
                    </Button>
                  </div>
                )}
                
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="mb-2 text-sm font-medium">You're a verified host!</p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/become-host")}
                    className="w-full"
                  >
                    View Host Application
                  </Button>
                </div>
              </div>
            )}

            {/* Sign Out Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleSignOut}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
