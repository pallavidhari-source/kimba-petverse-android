import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Heart, Shield, Star, Clock, Sparkles, Home, ShoppingBag, Stethoscope, Scissors, Coffee, Wallet } from "lucide-react";
import heroImage from "@/assets/hero-pets.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
                Experience Pet Love Without the Commitment
              </h1>
              <p className="text-lg text-primary-foreground/90 md:text-xl">
                Book 'Pet-for-a-Day' with verified hosts. Vet-checked pets at your home in Hyderabad.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/explore">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-lg">
                    Get Pet Experience
                  </Button>
                </Link>
                <Link to="/become-host">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto bg-background/20 backdrop-blur-sm border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all shadow-lg"
                  >
                    Become a Host
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                  <span className="text-sm text-primary-foreground">Verified Hosts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary-foreground" />
                  <span className="text-sm text-primary-foreground">Vet-Checked</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Happy family with pets"
                className="rounded-2xl shadow-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose Kimba Petverse?</h2>
            <p className="text-lg text-muted-foreground">
              The safest and most enjoyable way to experience pet companionship
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-soft">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Verified & Safe</h3>
              <p className="text-muted-foreground">
                All hosts are KYC verified and pets are vet-checked with up-to-date vaccinations
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-soft">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <Heart className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">At Your Home</h3>
              <p className="text-muted-foreground">
                Professional handlers bring pets to your location with complete safety kits
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-soft">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Flexible Booking</h3>
              <p className="text-muted-foreground">
                Choose your preferred time slots and enjoy hourly bookings that fit your schedule
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-card py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Be Petself?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of pet lovers experiencing joy without the long-term commitment
          </p>
          <Link to="/explore">
            <Button size="lg">Start Your Pet Experience</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;