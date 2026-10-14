import "server-only";

/**
 * Live Google reviews via the Places API (New).
 *
 * Set in your environment (e.g. .env.local / hosting dashboard):
 *   GOOGLE_PLACES_API_KEY=…   (server-side only — never exposed to the browser)
 *   GOOGLE_PLACE_ID=…         (your Google Business Profile's Place ID)
 *
 * Google returns up to 5 reviews per place. Results are cached and refreshed
 * every 6 hours. Display must keep the author attribution + link and the
 * "Google" source attribution (see Places API policies).
 */

export type Review = {
  author: string;
  authorUrl?: string;
  photo?: string;
  rating: number;
  text: string;
  when: string;
  url?: string;
};

export type PlaceReviews =
  | { status: "live"; name: string; rating: number; total: number; mapsUrl: string; writeUrl: string; reviews: Review[] }
  | { status: "unconfigured" }
  | { status: "error"; message: string };

type ApiReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

export async function getPlaceReviews(): Promise<PlaceReviews> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return { status: "unconfigured" };

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: 60 * 60 * 6 },
    });
    if (!res.ok) return { status: "error", message: `Google Places responded ${res.status}` };
    const data = (await res.json()) as {
      displayName?: { text?: string };
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: ApiReview[];
    };
    return {
      status: "live",
      name: data.displayName?.text ?? "Mossbrew",
      rating: data.rating ?? 0,
      total: data.userRatingCount ?? 0,
      mapsUrl: data.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      writeUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
      reviews: (data.reviews ?? []).map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google user",
        authorUrl: r.authorAttribution?.uri,
        photo: r.authorAttribution?.photoUri,
        rating: r.rating ?? 0,
        text: r.text?.text ?? r.originalText?.text ?? "",
        when: r.relativePublishTimeDescription ?? "",
        url: r.googleMapsUri,
      })),
    };
  } catch (e) {
    return { status: "error", message: e instanceof Error ? e.message : "Could not reach Google" };
  }
}
