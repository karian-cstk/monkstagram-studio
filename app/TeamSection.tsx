import { team } from "@/content/team";

export default function TeamSection() {
  return (
    <section className="border-t border-shadow-border">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <p className="label-eyebrow text-xs text-periwinkle uppercase mb-3">
          The Order
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold">
          The Monks behind the Blend
        </h2>
        <p className="mt-3 max-w-xl text-subtle">
          Every bottle has a maker. Here's who's distilling Contentstack's
          design system, one release at a time.
        </p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <article
              key={member.id}
              className="rounded-xl bg-shadow-card border border-shadow-border p-6 flex flex-col items-center text-center"
            >
              <div className="wax-seal w-20 h-20 rounded-full flex items-center justify-center bg-shadow-heavy mb-4 overflow-hidden">
                {member.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-display text-xl text-periwinkle">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                )}
              </div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-xs text-muted mt-0.5">{member.role}</p>
              <p className="label-eyebrow text-[10px] text-amethyst-accessible uppercase mt-3">
                {member.product}
              </p>
              <p className="text-sm text-subtle mt-2 leading-relaxed">
                {member.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
