import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_SEARCH_API_KEY');
    const SEARCH_ENGINE_ID = Deno.env.get('GOOGLE_SEARCH_ENGINE_ID');

    if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
      throw new Error('Missing Google Search API credentials');
    }

    // Search queries for different types of pets in Hyderabad
    const queries = [
      'dog adoption Hyderabad India',
      'cat adoption Hyderabad India',
      'pet adoption near Hyderabad',
    ];

    const allResults = [];

    for (const query of queries) {
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=3`;
      
      console.log(`Searching for: ${query}`);
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        console.error(`Search failed for query "${query}":`, await response.text());
        continue;
      }

      const data = await response.json();
      
      if (data.items) {
        allResults.push(...data.items);
      }
    }

    console.log(`Found ${allResults.length} search results`);

    // Transform search results into pet adoption data
    const pets = allResults.slice(0, 6).map((item, index) => {
      // Extract potential pet info from snippets
      const snippet = item.snippet || '';
      const title = item.title || '';
      
      // Try to determine pet type from content
      const isDog = snippet.toLowerCase().includes('dog') || snippet.toLowerCase().includes('puppy') || title.toLowerCase().includes('dog');
      const isCat = snippet.toLowerCase().includes('cat') || snippet.toLowerCase().includes('kitten') || title.toLowerCase().includes('cat');
      
      // Common Hyderabad areas
      const locations = [
        'Banjara Hills, Hyderabad',
        'Jubilee Hills, Hyderabad',
        'Gachibowli, Hyderabad',
        'Madhapur, Hyderabad',
        'Hitech City, Hyderabad',
        'Kondapur, Hyderabad',
      ];

      return {
        id: index + 1,
        name: title.split('-')[0].trim().substring(0, 30),
        breed: isDog ? 'Indian Pariah' : isCat ? 'Indian Domestic' : 'Mixed Breed',
        age: ['Puppy', 'Young', 'Adult', '2 years', '3 years'][index % 5],
        gender: index % 2 === 0 ? 'male' : 'female',
        isNeutered: index % 3 === 0,
        isSpayed: index % 3 === 1,
        location: locations[index % locations.length],
        description: snippet.substring(0, 100),
        link: item.link,
        source: item.displayLink,
      };
    });

    return new Response(
      JSON.stringify({ pets }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in fetch-adoption-pets function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
