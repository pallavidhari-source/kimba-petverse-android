import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Heart } from "lucide-react";

const PetCemeteries = () => {
  const cemeteries: any[] = [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Pet Cemeteries</h1>
          <p className="text-lg text-muted-foreground">
            Honoring the memory of our beloved companions with dignity and love
          </p>
        </div>

        {cemeteries.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No cemeteries listed yet</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cemeteries.map((cemetery) => (
              <Card key={cemetery.id} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={cemetery.image}
                    alt={cemetery.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    {cemetery.name}
                  </CardTitle>
                  <CardDescription>{cemetery.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{cemetery.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{cemetery.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{cemetery.hours}</span>
                  </div>
                  <div className="pt-2">
                    <p className="mb-2 text-sm font-semibold">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {cemetery.services.map((service: string, index: number) => (
                        <span
                          key={index}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full mt-4">Contact Cemetery</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PetCemeteries;
