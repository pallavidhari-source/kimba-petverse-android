import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DiagnosticTest {
  id: string;
  name: string;
  category: string;
  description: string;
  price?: string;
  turnaround?: string;
  url?: string;
}

export default function DiagnosticTests() {
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://diagnopet.com/api/tests', {
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) {
        setTests(getMockTests());
        return;
      }
      const data = await response.json();
      setTests(data.tests || getMockTests());
    } catch (error) {
      console.error('Failed to fetch tests:', error);
      setTests(getMockTests());
    } finally {
      setLoading(false);
    }
  };

  const getMockTests = (): DiagnosticTest[] => [
    {
      id: '1',
      name: 'Complete Blood Count (CBC)',
      category: 'Hematology',
      description: 'Comprehensive blood cell analysis for dogs and cats',
      price: '$45-65',
      turnaround: '24-48 hours',
      url: 'https://diagnopet.com/test/cbc',
    },
    {
      id: '2',
      name: 'Comprehensive Metabolic Panel',
      category: 'Chemistry',
      description: 'Tests kidney, liver, and metabolic function',
      price: '$60-85',
      turnaround: '24-48 hours',
      url: 'https://diagnopet.com/test/cmp',
    },
    {
      id: '3',
      name: 'Thyroid Function (T4/TSH)',
      category: 'Endocrinology',
      description: 'Evaluate thyroid hormone levels',
      price: '$35-50',
      turnaround: '24 hours',
      url: 'https://diagnopet.com/test/thyroid',
    },
    {
      id: '4',
      name: 'Urinalysis',
      category: 'Urinalysis',
      description: 'Complete urine analysis for infection and disease screening',
      price: '$25-40',
      turnaround: '24 hours',
      url: 'https://diagnopet.com/test/urinalysis',
    },
    {
      id: '5',
      name: 'Fecal Exam (Parasite Screen)',
      category: 'Parasitology',
      description: 'Screening for intestinal parasites',
      price: '$20-35',
      turnaround: '24-48 hours',
      url: 'https://diagnopet.com/test/fecal',
    },
  ];

  const filteredTests = tests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/vet-diagnostics">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Diagnostics
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-2">Diagnostic Tests</h1>
      <p className="text-muted-foreground mb-6">Browse available tests from certified labs</p>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tests by name or category..."
            className="w-full pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring"
          />
        </div>
        <Button onClick={fetchTests} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredTests.map((test) => (
          <div key={test.id} className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-all">
            <div className="mb-2">
              <h3 className="font-semibold text-lg">{test.name}</h3>
              <p className="text-sm text-blue-600">{test.category}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{test.description}</p>
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              {test.price && (
                <div>
                  <span className="font-medium">Price:</span>
                  <p className="text-green-600">{test.price}</p>
                </div>
              )}
              {test.turnaround && (
                <div>
                  <span className="font-medium">Turnaround:</span>
                  <p>{test.turnaround}</p>
                </div>
              )}
            </div>
            {test.url && (
              <a href={test.url} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <ExternalLink className="h-3 w-3" />
                  Learn More
                </Button>
              </a>
            )}
          </div>
        ))}
      </div>

      {filteredTests.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tests found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}
