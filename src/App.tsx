import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Auth from "./pages/Auth";
import Adopt from "./pages/Adopt";
import BuyPets from "./pages/BuyPets";
import Shop from "./pages/Shop";
import Vets from "./pages/Vets";
import Grooming from "./pages/Grooming";
import Cafes from "./pages/Cafes";
import BecomeHost from "./pages/BecomeHost";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import RegisterPet from "./pages/RegisterPet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/adopt" element={<Adopt />} />
          <Route path="/buy-pets" element={<BuyPets />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/vets" element={<Vets />} />
          <Route path="/grooming" element={<Grooming />} />
          <Route path="/cafes" element={<Cafes />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/become-host" element={<BecomeHost />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register-pet" element={<RegisterPet />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
