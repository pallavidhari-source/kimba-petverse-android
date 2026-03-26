import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, Globe, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DiagnosticCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  website?: string;
  services: string[];
  rating?: number;
}

export default function DiagnosticCenters() {
  const [centers, setCenters] = useState<DiagnosticCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://diagnopet.com/api/centers', {
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) {
        setCenters(getMockCenters());
        return;
      }
      const data = await response.json();
      setCenters(data.centers || getMockCenters());
    } catch (error) {
      console.error('Failed to fetch centers:', error);
      setCenters(getMockCenters());
    } finally {
      setLoading(false);
    }
  };

  const getMockCenters = (): DiagnosticCenter[] => [
    {
      id: '1',
      name: 'PetCare Diagnostics Lab',
      address: '123 Pet Street',
      city: 'New York',
      phone: '+1-800-PET-LAB1',
      website: 'https://diagnopet.com',
      services: ['Blood Tests', 'Urinalysis', 'Imaging'],
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Vet Pathology Center',
      address: '456 Animal Ave',
      city: 'Los Angeles',
      phone: '+1-800-VET-PATH',
      website: 'https://diagnopet.com',
      services: ['Pathology', 'Cytology', 'Histopathology'],
      rating: 4.6,
    },
    {
      id: '3',
      name: 'Advanced Pet Lab',
      address: '789 Clinic Dr',
      city: 'Chicago',
      phone: '+1-800-ADV-PETS',
      website: 'https://diagnopet.com',
      services: ['Blood Tests', 'Allergy Testing', 'Genetics'],
      rating: 4.7,
    },
    {
      id: '4',
      name: 'Precision Vet Diagnostics',
      address: '321 Medical Ln',
      city: 'Houston',
      phone: '+1-800-PREC-VET',
      website: 'https://diagnopet.com',
      services: ['All Tests', 'Emergency Service', 'Consultation'],
      rating: 4.9,
    },
  ];

  const filteredCenters = centers.filter(
    (center) =>
      (center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.address.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (cityFilter === '' || center.city.toLowerCase() === cityFilter.toLowerCase())
  );

  const uniqueCities = Array.from(new Set(centers.map((c) => c.city))).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/vet-diagnostics">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Diagnostics
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-2">Diagnostic Centers</h1>
      <p className="text-muted-foreground mb-6">Find certified diagnostic labs near you</p>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or address..."
            className="w-full pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring"
          />
        </div>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-4 py-2 rounded-md border focus:outline-none focus:ring"
        >
          <option value="">All Cities</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <Button onClick={fetchCenters} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <div className="space-y-4">
        {filteredCenters.map((center) => (
          <div key={center.id} className="rounded-lg border bg-card p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{center.name}</h3>
              {center.rating && (
                <div className="bg-amber-100 px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ {center.rating}
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{center.address}, {center.city}</span>
              </div>
              {center.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${center.phone}`} className="hover:text-primary">{center.phone}</a>
                </div>
              )}
              {center.website && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <a href={center.website} target="_blank" rel="noreferrer" className="hover:text-primary">
                    Visit Website
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {center.services.map((service) => (
                <span key={service} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {service}
                </span>
              ))}
            </div>

            <Button className="w-full">Book Appointment</Button>
          </div>
        ))}
      </div>

      {filteredCenters.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No centers found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
