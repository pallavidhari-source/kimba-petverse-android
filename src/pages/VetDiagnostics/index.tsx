import React from 'react';
import { Link } from 'react-router-dom';
import { Microscope, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VetDiagnosticsHub() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Veterinary Diagnostics</h1>
      <p className="text-muted-foreground mb-8">Access comprehensive pet diagnostic tests and find certified centers near you</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tests Card */}
        <Link to="/vet-diagnostics/tests">
          <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <Microscope className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold">Diagnostic Tests</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Browse available pet diagnostic tests, descriptions, and pricing
            </p>
            <Button>View Tests →</Button>
          </div>
        </Link>

        {/* Test Centers Card */}
        <Link to="/vet-diagnostics/centers">
          <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <MapPin className="h-6 w-6 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold">Test Centers</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Find certified diagnostic centers and labs in your area
            </p>
            <Button>Find Centers →</Button>
          </div>
        </Link>
      </div>
    </div>
  );
}
