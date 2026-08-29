/**
 * Seed content for the journal. Editable from the dashboard afterwards.
 * Bodies are markdown; they are rendered with react-markdown, which does not
 * pass raw HTML through.
 */

export type SeedPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  readMinutes: number;
  author: string;
  tags: string[];
  imageSlot: string;
  featured: boolean;
  /** Days before "now" that the post was published. */
  daysAgo: number;
};

export const posts: SeedPost[] = [
  {
    slug: "why-we-stopped-plating-anything",
    title: "Why we stopped plating anything",
    category: "Materials",
    excerpt:
      "Plating hides the metal and fails first. What happens when you let brass age instead.",
    readMinutes: 6,
    author: "Youssef Amrani",
    tags: ["brass", "finishes", "patina"],
    imageSlot: "[ journal — plated hardware, stripped ]",
    featured: true,
    daysAgo: 12,
    body: `We spent our first decade repairing other people's hardware, and the single most common job was not a broken mechanism. It was a finish that had failed and taken the look of the object down with it.

## What plating actually is

Plating is a coat of one metal deposited over another — usually a few microns of nickel, chrome or "antique brass" over a cheaper base. It is not a colour. It is a separate layer with its own thickness, its own hardness, and its own edges.

Edges are the problem. Wherever a plated surface is worn, struck or flexed, the layer breaks and the base metal underneath is exposed. Now you have two metals in contact with moisture, which is a galvanic cell, which means the base corrodes faster than it would have on its own. A plated handle does not gently age. It goes patchy, then blotchy, then it lifts.

Lacquer does the same thing more slowly. It yellows first, then crazes, then peels in flakes, and the tarnish it was supposed to prevent forms *underneath* it where you cannot reach it. Stripping old lacquer off a sconce is a solvent job that takes longer than making the part.

## What we found in the buildings around us

The hardware still worth repairing after ninety years was almost always unplated and unlacquered. Solid brass espagnolette bolts. Bronze casement stays. Cast handles that had gone a deep chocolate brown where nobody touched them and stayed bright gold where thumbs had passed for three generations.

None of it had been maintained. That is the point. It had simply been left to reach a stable state and then left alone.

## The trade

So we do not plate and we do not lacquer, and there are two things you give up for it.

The first is uniformity. A bare brass door pull in a hallway will not look identical to the one at the far end, because they get touched differently. If matching matters more to you than ageing, we are the wrong workshop.

The second is the ability to freeze the object at the moment you bought it. Bare metal moves. Within a few weeks it will have shifted; within a year it will be a different colour than the photograph.

What you get back is a piece that has no failure mode at the surface. It cannot flake, because there is nothing on it to flake. It cannot craze. The worst thing that can happen is that it gets darker than you like, and the fix for that is a cloth and five minutes.

## If you want it bright

Polish it. There is no ritual to protect and nothing you can ruin. Use a mild brass polish sparingly, work along the direction of the finish rather than in circles, and buff every trace of it off — polish left in a corner keeps working and leaves a pale halo around the detail.

If you want the movement slowed without stopping it, a thin coat of microcrystalline wax buffed to nothing will hold the colour for six months or so. It is what museums use on bronze. It does not yellow and it comes off with white spirit when you have had enough of it.

And if you want to do nothing at all, that is the option we designed for.`,
  },
  {
    slug: "anatomy-of-a-forged-bowl",
    title: "Anatomy of a forged bowl",
    category: "Process",
    excerpt:
      "Nine steps from a flat disc to a finished piece, and the one we still do wrong.",
    readMinutes: 7,
    author: "Salma Bennani",
    tags: ["process", "raising", "brass"],
    imageSlot: "[ journal — bowl at four stages ]",
    featured: true,
    daysAgo: 27,
    body: `A raised bowl begins as a flat disc and ends as a hollow form, and nothing is removed along the way. The metal is not carved or spun. It is moved.

## The nine steps

1. **Cut the disc.** For bowl no. 4 that is a 300 mm circle of 1.5 mm brass, sheared and then filed true. A disc that is out of round stays out of round.
2. **Anneal.** Heat to a dull red and quench. Brass work-hardens as you hit it; annealing puts it back to soft. You will do this between every course.
3. **Course one.** Working from the centre outward over a stake, hammering the metal down against the steel in overlapping rings. The disc begins to dish.
4. **Anneal again.** By the end of a course the metal rings differently under the hammer. That change in sound is the cue, not the clock.
5. **Courses two and three.** The wall comes up. This is where the diameter shrinks and the height appears, and where a bowl either stays symmetrical or does not.
6. **True the rim.** Scribe a line, cut back to it, file the edge square. Roughly 15 mm of the original disc is lost here.
7. **Planish.** A polished hammer against a polished stake, overlapping strikes across the whole surface. This is what compacts the metal, removes the coarse marks and gives the finished piece its texture.
8. **Level the base.** A slight foot, tapped in from below, so the bowl sits without rocking on a table that is itself not flat.
9. **Wax.** Clean, dry, a thin coat of microcrystalline wax, buffed off.

Four heats, about five hours, across two days because the annealing wants time.

## Where the character comes from

The wall thickness varies. It has to — you are moving metal from the centre towards the rim, and no hand does that perfectly evenly. A spun bowl is uniform to a hundredth of a millimetre and it feels like nothing in the hand. A raised bowl is thicker at the base than at the lip, which is exactly what your hand expects from a vessel and never gets from a machine-made one.

The planishing marks are the other half. They are not decoration. They are the record of the last course of hammering, and they catch light at a hundred slightly different angles, which is why the surface changes as you walk past it.

## The step we still do wrong

Step 6, truing the rim.

Cutting back to a scribed line is straightforward. Getting the rim to sit in a single flat plane afterwards is not, and after twenty-five years I still put a bowl on the surface plate and find one quadrant sitting two tenths of a millimetre proud.

The honest answer is that a raised form is under uneven stress and it moves after you cut it. You can chase that error around the rim for an hour. You can also accept two tenths, which is invisible to the eye and detectable only by someone with a straightedge and a grievance.

We accept it. Every bowl that leaves here has a rim that is very slightly not flat, and I have decided to describe that as the difference between our bowls and a machine's rather than as the defect it technically is.`,
  },
  {
    slug: "notes-on-repairing-other-peoples-work",
    title: "Notes on repairing other people’s work",
    category: "Workshop",
    excerpt:
      "A century of brass hardware passed across our bench. Here is what lasted.",
    readMinutes: 5,
    author: "Youssef Amrani",
    tags: ["repair", "hardware", "casablanca"],
    imageSlot: "[ journal — bench with old hardware ]",
    featured: false,
    daysAgo: 41,
    body: `Between 2001 and about 2012 we did not make anything of our own. We repaired what the buildings around the workshop sent us, which was mostly window and door hardware from the 1880s to the 1930s.

You learn things from that which you cannot learn from making.

## Failures are boringly repetitive

Across roughly two thousand repairs, almost everything fell into four categories:

- **Finish failure.** Plating lifted, lacquer crazed. By far the largest group, and usually the reason the object was brought in at all — the mechanism was fine.
- **Fastener failure.** Screws into old softwood, pulled out. Rivets that were cold-set and worked loose. Almost never the metal itself.
- **Wear at a bad pairing.** Steel pin in a brass bearing, or worse, steel in steel with no lubrication. The softer part gives up and the joint goes sloppy.
- **Abuse.** Someone forced a seized latch instead of oiling it.

Note what is not on the list: the metal breaking. In twelve years I remember four cracked castings, and three of those were porous from the foundry rather than fatigued.

## What that changed about how we make things

Three decisions came directly out of it, and we have not revisited any of them.

**No plating, no lacquer.** The largest failure category is one we can simply decline to participate in.

**Bronze on bronze, or bronze on steel, never steel on steel.** The door knocker uses a bronze pin in a bronze bearing. Every engineer who sees it says the same metal on both faces will gall. In a hinge turning a few times a day, at hand pressure, it does not — it wears smooth and stays quiet, and it does not rust into place the way a steel pin does in a coastal winter.

**Riveted rather than soldered wherever a joint sees load.** A soldered joint is a repair you cannot make without heat, which means undoing the finish. A rivet can be tightened on a kitchen table in twenty years.

## The guarantee is not generosity

We repair anything we made, free, for as long as we are at the bench, and we do it for pieces bought second-hand as well.

This gets described as generous. It is not, particularly. It is the cheapest possible feedback loop. Every piece that comes back tells us something a customer survey never would, and the volume is low precisely because we designed against the four failure modes above.

Last year we did nine repairs on our own work. Three were sconces that needed rewiring after twelve years, which is the flex ageing rather than anything we did. Two were bowls that had been polished with something abrasive. Four were dropped.

None of them had failed on their own.`,
  },
  {
    slug: "what-a-commission-actually-costs",
    title: "What a commission actually costs",
    category: "Commissions",
    excerpt:
      "The arithmetic behind a quote, and why the second piece is not half the price of the first.",
    readMinutes: 6,
    author: "Salma Bennani",
    tags: ["commissions", "pricing", "process"],
    imageSlot: "[ journal — pattern and quote sheet ]",
    featured: false,
    daysAgo: 58,
    body: `People are often surprised by a commission quote in one direction or the other, and almost always because of the same misunderstanding: they assume the cost scales with the number of pieces. It does not.

## What you are actually paying for

A commission has four costs, and only one of them repeats.

**Design and pattern.** Working out the form, then cutting a pattern if it is to be cast. Between four hours and three days. This happens once no matter how many pieces you order.

**Setup.** Tooling, jigs, and the first heat where you find out that the thing you drew does not behave the way you expected. Once per run.

**Material.** Bronze runs around 180 MAD a kilogram at the moment, brass a little less. It is rarely the largest number on the sheet, which surprises people most of all.

**Making.** Per piece, and the only line that scales.

For a single sconce, design and setup are most of the quote. For forty door pulls, they are a rounding error and you are essentially paying for hands and metal.

## A real example

Studio Levant commissioned door pulls for a building last year: forty-two pulls, three lengths, matched finish.

- Pattern work, three lengths: 14 hours
- Setup and first casts: 9 hours
- Material, 61 kg bronze: about 11 000 MAD
- Making and finishing, 42 pieces: 63 hours

The first pull cost roughly 9 000 MAD to bring into existence. The forty-second cost about 1 400 MAD. Quoted as a single number the pulls came to 2 180 MAD each, which is above the catalogue price for the standard long pull and represents a considerable discount on what one bespoke pull would have cost.

## Why we sample above six pieces

Anything over six, we make one first and post it to you before the run begins.

It is not a courtesy. A pattern error found on piece one costs a day. The same error found on piece thirty costs a month and a difficult conversation. The sample is the cheapest insurance available to both of us, and it is also the reason we can be firm about commissions being exempt from the fourteen-day return window — you have held the thing before we made the rest.

## What makes a quote go up

Three things, in order of impact:

1. **Matching an existing piece you cannot send us.** Photographs are not enough for a profile. If we cannot measure it, we are guessing, and guessing means a second sample.
2. **A deadline inside four weeks.** The forge is not idle and someone else's job moves.
3. **A finish we do not do.** We do not plate. If a project genuinely needs chrome, we will say so and recommend somebody.

What does *not* move the price much: complexity of form. Raising a difficult shape is what the workshop is for, and it is usually a smaller number than people expect.`,
  },
  {
    slug: "living-with-a-patina",
    title: "Living with a patina",
    category: "Materials",
    excerpt:
      "A twelve-month timeline for unlacquered brass, and the three points where people panic.",
    readMinutes: 5,
    author: "The Maker",
    tags: ["patina", "care", "brass"],
    imageSlot: "[ journal — one bowl, four ages ]",
    featured: false,
    daysAgo: 74,
    body: `Nearly every message we get in the first year of ownership is some version of the same question, arriving at one of three predictable moments. Here is the whole timeline, so you know which one you are at.

## Week one to four

The piece looks exactly as it did in the workshop for about ten days, then fingerprints start showing as darker marks that do not wipe off. The overall tone is still clearly yellow.

**Panic point one: "I have marked it."** You have not. Skin leaves salts and oils, the salts accelerate oxidation locally, and the print appears. It is the first sign the metal is doing what it is supposed to. A dry cloth removes most of it; ignoring it is also fine.

## Month two to six

The colour walks from yellow towards a warm gold-brown. It goes unevenly — recessed areas darken first because they are handled least and ventilate least. Anything in a kitchen moves noticeably faster, because steam carries both moisture and cooking acids.

**Panic point two: "It has gone blotchy."** It is genuinely blotchy at this stage, and it is the least attractive month in the life of the object. It evens out. If you cannot wait, polish the whole piece back and start again — nothing is lost.

## Month six to twelve

The patina settles into a stable brown, darker in the shadows and bright on every surface a hand touches. This is where the object stops changing quickly and starts simply looking older.

**Panic point three: "It has stopped looking new and I miss it."** Then polish it. Mild brass polish, sparingly, along the grain, and buff off every trace. You will be back at week one and the metal is entirely unharmed. Some people do this every spring. Some have never done it in nine years.

## What actually damages it

Very little, which is why we are relaxed about all of the above.

- **Abrasive pads and scouring powder.** These cut the surface rather than clean it, and they leave scratches that never blend in. This is the one genuine mistake.
- **Dishwashers**, for anything tinned or with a felt or cork base.
- **Standing moisture**, particularly salt water, left for days.
- **Polish left in the detail**, which keeps working and leaves a pale ring.

Everything else — heat, cold, sunlight, being dropped, being ignored for a decade — is survivable and mostly invisible in the end.

## The long view

The hardware we spent a decade repairing was eighty to a hundred and thirty years old, unmaintained, and worth restoring. Every one of those pieces went through the twelve months above, some time before the First World War, and then simply carried on.

That is the whole argument for bare metal. The first year asks something of you. The next ninety do not.`,
  },
  {
    slug: "a-north-facing-window",
    title: "A north-facing window",
    category: "Workshop",
    excerpt:
      "Why the light in a metal workshop decides what you are able to see, and therefore what you make.",
    readMinutes: 4,
    author: "Salma Bennani",
    tags: ["workshop", "casablanca", "process"],
    imageSlot: "[ journal — bench under north light ]",
    featured: false,
    daysAgo: 96,
    body: `When we took the workshop in 2001 the previous occupant, a locksmith, had boarded over the large north window and worked under fluorescent tubes for thirty years. Taking the boards down was the first thing we did and probably the most consequential.

## The problem with judging a surface

Metal has no colour of its own to speak of. What you are judging when you look at a planished bowl is a pattern of reflections, and reflections depend entirely on what is being reflected.

Under a point source — a bulb, a spotlight, a low sun through a west window — every facet either catches the source or does not. The surface reads as high contrast: bright spots against near black. Under those conditions a badly planished bowl and a well planished one look almost identical, because the contrast swamps the detail.

Under a large, even, diffuse source, each facet reflects a slightly different part of a broad field. The contrast collapses and what you see instead is *form*: the actual geometry of the surface, every hollow and high point.

A north-facing window is that second thing for most of the working day.

## What it changes about the work

Three things, and they compound.

**You planish differently.** Under north light you can see the overlap of your own hammer strikes as you make them, which means you correct within the course rather than discovering the problem two days later.

**You reject more.** This is not a virtue, it is a consequence. Pieces that would pass under a tube do not pass under the window, so the standard rises whether or not you intended it to.

**You stop trusting photographs.** Almost every product photograph of metalwork is lit with a large soft source for exactly the reasons above, which flatters the surface. It is one reason we have been slow to photograph the catalogue: the honest picture of a raised bowl is a rather dull one, and the flattering picture tells you nothing about how the object will look on your table.

## The hours

The trade-off is that north light is the same all day and then it is gone. From November to February we get from about half past eight until four, and finishing work stops when it does. The forge does not care and neither does casting, so those jobs move to the afternoon in winter and the finishing moves to the morning.

Which is how a window ends up organising a working week.`,
  },
];
