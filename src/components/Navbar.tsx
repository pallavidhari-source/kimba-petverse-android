import { Menu, User, Wallet, LogOut, Phone, Shield, ChevronDown, Home, PawPrint, ShoppingBag, Stethoscope, Scissors, Coffee, Hotel, Heart, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { toast } from "sonner";
import kimbaLogo from "@/assets/kimba-logo.png";
import { CartDrawer } from "@/components/CartDrawer";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isHost, setIsHost] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [logoClicked, setLogoClicked] = useState(false);

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
          <img 
            src={kimbaLogo} 
            alt="Kimba Petverse" 
            className={`h-12 w-12 rounded-xl object-cover shadow-md transition-transform duration-300 cursor-pointer ${logoClicked ? 'scale-125' : 'hover:scale-110'}`}
            onClick={(e) => {
              e.preventDefault();
              setLogoClicked(true);
              setTimeout(() => {
                setLogoClicked(false);
                navigate('/');
              }, 300);
            }}
          />
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Kimba Petverse</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 lg:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Experiences */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">
                  <PawPrint className="h-4 w-4 mr-1" />
                  Experiences
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-card">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/explore"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <PawPrint className="h-4 w-4" />
                            Pet Experience
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Spend quality time with pets
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/adopt"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <Heart className="h-4 w-4" />
                            Adopt a Pet
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Find your forever companion
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/buy-pets"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <ShoppingBag className="h-4 w-4" />
                            Buy Pets
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse pets for sale
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/shop"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <ShoppingBag className="h-4 w-4" />
                            Pet Shop
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Products and accessories
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Services */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">
                  <Stethoscope className="h-4 w-4 mr-1" />
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-card">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/vets"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <Stethoscope className="h-4 w-4" />
                            Veterinary Care
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Expert healthcare for pets
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/grooming"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <Scissors className="h-4 w-4" />
                            Grooming
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Professional pet grooming
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Stays & Events */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">
                  <Hotel className="h-4 w-4 mr-1" />
                  Stays & Events
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-card">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/pet-airbnb"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <Hotel className="h-4 w-4" />
                            Kimba Pet Stays
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Pet-friendly accommodations
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/pet-parties"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <PartyPopper className="h-4 w-4" />
                            Pet Pawrties
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Celebrate with your pets
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/pet-cemeteries"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <Heart className="h-4 w-4" />
                            Pet Memorial
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Honor your beloved companions
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/cafes"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <Coffee className="h-4 w-4" />
                            Pet Cafes
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Enjoy coffee with furry friends
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Become Host */}
              <NavigationMenuItem>
                <Link to="/become-host" className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md bg-primary/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50")}>
                  <Home className="h-4 w-4 mr-1" />
                  Become Host
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {user && (
              <Link to="/wallet">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Wallet className="h-4 w-4" />
                  <span className="hidden xl:inline">Wallet</span>
                </Button>
              </Link>
            )}
            {user ? (
              <>
                {isHost ? (
                  <Link to="/host-dashboard">
                    <Button variant="ghost" size="sm">
                      <span className="hidden xl:inline">Host Dashboard</span>
                      <span className="xl:hidden">Dashboard</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/user-dashboard">
                    <Button variant="ghost" size="sm">
                      <span className="hidden xl:inline">My Dashboard</span>
                      <span className="xl:hidden">Dashboard</span>
                    </Button>
                  </Link>
                )}
                <CartDrawer />
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
              <>
                <CartDrawer />
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <CartDrawer />
          {user ? (
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
          ) : null}
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <div className="flex flex-col gap-6 pt-8">
              {/* Experiences Section */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Experiences
                </h3>
                <div className="flex flex-col gap-2">
                  <Link to="/explore" className="flex items-center gap-2 text-base font-medium hover:text-primary transition-colors">
                    <PawPrint className="h-4 w-4" />
                    Pet Experience
                  </Link>
                  <Link to="/adopt" className="flex items-center gap-2 text-base font-medium hover:text-primary transition-colors">
                    <Heart className="h-4 w-4" />
                    Adopt a Pet
                  </Link>
                  <Link to="/buy-pets" className="flex items-center gap-2 text-base font-medium hover:text-primary transition-colors">
                    <ShoppingBag className="h-4 w-4" />
                    Buy Pets
                  </Link>
                  <Link to="/shop" className="flex items-center gap-2 text-base font-medium hover:text-primary transition-colors">
                    <ShoppingBag className="h-4 w-4" />
                    Pet Shop
                  </Link>
                </div>
              </div>

              {/* Services Section */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Services
                </h3>
                <div className="flex flex-col gap-2">
                  <Link to="/vets" className="flex items-center gap-2 text-base font-medium hover:text-primary transition-colors">
                    <Stethoscope className="h-4 w-4" />
                    Veterinary Care
                  </Link>
                  <Link to="/grooming" className="flex items-center gap-2 text-base font-medium hover:text-primary transition-colors">
                    <Scissors className="h-4 w-4" />
                    Grooming
                  </Link>
                </div>
              </div>

              {/* Stays & Events Section */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Stays & Events
                </h3>
                <div className="flex flex-col gap-2">
                  <Link to="/pet-airbnb" className="flex items-center gap-2 text-base font-medium hover:text-primary transition-colors">
                    <Hotel className="h-4 w-4" />
                    Kimba Pet Stays
                  </Link>
                  <Link to="/pet-parties" className="flex items-center gap-2 text-base font-medium hover:text-primary transition-colors">
                    <PartyPopper className="h-4 w-4" />
                    Pet Pawrties
                  </Link>
                  <Link to="/pet-cemeteries" className="flex items-center gap-2 text-base font-medium hover:text-primary transition-colors">
                    <Heart className="h-4 w-4" />
                    Pet Memorial
                  </Link>
                  <Link to="/cafes" className="flex items-center gap-2 text-base font-medium hover:text-primary transition-colors">
                    <Coffee className="h-4 w-4" />
                    Pet Cafes
                  </Link>
                </div>
              </div>

              {/* Become Host */}
              <Link to="/become-host">
                <Button className="w-full gap-2" variant="default">
                  <Home className="h-4 w-4" />
                  Become Host
                </Button>
              </Link>

              {/* User Actions */}
              {user && (
                <Link to="/wallet">
                  <Button variant="outline" className="w-full gap-2">
                    <Wallet className="h-4 w-4" />
                    Wallet
                  </Button>
                </Link>
              )}
              
              {user ? (
                <>
                  {isHost ? (
                    <Link to="/host-dashboard">
                      <Button variant="outline" className="w-full">
                        Host Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/user-dashboard">
                      <Button variant="outline" className="w-full">
                        My Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile">
                    <Button variant="outline" className="w-full">
                      Profile
                    </Button>
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    variant="destructive"
                    className="w-full gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
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
      </div>
    </nav>
  );
};