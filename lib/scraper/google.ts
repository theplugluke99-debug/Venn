import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";
import type { PlaceReview } from "@googlemaps/google-maps-services-js";

const client = new Client({});

function extractThemes(reviews: PlaceReview[]): string[] {
  const text = reviews.map((r) => r.text).join(" ").toLowerCase();
  const themes: string[] = [];
  const keywords: Record<string, string[]> = {
    "wait times": ["wait", "slow", "queue", "long time"],
    "booking difficulty": ["hard to book", "difficult to book", "couldnt book", "no availability"],
    communication: ["didnt reply", "no response", "ignored", "communication"],
    results: ["amazing results", "transformed", "incredible", "love the results"],
    staff: ["friendly", "professional", "rude", "lovely staff"],
    pricing: ["expensive", "worth it", "great value", "overpriced"],
  };
  for (const [theme, words] of Object.entries(keywords)) {
    if (words.some((w) => text.includes(w))) themes.push(theme);
  }
  return themes;
}

export async function scrapeGoogleBusiness(businessName: string, location: string) {
  const searchResponse = await client.findPlaceFromText({
    params: {
      input: `${businessName} ${location}`,
      inputtype: PlaceInputType.textQuery,
      fields: ["place_id", "name", "formatted_address", "rating", "user_ratings_total", "website", "formatted_phone_number"],
      key: process.env.GOOGLE_PLACES_API_KEY!,
    },
  });

  if (!searchResponse.data.candidates?.length) return null;

  const placeId = searchResponse.data.candidates[0].place_id!;

  const detailsResponse = await client.placeDetails({
    params: {
      place_id: placeId,
      fields: [
        "name",
        "rating",
        "user_ratings_total",
        "reviews",
        "website",
        "formatted_phone_number",
        "formatted_address",
        "opening_hours",
        "price_level",
      ],
      key: process.env.GOOGLE_PLACES_API_KEY!,
    },
  });

  const place = detailsResponse.data.result;
  const reviews: PlaceReview[] = place.reviews ?? [];

  const positiveThemes = extractThemes(reviews.filter((r) => r.rating >= 4));
  const negativeThemes = extractThemes(reviews.filter((r) => r.rating <= 3));
  const responseRate = reviews.filter((r) => r.author_name).length / Math.max(reviews.length, 1);

  const lastReviewDate = reviews[0]?.time
    ? new Date(parseInt(reviews[0].time, 10) * 1000).toISOString()
    : null;

  return {
    googlePlaceId: placeId,
    businessName: place.name,
    website: place.website,
    phone: place.formatted_phone_number,
    googleRating: place.rating,
    reviewCount: place.user_ratings_total,
    reviewSummary: {
      averageRating: place.rating ?? 0,
      totalReviews: place.user_ratings_total ?? 0,
      positiveThemes,
      negativeThemes,
      responseRate,
      lastReviewDate,
    },
  };
}
