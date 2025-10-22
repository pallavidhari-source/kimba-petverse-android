import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import kimbaLogo from "@/assets/kimba-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-card border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={kimbaLogo} alt="Kimba" className="h-10 w-10 rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Kimba Petverse
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted platform for all pet care needs - from finding sitters to booking stays and shopping for your furry friends.
            </p>
            <div className="flex gap-2 text-muted-foreground">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-sm">Made with love for pets</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about-us" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/become-host" className="text-muted-foreground hover:text-primary transition-colors">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-muted-foreground hover:text-primary transition-colors">
                  Explore Experiences
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pet-airbnb" className="text-muted-foreground hover:text-primary transition-colors">
                  Kimba Pet Stays
                </Link>
              </li>
              <li>
                <Link to="/vets" className="text-muted-foreground hover:text-primary transition-colors">
                  Veterinarians
                </Link>
              </li>
              <li>
                <Link to="/grooming" className="text-muted-foreground hover:text-primary transition-colors">
                  Pet Grooming
                </Link>
              </li>
              <li>
                <Link to="/cafes" className="text-muted-foreground hover:text-primary transition-colors">
                  Pet Cafes
                </Link>
              </li>
              <li>
                <Link to="/adopt" className="text-muted-foreground hover:text-primary transition-colors">
                  Adopt a Pet
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                  Pet Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-0.5" />
                <a href="mailto:hello@kimbapetverse.com" className="text-muted-foreground hover:text-primary transition-colors">
                  hello@kimbapetverse.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary mt-0.5" />
                <a href="tel:+911234567890" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  Hitech City, Madhapur<br />
                  Hyderabad, Telangana 500081
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kimba Petverse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
