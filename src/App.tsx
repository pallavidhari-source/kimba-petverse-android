import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner, toast } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { useEffect } from "react";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Auth from "./pages/Auth";
import Adopt from "./pages/Adopt";
import BuyPets from "./pages/BuyPets";
import Shop from "./pages/Shop";
import Vets from "./pages/Vets";
import BookVetAppointment from "./pages/BookVetAppointment";
import Grooming from "./pages/Grooming";
import Cafes from "./pages/Cafes";
import BecomeHost from "./pages/BecomeHost";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import RegisterPet from "./pages/RegisterPet";
import HostDashboard from "./pages/HostDashboard";
import UserDashboard from "./pages/UserDashboard";
import PetAirbnb from "./pages/PetAirbnb";
import PetCemeteries from "./pages/PetCemeteries";
import PetParties from "./pages/PetParties";
import NotFound from "./pages/NotFound";
import CreatePetStay from "./pages/CreatePetStay";
import ProductDetail from "./pages/ProductDetail";
import EthnicWear from "./pages/EthnicWear";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import kimbaLogo from "./assets/kimba-logo.png";

const queryClient = new QueryClient();

// Component to handle route changes and dismiss toasts
const RouteChangeHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Dismiss all toasts when route changes
    toast.dismiss();
    
    // Hide backdrop
    const backdrop = document.getElementById('toast-backdrop');
    if (backdrop) {
      backdrop.style.display = 'none';
    }
  }, [location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <img 
          src={kimbaLogo} 
          alt="Kimba Watermark" 
          className="w-96 h-96 object-contain opacity-[0.08]"
        />
      </div>
      <BrowserRouter>
        <RouteChangeHandler />
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/adopt" element={<Adopt />} />
          <Route path="/buy-pets" element={<BuyPets />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/ethnic-wear" element={<EthnicWear />} />
          <Route path="/vets" element={<Vets />} />
          <Route path="/book-vet-appointment" element={<BookVetAppointment />} />
          <Route path="/grooming" element={<Grooming />} />
          <Route path="/cafes" element={<Cafes />} />
          <Route path="/pet-airbnb" element={<PetAirbnb />} />
          <Route path="/pet-cemeteries" element={<PetCemeteries />} />
          <Route path="/pet-parties" element={<PetParties />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/become-host" element={<BecomeHost />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register-pet" element={<RegisterPet />} />
          <Route path="/host-dashboard" element={<HostDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/create-pet-stay" element={<CreatePetStay />} />
          <Route path="/ethnic-wear" element={<EthnicWear />} />
          <Route path="/product/:handle" element={<ProductDetail />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
