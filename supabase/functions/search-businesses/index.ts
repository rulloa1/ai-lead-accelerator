// Google Places API Edge Function

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  business_status?: string;
  types?: string[];
  user_ratings_total?: number;
  rating?: number;
  opening_hours?: {
    open_now?: boolean;
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface PlaceDetails {
  website?: string;
  formatted_phone_number?: string;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    const { query, location, industry, maxResults = 20 } = await req.json();

    if (!query && !industry) {
      throw new Error('Query or industry is required');
    }

    // Build search query
    const searchQuery = query || `${industry} businesses`;
    const locationParam = location ? `in ${location}` : '';
    const fullQuery = `${searchQuery} ${locationParam}`.trim();

    console.log('Searching for:', fullQuery);

    // Text Search API
    const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    searchUrl.searchParams.set('query', fullQuery);
    searchUrl.searchParams.set('key', apiKey);

    const searchResponse = await fetch(searchUrl.toString());
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      console.error('Google Places error:', searchData);
      throw new Error(`Google Places API error: ${searchData.status}`);
    }

    const places: PlaceResult[] = (searchData.results || []).slice(0, maxResults);

    // Fetch details for each place to get website and reviews count
    const businessesWithDetails = await Promise.all(
      places.map(async (place) => {
        try {
          const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
          detailsUrl.searchParams.set('place_id', place.place_id);
          detailsUrl.searchParams.set('fields', 'website,formatted_phone_number,reviews');
          detailsUrl.searchParams.set('key', apiKey);

          const detailsResponse = await fetch(detailsUrl.toString());
          const detailsData = await detailsResponse.json();
          const details: PlaceDetails = detailsData.result || {};

          // Calculate online presence score (0-100)
          // Lower score = less online presence = better lead opportunity
          const reviewCount = place.user_ratings_total || 0;
          const hasWebsite = !!details.website;
          const rating = place.rating || 0;

          // Score factors (lower = less presence)
          let presenceScore = 0;
          
          // Reviews impact (0-40 points)
          if (reviewCount > 100) presenceScore += 40;
          else if (reviewCount > 50) presenceScore += 30;
          else if (reviewCount > 20) presenceScore += 20;
          else if (reviewCount > 5) presenceScore += 10;
          else presenceScore += 0;

          // Website impact (0-30 points)
          if (hasWebsite) presenceScore += 30;

          // Rating impact (0-30 points)
          if (rating >= 4.5) presenceScore += 30;
          else if (rating >= 4.0) presenceScore += 20;
          else if (rating >= 3.0) presenceScore += 10;
          else presenceScore += 0;

          // Quality score for lead (inverse of presence - less presence = better opportunity)
          const qualityScore = Math.max(0, 100 - presenceScore);

          // Map types to industry
          const typeToIndustry: Record<string, string> = {
            restaurant: 'Restaurant',
            food: 'Restaurant',
            cafe: 'Restaurant',
            lawyer: 'Legal Services',
            law: 'Legal Services',
            real_estate_agency: 'Real Estate',
            doctor: 'Healthcare',
            dentist: 'Healthcare',
            health: 'Healthcare',
            store: 'Retail',
            shop: 'Retail',
            gym: 'Fitness',
            spa: 'Beauty & Wellness',
            beauty_salon: 'Beauty & Wellness',
            hair_care: 'Beauty & Wellness',
            accounting: 'Financial Services',
            insurance_agency: 'Financial Services',
            car_dealer: 'Automotive',
            car_repair: 'Automotive',
            lodging: 'Hospitality',
            hotel: 'Hospitality',
          };

          let detectedIndustry = 'Other';
          for (const type of place.types || []) {
            if (typeToIndustry[type]) {
              detectedIndustry = typeToIndustry[type];
              break;
            }
          }

          // Estimate company size based on review count
          let size = '1-10 employees';
          if (reviewCount > 500) size = '51-200 employees';
          else if (reviewCount > 200) size = '11-50 employees';
          else if (reviewCount > 50) size = '11-50 employees';

          return {
            id: place.place_id,
            businessName: place.name,
            industry: industry || detectedIndustry,
            location: place.formatted_address,
            size,
            website: details.website || 'No website',
            email: '', // Not available from Google Places
            phone: details.formatted_phone_number || '',
            contactName: '',
            qualityScore,
            status: 'new' as const,
            googleReviews: reviewCount,
            googleRating: rating,
            hasWebsite,
            notes: [],
            contactHistory: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        } catch (error) {
          console.error('Error fetching details for', place.name, error);
          return null;
        }
      })
    );

    // Filter out nulls and sort by quality score (higher = less online presence = better lead)
    const validBusinesses = businessesWithDetails
      .filter(Boolean)
      .sort((a, b) => (b?.qualityScore || 0) - (a?.qualityScore || 0));

    console.log(`Found ${validBusinesses.length} businesses`);

    return new Response(
      JSON.stringify({
        success: true,
        data: validBusinesses,
        total: validBusinesses.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search businesses',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
