import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Users, Award, Globe, Sparkles } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            About Kimba Petverse
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Building a community where pets and their humans thrive together
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Kimba Petverse is on a mission to revolutionize pet care by creating a comprehensive ecosystem 
              where pet owners can access everything they need - from finding trusted pet sitters and groomers 
              to booking pet-friendly stays and purchasing quality pet products. We believe every pet deserves 
              exceptional care, and every pet owner deserves peace of mind.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Pet-First Approach</h3>
                <p className="text-muted-foreground">
                  Every decision we make prioritizes the health, happiness, and safety of pets
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trust & Safety</h3>
                <p className="text-muted-foreground">
                  Verified hosts, secure payments, and comprehensive insurance for complete peace of mind
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community-Driven</h3>
                <p className="text-muted-foreground">
                  Building meaningful connections between pet lovers, hosts, and service providers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Kimba Petverse was born from a simple yet powerful idea: what if there was a single platform 
                where pet owners could find everything they need to give their furry friends the best life possible?
              </p>
              <p>
                Founded by a team of passionate pet lovers who experienced firsthand the challenges of finding 
                reliable pet care services, we set out to create a comprehensive solution. We noticed that pet 
                owners were juggling multiple apps and websites - one for boarding, another for grooming, 
                a third for shopping, and so on.
              </p>
              <p>
                Today, Kimba Petverse brings together trusted pet sitters, professional groomers, veterinarians, 
                quality pet products, and unique experiences like pet-friendly accommodations and pet parties - 
                all in one place. We&apos;ve created a community where pet care providers are thoroughly vetted, 
                and pet owners can book services with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <Badge className="mb-3">Pet Experiences</Badge>
                <h3 className="text-xl font-semibold mb-2">Kimba Pet Stays</h3>
                <p className="text-muted-foreground">
                  Book trusted pet sitters and boarders who treat your pets like family. Verified hosts, 
                  real-time updates, and flexible booking options.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Badge className="mb-3">Shopping</Badge>
                <h3 className="text-xl font-semibold mb-2">Pet Marketplace</h3>
                <p className="text-muted-foreground">
                  Browse and purchase quality pets from certified breeders, plus premium pet supplies, 
                  food, toys, and accessories.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Badge className="mb-3">Services</Badge>
                <h3 className="text-xl font-semibold mb-2">Professional Care</h3>
                <p className="text-muted-foreground">
                  Connect with vetted veterinarians, groomers, and pet care specialists for all your 
                  pet&apos;s health and wellness needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Badge className="mb-3">Experiences</Badge>
                <h3 className="text-xl font-semibold mb-2">Pet Parties</h3>
                <p className="text-muted-foreground">
                  Celebrate special moments with your pets through our unique party and event planning services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Badge className="mb-3">Adoption</Badge>
                <h3 className="text-xl font-semibold mb-2">Rescue & Adoption</h3>
                <p className="text-muted-foreground">
                  Give a loving home to pets in need through our verified adoption and rescue network.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Badge className="mb-3">Community</Badge>
                <h3 className="text-xl font-semibold mb-2">Pet Social Spaces</h3>
                <p className="text-muted-foreground">
                  Discover pet-friendly cafes, cemeteries, and spaces where you can connect with fellow pet lovers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <p className="text-muted-foreground">Happy Pets</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Verified Hosts</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <p className="text-muted-foreground">Services Booked</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Kimba Petverse?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Verified & Trusted</h3>
                <p className="text-muted-foreground">
                  Every host and service provider goes through a rigorous verification process including 
                  background checks, reviews, and certifications.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">All-in-One Platform</h3>
                <p className="text-muted-foreground">
                  From daily care to special occasions, find everything your pet needs in one convenient place.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">
                  Book with confidence using our secure payment system with buyer protection and refund policies.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Our dedicated customer support team is always ready to help you and your pet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
