/**
 * The photographs the seeded catalogue and journal start with. Each `id` is a
 * file name in the upload folder (`uploads/`, committed with the repo), so a
 * fresh database seeded from a fresh clone shows the same pictures.
 *
 * Only used when a piece is first created — re-seeding never replaces a
 * photograph chosen since in the dashboard. Stock photography is credited in
 * public/images/CREDITS.md.
 */

type SeedImage = { id: string; alt: string };

export const postImages: Record<string, SeedImage> = {
  "why-we-stopped-plating-anything": { id: "16f343b69bd76e2ab9710578.jpg", alt: "An old ornate door handle on weathered wood" },
  "anatomy-of-a-forged-bowl": { id: "4113786dd8fe87a48294e658.jpg", alt: "A hand holding a shallow hammered brass bowl" },
  "notes-on-repairing-other-peoples-work": { id: "d37779c39463544e7da32d20.jpg", alt: "Old hinges, latches and hardware hung on a workshop wall" },
  "what-a-commission-actually-costs": { id: "8076dd45efb09544e439bd42.jpg", alt: "Tools and drawings pinned to a dark workshop wall" },
  "living-with-a-patina": { id: "b0d6a2471887340216a2c853.jpg", alt: "An old brass coffee pot with an engraved pattern" },
  "a-north-facing-window": { id: "3fe44760072d060f7e43d778.jpg", alt: "A workbench and tools under a window in a rustic workshop" },
  "moroccan-brass-lamps-guide": { id: "83814be0384759b9cbee2698.jpg", alt: "Pierced metal lanterns glowing in a dark room" },
  "how-moroccan-lamps-are-hand-pierced": { id: "ce358966e00f93db3cb7f1fb.jpg", alt: "A craftsman sitting at a low anvil, hammering a punch into metal" },
  "moroccan-chandelier-size-guide": { id: "8aeddb6468d171fa59da8452.jpg", alt: "A dining table and chairs under a hanging chandelier" },
  "real-vs-machine-made-moroccan-lamps": { id: "55e8164c4516316e8b24c131.jpg", alt: "Close-up of a pierced metal lamp shade with light showing through the openings" },
  "best-bulb-for-moroccan-lamps": { id: "747d2940eb76b042f62cf319.jpg", alt: "A clear filament bulb glowing warm in the dark" },
  "how-to-clean-a-moroccan-brass-lamp": { id: "d759d6019702053740c26e67.jpg", alt: "A decorative brass lantern hanging from the ceiling" },
  "brass-care-guide": { id: "d86d11a256576debe360863d.jpg", alt: "Polished brass lidded vessels crowded together on a shelf" },
  "brass-bronze-copper-difference": { id: "75f32a5d01e0fbca9c3dbc1a.jpg", alt: "Copper pots and pans on a stove" },
  "moroccan-metalwork-guide": { id: "3b38693f71d176c6620bd3ba.jpg", alt: "A craftsman chasing a pattern into a metal tray" },
  "buying-handmade-metalwork-marrakech": { id: "c84ae4fdf6acdabe5611a358.jpg", alt: "A Moroccan shop hung with lamps and crafts" },
  "shipping-a-moroccan-chandelier-abroad": { id: "8db60b7deb5b4589753eef00.jpg", alt: "A brown cardboard shipping box on a white surface" },
};

export const productImages: Record<string, SeedImage[]> = {
  "star-chandelier": [
    { id: "6abd4bcca1eabc363cb7c30d.jpg", alt: "Hand-pierced brass star chandelier, lit, hanging in the workshop" },
  ],
  "moroccan-brass-pendant-light": [
    { id: "0419656e59e4e4313cb35a6c.jpg", alt: "Hand-pierced Moroccan brass pendant light hanging from a ceiling rose" },
  ],
  "flamla-pendant-light": [
    { id: "66dd0ca005180cd59024cbd3.jpg", alt: "Tall teardrop-shaped hand-pierced brass Flamla pendant, lit, in the showroom" },
  ],
  "damaa-floor-lamp": [
    { id: "977e9274434b1b84c40319ad.jpg", alt: "Tall hand-pierced brass teardrop floor lamp, lit, in the workshop" },
  ],
  "khobza-dome-pendant-light": [
    { id: "6963b29bcc8b85e8bceb98d9.jpg", alt: "Round hand-pierced brass dome pendant, lit, among other lamps in the showroom" },
  ],
};
