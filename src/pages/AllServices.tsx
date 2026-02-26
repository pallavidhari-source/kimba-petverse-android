import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Heart, ShoppingBag, Stethoscope, Scissors, Coffee, Home, Users, Dog, Search, MapPin, PartyPopper, Footprints, BookOpen, UtensilsCrossed, Activity, MessageCircle, UserPlus, Store, Shirt, Info, Phone, LogIn, User, LayoutDashboard, PawPrint } from "lucide-react";

const sections = [
  {
    title: "🐾 Pets",
    items: [
      { label: "Explore Pets", path: "/explore", icon: Search, color: "bg-blue-100 text-blue-600" },
      { label: "Adopt a Pet", path: "/adopt", icon: Heart, color: "bg-pink-100 text-pink-600" },
      { label: "Buy Pets", path: "/buy-pets", icon: Dog, color: "bg-amber-100 text-amber-600" },
      { label: "Pet Adoption", path: "/pet-adoption", icon: PawPrint, color: "bg-rose-100 text-rose-600" },
      { label: "Register Your Pet", path: "/register-pet", icon: UserPlus, color: "bg-teal-100 text-teal-600" },
      { label: "Breed Database", path: "/breed-database", icon: BookOpen, color: "bg-indigo-100 text-indigo-600" },
    ],
  },
  {
    title: "🏥 Services",
    items: [
      { label: "Vets", path: "/vets", icon: Stethoscope, color: "bg-emerald-100 text-emerald-600" },
      { label: "Book Vet Appointment", path: "/book-vet-appointment", icon: Stethoscope, color: "bg-green-100 text-green-600" },
      { label: "Vet Finder", path: "/vet-finder", icon: MapPin, color: "bg-cyan-100 text-cyan-600" },
      { label: "Grooming", path: "/grooming", icon: Scissors, color: "bg-purple-100 text-purple-600" },
      { label: "Pet Walkers", path: "/pet-walkers", icon: Footprints, color: "bg-orange-100 text-orange-600" },
      { label: "Become Pet Walker", path: "/pet-walker-signup", icon: Footprints, color: "bg-lime-100 text-lime-600" },
    ],
  },
  {
    title: "🏡 Stays & Events",
    items: [
      { label: "Pet Airbnb", path: "/pet-airbnb", icon: Home, color: "bg-sky-100 text-sky-600" },
      { label: "Pet Cafes", path: "/cafes", icon: Coffee, color: "bg-yellow-100 text-yellow-600" },
      { label: "Pet Parties", path: "/pet-parties", icon: PartyPopper, color: "bg-fuchsia-100 text-fuchsia-600" },
      { label: "Pet Cemeteries", path: "/pet-cemeteries", icon: Heart, color: "bg-gray-100 text-gray-600" },
      { label: "Create Pet Stay", path: "/create-pet-stay", icon: Home, color: "bg-violet-100 text-violet-600" },
    ],
  },
  {
    title: "🛍️ Shop",
    items: [
      { label: "Pet Shop", path: "/shop", icon: ShoppingBag, color: "bg-red-100 text-red-600" },
      { label: "Pet Shops Near You", path: "/pet-shops", icon: Store, color: "bg-amber-100 text-amber-600" },
      { label: "Ethnic Wear", path: "/ethnic-wear", icon: Shirt, color: "bg-pink-100 text-pink-600" },
    ],
  },
  {
    title: "📊 Pet Care Tools",
    items: [
      { label: "Health Tracker", path: "/health-tracker", icon: Activity, color: "bg-emerald-100 text-emerald-600" },
      { label: "Feeding Reminders", path: "/feeding-reminders", icon: UtensilsCrossed, color: "bg-orange-100 text-orange-600" },
      { label: "Community Forum", path: "/community", icon: MessageCircle, color: "bg-pink-100 text-pink-600" },
    ],
  },
  {
    title: "👤 Account",
    items: [
      { label: "Sign In / Sign Up", path: "/auth", icon: LogIn, color: "bg-blue-100 text-blue-600" },
      { label: "Profile", path: "/profile", icon: User, color: "bg-slate-100 text-slate-600" },
      { label: "User Dashboard", path: "/user-dashboard", icon: LayoutDashboard, color: "bg-indigo-100 text-indigo-600" },
      { label: "Host Dashboard", path: "/host-dashboard", icon: LayoutDashboard, color: "bg-teal-100 text-teal-600" },
      { label: "Become a Host", path: "/become-host", icon: Users, color: "bg-green-100 text-green-600" },
      { label: "Admin Panel", path: "/admin", icon: LayoutDashboard, color: "bg-red-100 text-red-600" },
    ],
  },
  {
    title: "ℹ️ Info",
    items: [
      { label: "About Us", path: "/about-us", icon: Info, color: "bg-blue-100 text-blue-600" },
      { label: "Contact Us", path: "/contact-us", icon: Phone, color: "bg-green-100 text-green-600" },
    ],
  },
];

export default function AllServices() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold md:text-4xl">All Services & Pages</h1>
          <p className="text-muted-foreground mt-2">Navigate to any section of Kimba Petverse</p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {sections.map(section => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {section.items.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-center"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
