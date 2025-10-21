import { Menu, User, Wallet, LogOut, Mail, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import kimbaLogo from "@/assets/kimba-logo.png";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isHost, setIsHost] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkHostStatus(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkHostStatus(session.user.id);
      } else {
        setIsHost(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkHostStatus = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "host")
        .single();
      
      setIsHost(!!data);

      // Load profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Load all roles
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      
      console.log("Loaded user roles:", rolesData);
      
      if (rolesData) {
        setRoles(rolesData.map(r => r.role));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={kimbaLogo} alt="Kimba Petverse" className="h-12 w-12 rounded-xl object-cover shadow-md" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Kimba Petverse</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/explore" className="text-sm font-medium transition-colors hover:text-primary">
            Pet Airbnb
          </Link>
          <Link to="/adopt" className="text-sm font-medium transition-colors hover:text-primary">
            Adopt
          </Link>
          <Link to="/buy-pets" className="text-sm font-medium transition-colors hover:text-primary">
            Buy Pets
          </Link>
          <Link to="/shop" className="text-sm font-medium transition-colors hover:text-primary">
            Shop
          </Link>
          <Link to="/vets" className="text-sm font-medium transition-colors hover:text-primary">
            Vets
          </Link>
          <Link to="/grooming" className="text-sm font-medium transition-colors hover:text-primary">
            Grooming
          </Link>
          <Link to="/cafes" className="text-sm font-medium transition-colors hover:text-primary">
            Cafes
          </Link>
          {user && (
            <Link to="/wallet" className="text-sm font-medium transition-colors hover:text-primary">
              <Wallet className="inline h-4 w-4 mr-1" />
              Wallet
            </Link>
          )}
          {user ? (
            <>
              {isHost && (
                <Link to="/host-dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                  Host Dashboard
                </Link>
              )}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{profile?.full_name || "User"}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {profile?.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                      
                      {roles.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="h-3 w-3 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {roles.map((role) => (
                              <Badge key={role} variant="secondary" className="text-xs capitalize">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {isHost && (
                      <Button
                        variant="outline"
                        onClick={() => navigate("/register-pet")}
                        className="w-full"
                        size="sm"
                      >
                        Register Pet
                      </Button>
                    )}

                    <Button
                      onClick={handleSignOut}
                      variant="destructive"
                      className="w-full"
                      size="sm"
                    >
                      <LogOut className="mr-2 h-3 w-3" />
                      Sign Out
                    </Button>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </>
          ) : (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 pt-8">
              <Link to="/explore" className="text-lg font-medium">
                Pet Airbnb
              </Link>
              <Link to="/adopt" className="text-lg font-medium">
                Adopt
              </Link>
              <Link to="/buy-pets" className="text-lg font-medium">
                Buy Pets
              </Link>
              <Link to="/shop" className="text-lg font-medium">
                Shop
              </Link>
              <Link to="/vets" className="text-lg font-medium">
                Vets
              </Link>
              <Link to="/grooming" className="text-lg font-medium">
                Grooming
              </Link>
              <Link to="/cafes" className="text-lg font-medium">
                Cafes
              </Link>
              {user && (
                <Link to="/wallet" className="text-lg font-medium">
                  Wallet
                </Link>
              )}
              {user ? (
                <>
                  {isHost && (
                    <Link to="/host-dashboard" className="text-lg font-medium">
                      Host Dashboard
                    </Link>
                  )}
                  <Link to="/profile">
                    <Button variant="outline" className="w-full">
                      Profile
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/auth">
                  <Button className="w-full">Sign In</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};