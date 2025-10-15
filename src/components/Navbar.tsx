import { Heart, Menu, User, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-hero">
            <Heart className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Kimba Petverse</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
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
            <Link to="/profile">
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </Link>
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
                <Link to="/profile">
                  <Button variant="outline" className="w-full">
                    Profile
                  </Button>
                </Link>
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