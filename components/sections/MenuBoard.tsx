import Image from "next/image";
import { asset } from "@/lib/img";
import { MENU } from "@/lib/menu";
import { InView } from "@/components/ui/InView";
import { RevealTitle } from "@/components/ui/Reveal";

/** Full menu: category jump links + item rows with rendered thumbnails. */
export function MenuBoard() {
  return (
    <section className="board" aria-labelledby="board-title">
      <div className="board__head">
        <p className="eyebrow">The full menu</p>
        <RevealTitle className="title board__title" id="board-title">
          Everything we pour &amp; bake
        </RevealTitle>
        <nav className="board__jump" aria-label="Menu categories">
          {MENU.map((c) => (
            <a key={c.id} href={`#${c.id}`}>
              {c.title}
            </a>
          ))}
        </nav>
      </div>

      {MENU.map((cat) => (
        <section key={cat.id} id={cat.id} className="board__cat" aria-labelledby={`${cat.id}-title`}>
          <header className="board__cathead">
            <h3 id={`${cat.id}-title`}>{cat.title}</h3>
            <p>{cat.blurb}</p>
          </header>
          <ul className="board__list">
            {cat.items.map((it, i) => (
              <InView as="li" key={it.name} className="mitem" y={30} delay={(i % 2) * 0.06}>
                <span className="mitem__thumb">
                  <Image {...asset(it.img)} alt="" sizes="96px" />
                </span>
                <span className="mitem__body">
                  <span className="mitem__row">
                    <span className="mitem__name">{it.name}</span>
                    <span className="mitem__dots" aria-hidden="true" />
                    <span className="mitem__price">${it.price}</span>
                  </span>
                  <span className="mitem__note">
                    {it.note}
                    {it.tags?.map((t) => (
                      <span className="mitem__tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
              </InView>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
