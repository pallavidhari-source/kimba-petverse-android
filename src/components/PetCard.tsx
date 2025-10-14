import { MapPin, Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";

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
}: PetCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
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
  );
};