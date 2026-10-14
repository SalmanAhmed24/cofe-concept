import { getPlaceReviews, type Review } from "@/lib/reviews";
import { InView } from "@/components/ui/InView";
import { Arrow } from "@/components/ui/Magnetic";

function Stars({ value, label }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(5, value)) * 20;
  return (
    <span className="stars" role="img" aria-label={label ?? `${value.toFixed(1)} out of 5 stars`}>
      <span className="stars__base" aria-hidden="true">★★★★★</span>
      <span className="stars__fill" aria-hidden="true" style={{ width: `${pct}%` }}>
        ★★★★★
      </span>
    </span>
  );
}

function ReviewCard({ r, i }: { r: Review; i: number }) {
  const initials = r.author
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <InView as="li" className="rcard" y={40} delay={(i % 3) * 0.08}>
      <div className="rcard__head">
        {r.photo ? (
          // Google-hosted avatar; plain <img> so we don't need to allow-list Google's image hosts
          // eslint-disable-next-line @next/next/no-img-element
          <img className="rcard__avatar" src={r.photo} alt="" width={44} height={44} loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <span className="rcard__avatar rcard__avatar--initials" aria-hidden="true">
            {initials}
          </span>
        )}
        <div>
          {r.authorUrl ? (
            <a className="rcard__author" href={r.authorUrl} target="_blank" rel="noopener noreferrer">
              {r.author}
            </a>
          ) : (
            <span className="rcard__author">{r.author}</span>
          )}
          <span className="rcard__when">{r.when}</span>
        </div>
      </div>
      <Stars value={r.rating} />
      <p className="rcard__text">{r.text}</p>
      {r.url && (
        <a className="rcard__link" href={r.url} target="_blank" rel="noopener noreferrer">
          View on Google <Arrow size={12} />
        </a>
      )}
    </InView>
  );
}

/**
 * Real Google reviews for the café, fetched server-side and cached. Until the API
 * key + Place ID are configured, it shows clearly-labelled setup placeholders —
 * never invented reviews.
 */
export async function Reviews() {
  const data = await getPlaceReviews();

  if (data.status !== "live") {
    return (
      <section className="reviews" aria-labelledby="reviews-setup">
        <div className="reviews__setup" role="note">
          <p className="eyebrow eyebrow--dark">{data.status === "error" ? "Couldn’t load reviews" : "Setup needed"}</p>
          <h2 id="reviews-setup">Connect your Google Business Profile</h2>
          <p>
            This page shows your real Google reviews, refreshed every six hours. Add <code>GOOGLE_PLACES_API_KEY</code> and{" "}
            <code>GOOGLE_PLACE_ID</code> to your environment and redeploy — the placeholders below are replaced automatically.
          </p>
          {data.status === "error" && <p className="reviews__err">{data.message}</p>}
        </div>
        <ul className="reviews__grid">
          {[0, 1, 2, 3, 4].map((i) => (
            <li key={i} className="rcard rcard--placeholder" aria-hidden="true">
              <span className="rcard__badge">Placeholder</span>
              <div className="rcard__head">
                <span className="rcard__avatar rcard__avatar--initials" />
                <div>
                  <span className="skel skel--name" />
                  <span className="skel skel--when" />
                </div>
              </div>
              <span className="skel skel--line" />
              <span className="skel skel--line" />
              <span className="skel skel--line skel--short" />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="reviews" aria-labelledby="reviews-summary">
      <div className="reviews__summary">
        <div>
          <p className="eyebrow eyebrow--dark">Reviews from Google</p>
          <h2 id="reviews-summary" className="reviews__score">
            {data.rating.toFixed(1)}
            <span>/5</span>
          </h2>
          <Stars value={data.rating} />
          <p className="reviews__count">Based on {data.total.toLocaleString("en")} Google reviews</p>
        </div>
        <div className="reviews__ctas">
          <a className="btn btn--dark" href={data.writeUrl} target="_blank" rel="noopener noreferrer">
            Write a review <Arrow />
          </a>
          <a className="btn btn--outline-dark" href={data.mapsUrl} target="_blank" rel="noopener noreferrer">
            See all on Google Maps <Arrow />
          </a>
        </div>
      </div>
      <ul className="reviews__grid">
        {data.reviews.map((r, i) => (
          <ReviewCard key={`${r.author}-${i}`} r={r} i={i} />
        ))}
      </ul>
      <p className="reviews__attrib">Reviews and ratings provided by Google. Showing the most relevant reviews Google makes available.</p>
    </section>
  );
}
