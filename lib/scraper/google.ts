import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";
import type { PlaceReview } from "@googlemaps/google-maps-services-js";

const client = new Client({});

const DETAIL_FIELDS = [
  "name",
  "rating",
  "user_ratings_total",
  "reviews",
  "website",
  "formatted_phone_number",
  "formatted_address",
  "opening_hours",
  "price_level",
] as const;

function extractThemes(reviews: PlaceReview[]): string[] {
  const text = reviews.map((r) => r.text ?? "").join(" ").toLowerCase();
  const themes: string[] = [];
  const keywords: Record<string, string[]> = {
    "wait times": ["wait", "slow", "queue", "long time"],
    "booking difficulty": ["hard to book", "cant book", "no availability", "difficult to book"],
    communication: ["no response", "ignored", "didnt reply", "communication"],
    "great results": ["amazing results", "transformed", "incredible", "love the results"],
    "friendly staff": ["friendly", "professional", "lovely staff"],
    "rude staff": ["rude", "unhelpful", "dismissive"],
    pricing: ["expensive", "overpriced", "great value", "worth it"],
    cleanliness: ["clean", "dirty", "spotless", "hygienic"],
  };
  for (const [theme, words] of Object.entries(keywords)) {
    if (words.some((w) => text.includes(w))) themes.push(theme);
  }
  return themes;
}

function buildReviewSummary(reviews: PlaceReview[], rating?: number, totalReviews?: number) {
  const positiveReviews = reviews.filter((r) => (r.rating ?? 0) >= 4);
  const negativeReviews = reviews.filter((r) => (r.rating ?? 5) <= 3);
  const positiveThemes = extractThemes(positiveReviews);
  const negativeThemes = extractThemes(negativeReviews);

  const lastReviewDate = reviews[0]?.time
    ? new Date(Number(reviews[0].time) * 1000).toISOString()
    : null;

  return {
    averageRating: rating ?? 0,
    totalReviews: totalReviews ?? 0,
    positiveThemes,
    negativeThemes,
    responseRate: 0,
    lastReviewDate,
    recentReviews: reviews.slice(0, 3).map((r) => ({
      rating: r.rating ?? 0,
      text: r.text ?? "",
      timeDescription: r.relative_time_description ?? "",
    })),
  };
}

export interface BusinessSearchResult {
  placeId: string;
  businessName: string;
  address: string;
  rating?: number;
  reviewCount?: number;
}

export async function searchBusinessesByNiche(
  niche: string,
  location: string,
  limit: number = 10
): Promise<BusinessSearchResult[]> {
  try {
    const response = await client.textSearch({
      params: {
        query: `${niche} ${location}`,
        key: process.env.GOOGLE_PLACES_API_KEY!,
      },
    });

    return (response.data.results ?? [])
      .slice(0, Math.min(limit, 20))
      .filter((r) => r.place_id && r.name)
      .map((r) => ({
        placeId: r.place_id!,
        businessName: r.name!,
        address: r.formatted_address ?? location,
        rating: r.rating,
        reviewCount: r.user_ratings_total,
      }));
  } catch (err) {
    console.error("[Google Text Search]", err);
    return [];
  }
}

export async function scrapeGoogleBusiness(
  businessName: string,
  location: string,
  placeId?: string
) {
  try {
    let resolvedPlaceId = placeId;

    if (!resolvedPlaceId) {
      const searchResponse = await client.findPlaceFromText({
        params: {
          input: `${businessName} ${location}`,
          inputtype: PlaceInputType.textQuery,
          fields: ["place_id"],
          key: process.env.GOOGLE_PLACES_API_KEY!,
        },
      });
      resolvedPlaceId = searchResponse.data.candidates?.[0]?.place_id;
    }

    if (!resolvedPlaceId) return null;

    const detailsResponse = await client.placeDetails({
      params: {
        place_id: resolvedPlaceId,
        fields: DETAIL_FIELDS as unknown as string[],
        key: process.env.GOOGLE_PLACES_API_KEY!,
      },
    });

    const place = detailsResponse.data.result;
    const reviews: PlaceReview[] = place.reviews ?? [];

    return {
      googlePlaceId: resolvedPlaceId,
      businessName: place.name ?? businessName,
      website: place.website,
      phone: place.formatted_phone_number,
      googleRating: place.rating,
      reviewCount: place.user_ratings_total,
      reviewSummary: buildReviewSummary(reviews, place.rating, place.user_ratings_total),
    };
  } catch (err) {
    console.error("[Google Place Details]", err);
    return null;
  }
}
