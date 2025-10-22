import { MapPin, Star, Heart, User, Phone, Mail, Calendar, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PetCardProps {
  id: string;
  name: string;
  breed: string;
  type: string;
  location: string;
  rating: number;
  reviewsCount: number;
  pricePerHour: number;
  imageUrl: string;
  isVaccinated: boolean;
  isKidFriendly: boolean;
  temperament: string;
  hostId?: string;
}

export const PetCard = ({
  id,
  name,
  breed,
  location,
  rating,
  reviewsCount,
  pricePerHour,
  imageUrl,
  isVaccinated,
  isKidFriendly,
  temperament,
  hostId,
}: PetCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hostProfile, setHostProfile] = useState<any>(null);
  const [hostApplication, setHostApplication] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
    if (hostId) {
      fetchHostDetails();
    }
  }, [hostId]);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      
      setIsAdmin(roles?.some(r => r.role === "admin") || false);
    }
  };

  const fetchHostDetails = async () => {
    if (!hostId) return;
    
    // Fetch host profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", hostId)
      .single();
    
    setHostProfile(profile);

    // Fetch host application details
    const { data: application } = await supabase
      .from("host_applications")
      .select("*")
      .eq("user_id", hostId)
      .single();
    
    setHostApplication(application);
  };

  const HostDetailsHover = ({ children }: { children: React.ReactNode }) => {
    if (!isAdmin || !hostProfile) {
      return <>{children}</>;
    }

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          {children}
        </HoverCardTrigger>
        <HoverCardContent className="w-96" align="start" side="right">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{hostProfile.full_name || "Host"}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Host
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {hostProfile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{hostProfile.phone}</span>
                </div>
              )}
              
              {hostProfile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span>{hostProfile.location}</span>
                </div>
              )}

              {hostApplication && (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>Joined: {new Date(hostApplication.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge variant={hostApplication.status === "approved" ? "default" : "secondary"}>
                      {hostApplication.status}
                    </Badge>
                  </div>

                  {hostApplication.pet_name && (
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-1">Pet Details</p>
                      <p className="font-medium">{hostApplication.pet_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {hostApplication.pet_type} • {hostApplication.pet_gender}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <Button 
              onClick={(e) => {
                e.preventDefault();
                navigate(`/admin`);
              }}
              className="w-full"
              size="sm"
            >
              View Details
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  return (
    <HostDetailsHover>
      <Link to={`/pet/${id}`}>
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-medium">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>
          <CardContent className="p-4">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{name}</h3>
                <p className="text-sm text-muted-foreground">{breed}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-medium">
                  {rating} ({reviewsCount})
                </span>
              </div>
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {isVaccinated && (
                <Badge variant="secondary" className="text-xs">
                  Vaccinated
                </Badge>
              )}
              {isKidFriendly && (
                <Badge variant="secondary" className="text-xs">
                  Kid-friendly
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {temperament}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">₹{pricePerHour}</div>
                <div className="text-xs text-muted-foreground">per hour</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </HostDetailsHover>
  );
};