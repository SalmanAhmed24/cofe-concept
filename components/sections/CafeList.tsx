import { InView } from "@/components/ui/InView";
import { RevealTitle } from "@/components/ui/Reveal";

const ALL = [
  { name: "Old Town", area: "Flagship & roastery", hours: "7am – 10pm", perks: ["Roastery tours", "Nitro tap"] },
  { name: "Riverside", area: "Terrace on the water", hours: "7am – 9pm", perks: ["Outdoor seating", "Dogs welcome"] },
  { name: "Canal Yard", area: "Cold brew tap room", hours: "8am – 11pm", perks: ["Late opening", "Nitro tap"] },
  { name: "North Market", area: "Grab-and-go kiosk", hours: "6am – 6pm", perks: ["Mobile pickup"] },
  { name: "The Arcade", area: "Under the glass roof", hours: "8am – 9pm", perks: ["Pastry bar"] },
  { name: "University Row", area: "Study-friendly hall", hours: "7am – 11pm", perks: ["Wi-Fi", "Power at every seat"] },
  { name: "Harbour Point", area: "Sea-view counter", hours: "7am – 8pm", perks: ["Outdoor seating"] },
  { name: "Station Square", area: "Commuter express", hours: "5:30am – 8pm", perks: ["Mobile pickup"] },
  { name: "Garden Quarter", area: "Courtyard café", hours: "8am – 7pm", perks: ["Pastry bar", "Dogs welcome"] },
  { name: "Mill Lane", area: "Converted textile mill", hours: "7am – 9pm", perks: ["Roastery tours"] },
  { name: "Hilltop", area: "Rooftop terrace", hours: "9am – 10pm", perks: ["Sunset menu"] },
  { name: "Airport T2", area: "Airside, gate B", hours: "4am – 11pm", perks: ["Mobile pickup"] },
  { name: "Westgate", area: "Drive-through", hours: "6am – 9pm", perks: ["Drive-through"] },
  { name: "Lakeside", area: "Boathouse café", hours: "8am – 6pm", perks: ["Outdoor seating", "Dogs welcome"] },
];

export function CafeList() {
  return (
    <section className="cafelist" aria-labelledby="cafelist-title">
      <p className="eyebrow eyebrow--dark">All locations</p>
      <RevealTitle className="title title--dark cafelist__title" id="cafelist-title">
        Every Mossbrew, A to Z
      </RevealTitle>
      <ul className="cafelist__grid">
        {[...ALL]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((c, i) => (
            <InView as="li" key={c.name} className="cafecard" y={40} delay={(i % 3) * 0.06}>
              <h3 className="cafecard__name">{c.name}</h3>
              <p className="cafecard__area">{c.area}</p>
              <p className="cafecard__hours">
                <span>Open daily</span> {c.hours}
              </p>
              <ul className="cafecard__perks" aria-label="Amenities">
                {c.perks.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </InView>
          ))}
      </ul>
    </section>
  );
}
