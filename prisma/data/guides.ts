/**
 * The pillar guides and the newer articles of the journal's topic clusters.
 * See ./posts.ts for the older articles and src/config/clusters.ts for how
 * the clusters link together.
 *
 * Written for readers first and answer engines second: each opens with the
 * short answer, headings are the questions people actually ask, and every
 * figure is one a reader could check or act on.
 */

import type { SeedPost } from "./posts.js";

/* ================================================================ lighting */

const lightingPillar: SeedPost = {
  slug: "moroccan-brass-lamps-guide",
  title: "Moroccan brass lamps: the complete guide",
  category: "Guides",
  cluster: "lighting",
  excerpt:
    "What a hand-pierced Moroccan lamp is, how it is made, how to choose the size and the bulb, how to tell a real one, and how to look after it.",
  readMinutes: 9,
  author: "The Maker",
  tags: ["moroccan lamps", "brass chandelier", "lighting", "marrakech"],
  imageSlot: "[ journal — pierced lamps lit in the workshop ]",
  featured: true,
  daysAgo: 1,
  products: ["star-chandelier"],
  takeaways: [
    "A Moroccan brass lamp is a lamp whose shade is hand-pierced from sheet brass, so that the light passes through thousands of small openings and throws the pattern onto the walls and ceiling.",
    "The main forms are the chandelier (thurayya), the pendant, the lantern (fanous), the wall sconce and the table lamp.",
    "Size a chandelier from the room: in centimetres, its diameter should be roughly the room's length plus width in metres, multiplied by 8.",
    "Use a clear, warm-white (2700 K) LED bulb for the sharpest pattern; a frosted bulb blurs it.",
    "A real hand-pierced lamp has holes that vary very slightly from one to the next; solid brass does not stick to a magnet.",
  ],
  faqs: [
    {
      q: "What is a Moroccan lamp made of?",
      a: "Traditionally of brass (an alloy of copper and zinc), copper, or nickel silver, which is a silver-coloured alloy of copper, nickel and zinc. The better lamps are solid sheet metal throughout; cheaper ones are often brass-plated steel.",
    },
    {
      q: "What is a Moroccan chandelier called?",
      a: "In Morocco a large hanging lamp is usually called a thurayya (also spelled thuraya or tria), the Arabic word for chandelier. Smaller hanging lanterns are called fanous.",
    },
    {
      q: "Are Moroccan lamps bright enough to light a room?",
      a: "A pierced lamp gives less direct light than an open shade because much of it is blocked by the metal — that is where the pattern comes from. A large chandelier with several bulbs can light a room; smaller pendants and sconces work best as atmosphere alongside another light source.",
    },
    {
      q: "How much does a handmade Moroccan brass chandelier cost?",
      a: "It depends on size and how much of it is hand-pierced. Our Star chandelier, 1 m tall and 80 cm wide in solid brass, is 5,000 MAD at the workshop in Marrakech. Much lower prices for a similar size usually mean machine cutting, thinner metal or plated steel.",
    },
  ],
  body: `A Moroccan brass lamp is a light whose shade is cut from sheet brass and pierced by hand, so that the bulb inside throws a pattern of light and shadow across the room. It is one of the best-known products of Moroccan metalwork, and it is what we make most of in our workshop in Marrakech.

This guide covers everything we are asked about them. Each section links to a longer article if you want the detail.

## What makes a lamp "Moroccan"?

Three things, together:

- **The metal.** Brass is the classic, for its warm yellow light. Copper gives a redder glow, and nickel silver (*maillechort* in French) gives a cooler, silver-white one. If you are not sure what a lamp is made of, see [the difference between brass, bronze and copper](/journal/brass-bronze-copper-difference).
- **The piercing.** The pattern is punched through the metal with small steel chisels and a hammer, hole by hole. It is the piercing, not the shape, that makes a Moroccan lamp. We explain the whole process in [how a Moroccan lamp is hand-pierced](/journal/how-moroccan-lamps-are-hand-pierced).
- **The patterns.** Mostly geometric — stars, interlaced polygons, the multi-pointed rosettes of zellij tilework — with floral arabesques in between.

## The main types

| Type | Moroccan name | Where it goes | Typical size |
| --- | --- | --- | --- |
| Chandelier | thurayya | Entrance halls, living and dining rooms, stairwells | 50–120 cm wide |
| Pendant | — | Over a table, a kitchen island, a bedside | 20–40 cm wide |
| Lantern | fanous | Hung in groups, courtyards, covered terraces | 15–35 cm wide |
| Wall sconce | — | Corridors, stairs, either side of a bed or mirror | 20–45 cm tall |
| Table lamp | — | Side tables, desks, a dark corner | 30–60 cm tall |

Our [Star chandelier](/products/star-chandelier) is a thurayya: 1 m tall and 80 cm wide, a conical crown over a star-shaped hexagonal base. Pendants and wall sconces are the smaller end of the same family, and we make them [to order](/contact?topic=commission).

## How big should it be?

Bigger than most people expect. A chandelier that is too small is the commonest mistake we see, because a pierced lamp reads smaller on the ceiling than it does on the floor of a shop.

The quick rule: **diameter in centimetres ≈ (room length + room width in metres) × 8.** A 4 × 5 m living room wants something around 70–75 cm across. Over a dining table, aim for half to two-thirds of the table's width and hang the bottom 75–90 cm above the tabletop. The full method, with ceiling heights, is in our [Moroccan chandelier size guide](/journal/moroccan-chandelier-size-guide).

## Which bulb?

The bulb decides whether you get a pattern at all.

- **Clear, not frosted.** A small, clear filament throws sharp shadows. A frosted bulb is a large, soft source and blurs the pattern to a glow.
- **Warm white, 2700 K.** Brass already warms the light; anything cooler than 3000 K looks grey through it.
- **LED.** It runs cool inside a closed metal shade.

More on lumens, fittings and dimmers in [which bulb to use in a Moroccan lamp](/journal/best-bulb-for-moroccan-lamps).

## How to tell a hand-pierced lamp

Look at the holes. Hand-punched openings vary very slightly from one to the next and leave a small burr on the inside face; laser-cut and die-stamped ones are identical. Then hold a magnet to the lamp: solid brass does not attract one, and brass-plated steel does. The five checks we would make before buying are in [hand-pierced or machine-cut?](/journal/real-vs-machine-made-moroccan-lamps).

## Looking after it

Dust gathers in the piercing, so a soft brush once a month is most of the job. Unlacquered brass will darken over months; you can polish it back or let it age. Step-by-step instructions are in [how to clean a Moroccan brass lamp](/journal/how-to-clean-a-moroccan-brass-lamp), and the wider picture of brass care is in our [brass care guide](/journal/brass-care-guide).

## Buying one

You can buy in the souks of the medina, directly from a workshop, or online. Each has its trade-offs — we set them out honestly in [buying handmade metalwork from Marrakech](/journal/buying-handmade-metalwork-marrakech), including [how a chandelier is packed and shipped abroad](/journal/shipping-a-moroccan-chandelier-abroad).

Or [see the lighting we make](/products?collection=Light).`,
};

const lightingPiercing: SeedPost = {
  slug: "how-moroccan-lamps-are-hand-pierced",
  title: "How a Moroccan lamp is hand-pierced",
  category: "Process",
  cluster: "lighting",
  excerpt:
    "From a paper pattern to thousands of punched holes: the six stages of making a pierced brass lamp by hand, and why no two come out the same.",
  readMinutes: 6,
  author: "Youssef Amrani",
  tags: ["piercing", "moroccan lamps", "process", "brass"],
  imageSlot: "[ journal — punching a lamp panel ]",
  featured: false,
  daysAgo: 21,
  products: ["star-chandelier"],
  takeaways: [
    "A Moroccan lamp is pierced by hand with small steel punches and chisels struck with a hammer, one opening at a time.",
    "The six stages are: drawing the pattern, cutting the sheet, transferring the pattern, punching, forming and assembling, then finishing.",
    "Because every opening is struck separately, the holes vary very slightly — which is how you recognise hand work.",
  ],
  faqs: [
    {
      q: "What tools are used to pierce a Moroccan lamp?",
      a: "A set of small hardened-steel punches and chisels, each with a differently shaped tip — dots, teardrops, crescents, short straight cuts — a light hammer, and a hard support underneath the sheet.",
    },
    {
      q: "How long does it take to make a Moroccan lamp?",
      a: "A small lantern can be pierced in a day. A large chandelier with several panels takes days of punching alone, before forming, assembly and wiring.",
    },
    {
      q: "Are Moroccan lamps laser cut?",
      a: "Many sold today are. Laser cutting is fast and perfectly regular. A hand-pierced lamp is recognisable by small variations between the openings and by a slight burr on the inside of each hole.",
    },
  ],
  body: `A Moroccan lamp is pierced by hand: the pattern is drawn onto sheet brass and punched through it, one opening at a time, with small steel chisels and a hammer. There is no machine in the process until the wiring. This is how it goes in our workshop, and in most of the ones that still work this way.

It is one of several techniques in the wider craft — the others are covered in our [guide to Moroccan metalwork](/journal/moroccan-metalwork-guide).

## 1. The pattern

Every lamp starts as a drawing on paper, full size, one sheet per panel. The geometry is laid out with compass and ruler first — the stars and interlaced polygons that come from zellij tilework — and the floral fill is drawn in freehand afterwards.

A panel pattern for a large chandelier can take a full day. It is the only stage done once per design rather than once per lamp.

## 2. Cutting the sheet

Brass sheet is cut to the outline of each panel with shears, and the edges filed. For lamps we use thinner sheet than for bowls or trays: thin enough to punch cleanly, thick enough to hold its shape once formed. Too thin and the lamp dents when you dust it; too thick and every hole takes two blows instead of one.

## 3. Transferring the pattern

The paper pattern is fixed to the sheet and the lines are marked through onto the metal. From here on the paper is gone and the metal carries the design.

## 4. Punching

This is most of the time.

The panel lies on a hard support. The maker holds a punch upright on the line, strikes it once with a light hammer, lifts it, moves it along, strikes again. Each punch has a different tip — a round dot, a teardrop, a crescent, a short straight blade — and the pattern is built from the order in which they are used. A large panel takes thousands of blows.

The rhythm matters more than the strength. A maker who is tired strikes unevenly, and uneven strikes show as holes of slightly different depth. It is why piercing is done in the morning in our workshop, and why nobody punches for a full day.

## 5. Forming and assembly

The flat panels are bent to their curve over a former, then joined — by rivets, by folded tabs, or by soldering where the joint takes no load. On our [Star chandelier](/products/star-chandelier) the conical crown and the star-shaped base are made as separate assemblies and joined at the wide brass band between them.

## 6. Finishing and wiring

The piece is cleaned of marking and handling, the burrs on the inside faces are left (they catch the light), and the lamp is either left bare or given a thin coat of wax. Then it is wired, with the lamp holders placed so the bulbs sit centrally in each chamber.

## Why no two are alike

Every opening is a separate blow, placed by eye on a line. Over thousands of blows, the spacing drifts a fraction and some holes sit a little deeper than others. Laid next to each other, two lamps from the same pattern are visibly the same design and very slightly different objects.

That variation is also how you tell a hand-pierced lamp from a machine-cut one — [the five checks are here](/journal/real-vs-machine-made-moroccan-lamps). And the light it throws depends as much on the bulb as on the piercing: see [which bulb to use](/journal/best-bulb-for-moroccan-lamps).

Back to the [complete guide to Moroccan brass lamps](/journal/moroccan-brass-lamps-guide).`,
};

const lightingSize: SeedPost = {
  slug: "moroccan-chandelier-size-guide",
  title: "How to choose the right size of Moroccan chandelier",
  category: "Guides",
  cluster: "lighting",
  excerpt:
    "Three measurements and two rules of thumb: how wide, how tall and how high to hang a Moroccan chandelier or pendant in any room.",
  readMinutes: 6,
  author: "Salma Bennani",
  tags: ["chandelier size", "moroccan lamps", "interiors", "lighting"],
  imageSlot: "[ journal — chandelier hung over a dining table ]",
  featured: false,
  daysAgo: 15,
  products: ["star-chandelier"],
  takeaways: [
    "Width: in centimetres, a chandelier's diameter should be about (room length + room width, in metres) × 8.",
    "Height of the fixture: allow roughly 20–25 cm of chandelier for every metre of ceiling height.",
    "Over a table, choose half to two-thirds of the table's width and hang the bottom 75–90 cm above the tabletop.",
    "Where people walk underneath, keep at least 2.1 m clear between the floor and the bottom of the lamp.",
  ],
  faqs: [
    {
      q: "How big should a chandelier be for my room?",
      a: "Add the room's length and width in metres and multiply by 8 to get a diameter in centimetres. A 4 × 5 m room suits a chandelier around 70–75 cm across; a 3 × 4 m room about 55 cm.",
    },
    {
      q: "How high should a chandelier hang over a dining table?",
      a: "With the bottom of the lamp 75–90 cm above the tabletop. Its width should be one-half to two-thirds of the table's width, so that nobody standing up hits it.",
    },
    {
      q: "What ceiling height do I need for a 1 m tall chandelier?",
      a: "Over a table, about 2.8 m or more. In a hall or anywhere people walk under it, at least 3.3 m, so that the bottom stays 2.1 m above the floor.",
    },
  ],
  body: `Choose a Moroccan chandelier by three numbers: the room's floor area, the ceiling height, and — if it hangs over a table — the table's width. The rules below are the ones lighting designers use for any chandelier; a pierced lamp only changes one thing, which is that you should err on the larger side.

Why larger? Because a pierced brass shade is visually lighter than a solid one. The piercing lets you see through it, and on the ceiling it reads smaller than the same size in fabric or glass.

## Rule 1: width from the room

**Diameter (cm) ≈ (room length + room width, in metres) × 8.**

| Room | Length + width | Chandelier diameter |
| --- | --- | --- |
| 3 × 3 m bedroom | 6 m | about 50 cm |
| 3 × 4 m dining room | 7 m | about 55 cm |
| 4 × 5 m living room | 9 m | about 70–75 cm |
| 5 × 6 m salon | 11 m | about 85–90 cm |
| Double-height entrance | — | as large as the ceiling allows |

Our [Star chandelier](/products/star-chandelier) is 80 cm wide, which by this rule suits a room of about 4.5 × 5.5 m — or any entrance hall with the height for it.

## Rule 2: height from the ceiling

**Allow roughly 20–25 cm of chandelier for every metre of ceiling height.**

A 2.6 m ceiling suits a fixture 50–65 cm tall. A 4 m ceiling can take one of 80 cm to a metre. Measure the chandelier's full height including the crown, not the shade alone.

## Rule 3: clearance underneath

This is the rule that most often decides the size in the end.

- **Anywhere people walk underneath** — halls, living rooms, landings — keep **at least 2.1 m** between the floor and the bottom of the lamp.
- **Over a dining table**, the bottom of the lamp should sit **75–90 cm above the tabletop**. Nobody walks under it, so it can hang lower.
- **Over a kitchen island**, a little higher: 80–95 cm, because people stand.

Worked example: the Star chandelier is 1 m tall. Over a table 75 cm high, with 80 cm of clearance, its top sits 2.55 m from the floor — so a 2.8 m ceiling leaves room for the chain and ceiling rose. In a hallway, 2.1 m of clearance plus 1 m of lamp plus fixings needs a ceiling of 3.3 m or more.

## Over a dining table

Choose a diameter of **one-half to two-thirds of the table's width**, and keep the edge of the lamp at least 15 cm in from each side of the table. A 100 cm wide table suits a lamp of 50–65 cm.

For a long table, two or three pendants in a row look better than one oversized chandelier. Leave 60–80 cm between them, and a little more at the ends. We make pendants [to order](/contact?topic=commission) with the drop cut to your ceiling height for exactly this.

## Stairwells and double heights

Rule 1 stops working when the ceiling is two storeys up. Here the chandelier is judged from the floor below and the landing above: hang it so its middle sits roughly level with the upper floor, and choose it large — a small lamp in a tall space looks lost.

## The cardboard test

Before you commit, cut a circle of cardboard to the diameter you are considering and have someone hold it up at the height you plan to hang it. It takes ten minutes and it is the most reliable test there is.

Next: the bulb, which decides whether the pattern appears at all — see [which bulb to use in a Moroccan lamp](/journal/best-bulb-for-moroccan-lamps). Or go back to the [complete guide to Moroccan brass lamps](/journal/moroccan-brass-lamps-guide).`,
};

const lightingReal: SeedPost = {
  slug: "real-vs-machine-made-moroccan-lamps",
  title: "Hand-pierced or machine-cut? How to tell a real Moroccan brass lamp",
  category: "Guides",
  cluster: "lighting",
  excerpt:
    "Five checks that take two minutes: the holes, the repeats, a magnet, the weight and the joints. What each one tells you about the lamp in front of you.",
  readMinutes: 6,
  author: "Youssef Amrani",
  tags: ["authenticity", "moroccan lamps", "solid brass", "buying"],
  imageSlot: "[ journal — hand-punched holes, close up ]",
  featured: false,
  daysAgo: 10,
  products: ["star-chandelier"],
  takeaways: [
    "Hand-punched holes vary very slightly in shape and depth and leave a burr on the inside face; laser-cut and die-stamped holes are identical.",
    "Solid brass is not magnetic. If a magnet sticks, the lamp is brass-plated steel.",
    "Solid brass lamps feel heavy for their size and do not flex when you press a panel.",
    "Look inside: rivets and folded tabs are traditional; heavy glue or spot welds are not.",
  ],
  faqs: [
    {
      q: "How can I tell if a lamp is solid brass?",
      a: "Hold a magnet against it. Brass is not magnetic, so a magnet that sticks means steel under a brass-coloured plating. On a hidden spot, a light scratch that shows grey or silver underneath also means plating.",
    },
    {
      q: "Is a laser-cut Moroccan lamp bad?",
      a: "Not necessarily — it can be well made. It is a different, cheaper product: perfectly regular, quicker to make, and often in thinner metal. It should be sold as machine-cut and priced accordingly.",
    },
    {
      q: "Why are some Moroccan lamps so cheap?",
      a: "Usually because of one or more of: laser or die cutting instead of hand piercing, thin sheet, or brass-plated steel instead of solid brass. Hand-piercing a large lamp takes days, which cannot be sold cheaply.",
    },
  ],
  body: `You can tell a hand-pierced solid brass lamp from a machine-cut or plated one in about two minutes, with your eyes, your hands and a fridge magnet. None of the checks damage the lamp.

Why it matters: a hand-pierced lamp and a laser-cut one can look the same in a photograph and differ five times in price. Both are legitimate products. The problem is only when one is sold as the other.

## 1. Look at the holes

Get close to a panel with the light behind it.

- **Hand-punched:** each opening is a single blow with a shaped punch, so the same shape repeats with small differences — a teardrop slightly fatter here, a dot slightly off the line there. On the inside face each hole has a small raised burr where the metal was pushed through.
- **Laser-cut:** every opening is identical and the edges are perfectly smooth, sometimes with a faint dark tint from the heat. There is no burr.
- **Die-stamped:** a whole section is punched at once by a press. The openings are identical and very crisp, and the metal is usually thin.

If you want to know what the hand process involves, we describe it in [how a Moroccan lamp is hand-pierced](/journal/how-moroccan-lamps-are-hand-pierced).

## 2. Compare two repeats

Find the same motif in two places — two points of a star, two identical panels. By hand, they will match in design and differ in detail. By machine they will overlay exactly.

## 3. Use a magnet

Brass, copper and nickel silver are not magnetic. Steel is.

If a magnet sticks, the lamp is steel with a brass-coloured coating. That is not always a disaster for a lamp that stays indoors, but it will not age like brass: where the coating wears, the steel underneath can rust. We explain why we avoid plating altogether in [why we stopped plating anything](/journal/why-we-stopped-plating-anything).

A magnet that sticks only at the fittings is normal — lamp holders and hanging hooks are often steel.

## 4. Feel the weight and the sheet

Solid brass is dense. A lamp in proper sheet feels heavier than it looks. Press gently on a flat panel with a fingertip: good sheet stays put; thin sheet flexes and may keep the dent.

## 5. Look at how it is joined

Turn it over, or look inside with a torch. Traditional lamps are assembled with small rivets, folded tabs and solder. Heavy glue, visible spot welds or plastic fittings are signs of a lamp made to a price.

## What about the price?

Price is a clue, not a proof. A large hand-pierced lamp represents days of work before the metal is counted, so it cannot be cheap. For reference, our [Star chandelier](/products/star-chandelier), 1 m tall in solid brass, is 5,000 MAD at the workshop. A lamp of the same size for a fraction of that is almost certainly machine-cut, thin, plated, or all three.

## In the souk

The same checks work in any market — carry a small magnet. A good seller will not mind, and many will tell you straight away which lamps are hand-pierced and which are not. We have more advice for buying in person in [buying handmade metalwork from Marrakech](/journal/buying-handmade-metalwork-marrakech).

Back to the [complete guide to Moroccan brass lamps](/journal/moroccan-brass-lamps-guide).`,
};

const lightingBulb: SeedPost = {
  slug: "best-bulb-for-moroccan-lamps",
  title: "Which bulb to use in a Moroccan lamp",
  category: "Guides",
  cluster: "lighting",
  excerpt:
    "Clear or frosted, warm or cool, one bulb or several: what each choice does to the pattern a pierced brass lamp throws on the walls.",
  readMinutes: 5,
  author: "Salma Bennani",
  tags: ["bulbs", "moroccan lamps", "lighting", "led"],
  imageSlot: "[ journal — clear and frosted bulb, same lamp ]",
  featured: false,
  daysAgo: 8,
  products: ["star-chandelier"],
  takeaways: [
    "Use a clear bulb with a small filament: the smaller the light source, the sharper the pattern on the walls. Frosted bulbs blur it.",
    "Choose warm white, 2700 K. Brass already warms the light, and cooler bulbs look grey through it.",
    "LED is the right choice inside a closed metal shade because it runs cool; around 400–800 lumens per bulb is plenty.",
    "Several bulbs in one lamp cast several overlapping patterns, which softens them — one central bulb gives the crispest shadows.",
  ],
  faqs: [
    {
      q: "What bulb gives the best pattern in a Moroccan lamp?",
      a: "A clear LED filament bulb in warm white (2700 K). A small, clear light source throws sharp, defined shadows through the piercing; a frosted or opal bulb spreads the light and blurs the pattern.",
    },
    {
      q: "Can I use an LED bulb in a brass lamp?",
      a: "Yes, and it is the best choice. LEDs run far cooler than incandescent bulbs inside a closed metal shade and use a fraction of the power. Check the fitting (usually E14 or E27 in Morocco and Europe) and the maximum wattage marked on the lamp.",
    },
    {
      q: "Can Moroccan lamps be dimmed?",
      a: "Yes, if both the bulb and the dimmer switch are compatible. Use bulbs marked dimmable and an LED-rated dimmer; a pierced lamp dimmed low is one of the nicest lights there is.",
    },
  ],
  body: `The best bulb for a Moroccan lamp is a **clear, warm-white (2700 K) LED with a small filament**. It gives the sharpest pattern, the warmest colour through brass, and it runs cool inside a closed metal shade.

The rest of this article explains why, so you can make a good choice for your own lamp.

## Clear or frosted? Why the size of the source matters

A pierced lamp works like a shadow puppet. Each opening lets a beam of light through and the wall catches it. How sharp that beam is depends on how small the light source is.

- A **clear bulb** with a thin filament is a small source. Each opening casts a crisp shape, and the pattern on the wall looks like the pattern on the lamp.
- A **frosted or opal bulb** glows across its whole surface. It is a large source, so each shape blurs into its neighbours and the walls get a soft wash instead.

Neither is wrong. For the full effect the lamp was made for, choose clear. If you want a softer, calmer light — in a bedroom, say — frosted works well. (It is the same physics that decides how we light the bench; see [a north-facing window](/journal/a-north-facing-window).)

## Colour temperature

| Colour temperature | What it looks like through brass |
| --- | --- |
| 2200–2400 K | Deep amber, candle-like. Beautiful, but dim. |
| **2700 K** | Warm gold. The one we recommend. |
| 3000 K | Neutral warm. Fine through nickel silver. |
| 4000 K and above | Grey and flat through brass. Avoid. |

## Brightness

Much of the light is stopped by the metal — that is where the pattern comes from — so a pierced lamp gives less light to read by than an open shade.

- **Pendants and sconces:** 400–500 lumens per bulb (the old 40 W equivalent).
- **Chandeliers:** 600–800 lumens per bulb, across several bulbs.
- If you need to read or cook under it, add another light source rather than a brighter bulb. Too bright a bulb makes the pattern glare.

## One bulb or several?

Each bulb casts its own copy of the pattern. With one central bulb you get one sharp pattern. With four bulbs, you get four overlapping patterns, which read as a softer, busier texture on the walls. Large chandeliers like our [Star chandelier](/products/star-chandelier) need several bulbs to fill the shade with light; for the crispest effect in a small room, a single-bulb sconce or pendant is hard to beat.

## Fittings and safety

- **Fitting:** most lamps in Morocco and Europe use E14 (small screw) or E27 (standard screw). Check the holder before you buy bulbs.
- **Wattage:** respect the maximum marked on the lamp. With LEDs you will be far below it.
- **Heat:** incandescent and halogen bulbs heat a closed metal shade quickly. LEDs do not, which also means the brass is not discoloured by heat over the years.
- **North America:** mains there is 120 V and the standard screw fitting is E26. Have a local electrician check any lamp bought abroad before you use it.

## Dimming

A pierced lamp turned low is one of the nicest lights there is. Use bulbs marked *dimmable* and a dimmer rated for LED loads, or you will get flicker and hum.

Next in the guide: [how to clean a Moroccan brass lamp](/journal/how-to-clean-a-moroccan-brass-lamp). Or go back to the [complete guide to Moroccan brass lamps](/journal/moroccan-brass-lamps-guide).`,
};

const lightingClean: SeedPost = {
  slug: "how-to-clean-a-moroccan-brass-lamp",
  title: "How to clean a Moroccan brass lamp",
  category: "Care",
  cluster: "lighting",
  excerpt:
    "Dust once a month, polish once a year or never. The safe way to clean a pierced brass lamp, and the one mistake that damages it.",
  readMinutes: 5,
  author: "Youssef Amrani",
  tags: ["cleaning", "moroccan lamps", "brass care", "patina"],
  imageSlot: "[ journal — brushing dust from a pierced panel ]",
  featured: false,
  daysAgo: 5,
  products: ["star-chandelier"],
  takeaways: [
    "Always switch off, let the lamp cool and remove the bulbs first.",
    "Dust is the main job: once a month, a soft, dry paintbrush through the piercing, or a hairdryer on cold.",
    "To remove tarnish from unlacquered brass, use a mild brass polish on a soft cloth and buff off every trace. Never use abrasive pads.",
    "If the lamp is lacquered, do not polish it at all — wipe with a barely damp cloth and dry it.",
  ],
  faqs: [
    {
      q: "How do I get dust out of a pierced metal lamp?",
      a: "With a soft, dry paintbrush worked through the openings, from the top down. A hairdryer on its cold setting or a can of compressed air clears what the brush cannot reach. Avoid water near the lamp holders.",
    },
    {
      q: "Can I use lemon and salt to clean brass?",
      a: "On unlacquered solid brass, yes: a paste of lemon juice and salt (or vinegar, salt and a little flour) removes tarnish. Rinse it off completely and dry the piece, because acid left in the piercing keeps working. Keep it well away from the wiring — on a lamp, a commercial brass polish on a cloth is easier to control.",
    },
    {
      q: "How do I know if my brass lamp is lacquered?",
      a: "A lacquered lamp keeps the same bright, even shine for years and does not darken where it is handled; a polishing cloth rubbed on it stays clean. Unlacquered brass darkens within months and leaves a black mark on a polishing cloth.",
    },
  ],
  body: `To clean a Moroccan brass lamp, **switch it off, let it cool, take the bulbs out, and brush the dust out of the piercing with a soft, dry paintbrush**. That is most of it. Tarnish is optional: you can polish it off once a year, or let the lamp darken and never polish it at all.

This article is about lamps. For brass in general — trays, bowls, door furniture — see our [complete brass care guide](/journal/brass-care-guide).

## Before you start

1. Switch the lamp off at the wall, not just at the chain.
2. Let it cool for fifteen minutes if it has older bulbs.
3. Remove the bulbs. If the lamp comes apart (some have a removable base or top), take it apart over a towel.

## Monthly: dust

Dust is what makes a pierced lamp look tired — it clogs the openings and dims the pattern long before tarnish does.

- Work a **soft, dry paintbrush** (2–3 cm wide) through the piercing from the top down.
- For deep chambers, a **hairdryer on the cold setting** or a can of **compressed air** blows out what the brush cannot reach.
- Finish with a dry microfibre cloth on the flat surfaces.

No water. Moisture near the lamp holders is the one real hazard in cleaning a lamp.

## First, is it lacquered?

This decides everything that follows.

- **Lacquered:** the shine is bright and even and has not changed in years. A polishing cloth rubbed on it stays clean. Do **not** polish it — you will cut through the lacquer and leave patches. Wipe with a barely damp cloth, dry immediately, and that is all.
- **Unlacquered (bare):** it has darkened unevenly, darker in the recesses, brighter where hands touch it. A polishing cloth comes away black. This is how we make ours, and it can be polished as often as you like.

## Once a year, or never: polish

If you want bare brass bright again:

1. Put a **small amount of mild brass polish** on a soft cloth — not on the lamp.
2. Work along the surfaces, not in circles, a panel at a time.
3. Keep polish **out of the openings** as far as you can: polish left in the piercing dries pale and keeps working.
4. **Buff off every trace** with a clean cloth, then use a dry brush to lift any residue from the holes.
5. If you want the brightness to last, a very thin coat of microcrystalline wax, buffed off, holds it for around six months.

Home remedies — lemon and salt, or vinegar with salt and flour — work on bare brass too, but they are wet and acidic. On a lamp full of holes and wiring, a commercial polish on a cloth is much easier to control.

## What damages a brass lamp

- **Abrasive pads, wire wool, scouring powder.** They scratch the surface permanently. This is the only mistake that cannot be undone.
- **Soaking or rinsing** a wired lamp.
- **Polish or acid left in the piercing.**
- **Ammonia-based glass cleaners**, which can stain brass.

## Or let it age

A bare brass lamp that is never polished goes from bright yellow to a warm, deep brown over a year or so, and then stays there. Many people prefer it — the light through a darker shade is warmer still. What to expect month by month is in [living with a patina](/journal/living-with-a-patina).

Back to the [complete guide to Moroccan brass lamps](/journal/moroccan-brass-lamps-guide).`,
};

/* ==================================================================== care */

const carePillar: SeedPost = {
  slug: "brass-care-guide",
  title: "How to care for solid brass: the complete guide",
  category: "Guides",
  cluster: "care",
  excerpt:
    "Everyday care, removing tarnish, living with a patina, lacquered versus bare, and the few things that genuinely damage brass, bronze and copper.",
  readMinutes: 8,
  author: "The Maker",
  tags: ["brass care", "patina", "cleaning", "tarnish"],
  imageSlot: "[ journal — polishing cloth and a half-polished bowl ]",
  featured: false,
  daysAgo: 3,
  products: [],
  takeaways: [
    "Solid, unlacquered brass needs only a dry cloth day to day; it will darken over months, and that is not damage.",
    "To remove tarnish, use a mild brass polish sparingly on a soft cloth, work along the surface and buff off every trace.",
    "Never use abrasive pads, wire wool or scouring powder: scratches are the only damage that cannot be reversed.",
    "Lacquered brass should not be polished at all — only wiped with a damp cloth and dried.",
    "To slow tarnish without lacquer, apply a thin coat of microcrystalline wax; it lasts about six months.",
  ],
  faqs: [
    {
      q: "What is the best way to clean brass?",
      a: "For everyday dirt, a dry or barely damp cloth, then dry the piece. For tarnish on unlacquered brass, a mild brass polish on a soft cloth, used sparingly and buffed off completely. Avoid anything abrasive.",
    },
    {
      q: "Why does brass turn dark?",
      a: "The copper in brass reacts with oxygen, moisture and sulphur compounds in the air to form a thin layer of oxides and sulphides — the patina. Skin salts, steam and cooking acids speed it up, which is why handled and kitchen pieces darken first.",
    },
    {
      q: "Does brass turn green?",
      a: "Brass indoors almost never does. Green verdigris forms on copper and brass left wet or outdoors for long periods, especially near salt air. Indoors, brass goes gold-brown and then a stable dark brown.",
    },
    {
      q: "Can brass go in the dishwasher?",
      a: "No. Dishwasher detergent is harsh enough to stain and dull brass unevenly, and it ruins felt, cork or tinned surfaces. Wash by hand in warm soapy water and dry immediately.",
    },
  ],
  body: `Solid brass needs very little care. **Day to day, a dry cloth. When you want it bright, a little brass polish, buffed off completely. Never anything abrasive.** Everything else in this guide is detail on those three sentences.

It applies to brass, bronze and copper alike, and to everything we make — bowls, trays, door furniture and lamps. If you are unsure which metal you have, start with [the difference between brass, bronze and copper](/journal/brass-bronze-copper-difference).

## First: is it bare or lacquered?

Almost every question about brass care depends on this.

| | Bare (unlacquered) | Lacquered |
| --- | --- | --- |
| How it looks over time | Darkens unevenly over months | Stays bright for years, then yellows and peels |
| Polishing cloth test | Cloth comes away black | Cloth stays clean |
| Can you polish it? | Yes, as often as you like | No — you will cut through the lacquer |
| How to clean it | Dry cloth; polish when you want | Damp cloth, then dry |

Everything we make is bare. We explain why in [why we stopped plating anything](/journal/why-we-stopped-plating-anything) — in short, a finish is the part of any metal object that fails first, and bare metal has no finish to fail.

## Everyday care

- **Wipe with a dry, soft cloth.** Microfibre is ideal.
- **For sticky marks,** a cloth barely damp with warm water and a drop of washing-up liquid, then dry straight away.
- **Pieces that hold food** — trays, bowls — wash by hand in warm soapy water and dry at once. Never the dishwasher.
- **Fingerprints** on bare brass show as dark marks within a couple of weeks. They are the first sign of patina, not damage.

## Removing tarnish

When you want bare brass bright again:

1. A **small amount of mild brass polish** on a soft cloth.
2. **Work along the surface** — with the direction of a brushed finish, not in circles.
3. **Buff off every trace** with a clean cloth. Polish left in a corner or a recess keeps working and leaves a pale halo.
4. For a hammered surface, a soft brush lifts residue from the hollows.

**Home methods** work on bare brass: lemon juice and salt, or a paste of white vinegar, salt and flour, applied, left for a few minutes, then rinsed off completely and dried. They are acidic — rinse thoroughly, and do not use them on lacquered pieces or near wiring.

For lamps, which are full of holes and electrical parts, follow [how to clean a Moroccan brass lamp](/journal/how-to-clean-a-moroccan-brass-lamp) instead.

## Living with a patina

If you do nothing, bare brass goes through a predictable year: fingerprints in the first weeks, an uneven gold-brown between months two and six, and a stable, deep brown after that — bright where hands touch it, dark in the shadows. The month-by-month version, with the three moments people worry, is in [living with a patina](/journal/living-with-a-patina).

Both states — bright and dark — are correct. You can move between them whenever you like.

## Slowing it down without lacquer

A **thin coat of microcrystalline wax**, rubbed on and buffed to nothing, slows tarnish for around six months. It is what museums use on bronze. It does not yellow, and white spirit removes it. We wax every piece before it leaves the workshop.

## What actually damages brass

The list is short:

- **Abrasive pads, wire wool, scouring powder** — permanent scratches. The one genuine mistake.
- **Dishwashers.**
- **Standing water**, especially salt water, left for days.
- **Polish or acid left on the surface.**
- **Ammonia and bleach-based cleaners.**

Heat, cold, sunlight, knocks and years of neglect are all survivable, and mostly invisible in the end. The brass hardware we spent a decade [repairing](/journal/notes-on-repairing-other-peoples-work) had survived a century of all of them.

## Repairs

We repair anything we made, free, for as long as we are at the bench. See our [care and repair page](/care), or [write to us](/contact?topic=repair).`,
};

const careMetals: SeedPost = {
  slug: "brass-bronze-copper-difference",
  title: "Brass, bronze or copper: what is the difference?",
  category: "Materials",
  cluster: "care",
  excerpt:
    "What each alloy is made of, how to tell them apart at a glance, how each one ages, and which to choose for what.",
  readMinutes: 5,
  author: "Youssef Amrani",
  tags: ["brass", "bronze", "copper", "materials"],
  imageSlot: "[ journal — brass, bronze and copper offcuts side by side ]",
  featured: false,
  daysAgo: 18,
  products: [],
  takeaways: [
    "Copper is a pure metal. Brass is copper alloyed with zinc. Bronze is copper alloyed mainly with tin.",
    "Brass is bright yellow, bronze a darker brown-gold, copper a pinkish red.",
    "Bronze is the hardest and best outdoors or for moving parts; brass is easiest to work and polish; copper is the softest and best for hammering and heat.",
    "Nickel silver, used for silver-coloured Moroccan lamps, contains no silver: it is copper, nickel and zinc.",
  ],
  faqs: [
    {
      q: "Is brass or bronze better?",
      a: "Neither is better overall. Bronze is harder, more resistant to corrosion and better outdoors or in moving parts such as hinges. Brass is easier to cut, pierce and polish, and brighter in colour, which is why it is used for most lamps and decorative pieces.",
    },
    {
      q: "How can I tell brass from bronze?",
      a: "By colour, side by side: brass is a brighter, more lemon yellow; bronze is darker and browner, closer to old gold. Both are non-magnetic. Bronze is also noticeably harder and rings with a duller note.",
    },
    {
      q: "What is nickel silver?",
      a: "An alloy of copper, nickel and zinc with a silver-white colour. It contains no silver. In Morocco it is called maillechort and is widely used for silver-coloured lamps and trays.",
    },
  ],
  body: `All three are copper, more or less. **Copper** is the pure metal. **Brass** is copper with zinc added. **Bronze** is copper with tin (and sometimes silicon, aluminium or other elements). The alloying changes the colour, the hardness and how each one ages.

## At a glance

| | Copper | Brass | Bronze |
| --- | --- | --- | --- |
| Made of | Pure copper | Copper + zinc (e.g. 63 % / 37 %) | Copper + tin (around 88 % / 12 %) |
| Colour when new | Pinkish red | Bright yellow | Brown-gold |
| Colour when aged indoors | Dark brown | Warm, deep brown | Chocolate brown |
| Hardness | Soft | Medium | Hard |
| Best for | Hammered vessels, cookware, anything shaped cold | Lamps, pierced work, trays, door furniture | Castings, outdoor fittings, hinges, knockers |
| Magnetic? | No | No | No |

## Brass

Copper and zinc. The brass we use for sheet work is 63 % copper and 37 % zinc — its standard name is CuZn37. It is the easiest of the three to cut, pierce and polish, and it has the brightest colour, which is why it is the classic metal for [Moroccan lamps](/journal/moroccan-brass-lamps-guide) and for raised bowls and trays.

It work-hardens as you hammer it and has to be softened by heating (annealing) as you go — we describe that in [anatomy of a forged bowl](/journal/anatomy-of-a-forged-bowl).

## Bronze

Copper and tin, classically; modern "silicon bronze" replaces much of the tin with silicon. Bronze is harder and resists corrosion better than brass, particularly outdoors and in salt air. It casts beautifully. We use it for anything that is cast, turns, or lives outside — a door knocker, for instance, is best bronze on bronze throughout.

## Copper

The pure metal. Softest of the three, and the best conductor of heat, which is why it is used for cookware (tinned on the inside for food). It hammers very well and takes a deep pinkish-brown patina. Left outdoors and wet for years, copper and its alloys can form green verdigris; indoors they almost never do.

Copper trays and pans meant for food are tinned on the inside.

## Nickel silver

The fourth metal you will meet in Moroccan work. Copper, nickel and zinc; silver-white in colour; no silver in it at all. It is called *maillechort* in Morocco and used for silver-coloured lamps and tea trays. It tarnishes more slowly than brass and to a greyer tone.

## Solid or plated?

All of the above are non-magnetic. If a magnet sticks to a "brass" object, it is steel with a brass-coloured plating — see [why we stopped plating anything](/journal/why-we-stopped-plating-anything), and [the five checks for a real brass lamp](/journal/real-vs-machine-made-moroccan-lamps).

## Caring for them

The same rules work for all three: a dry cloth, a mild polish when you want it bright, never anything abrasive. The details are in [how to care for solid brass](/journal/brass-care-guide).`,
};

/* =================================================================== craft */

const craftPillar: SeedPost = {
  slug: "moroccan-metalwork-guide",
  title: "Moroccan metalwork: a guide to dinanderie",
  category: "Guides",
  cluster: "craft",
  excerpt:
    "The craft of hammered, pierced and chased metal in Morocco: its techniques, its metals, its patterns, its cities and the way it is still passed on.",
  readMinutes: 8,
  author: "The Maker",
  tags: ["dinanderie", "moroccan craft", "metalwork", "marrakech", "fes"],
  imageSlot: "[ journal — the bench, tools laid out ]",
  featured: false,
  daysAgo: 33,
  products: ["star-chandelier"],
  takeaways: [
    "Dinanderie is the craft of shaping objects from sheet copper and its alloys — brass, bronze, nickel silver — by hammering, piercing, chasing and engraving.",
    "The core techniques are raising, planishing, piercing, chasing and repoussé, engraving, and casting.",
    "In Morocco the craft is concentrated in Fès, Marrakech and Meknès, and it is still largely passed from a master (maâlem) to apprentices at the bench.",
    "Moroccan metalwork patterns are mostly geometric — stars and interlaced polygons shared with zellij tilework — combined with floral arabesques.",
  ],
  faqs: [
    {
      q: "What is dinanderie?",
      a: "Dinanderie is the craft of making objects from sheet copper and copper alloys such as brass by hammering and shaping them. The word is French, from the town of Dinant in Belgium, and it is the usual name for the trade in Morocco too.",
    },
    {
      q: "Where is Moroccan metalwork made?",
      a: "Mainly in the old medinas of Fès — known for brass and copper vessels, around the coppersmiths' square, Place Seffarine — and Marrakech, known for lanterns and lamps. Meknès is known for damascene, silver wire inlaid into iron.",
    },
    {
      q: "What is a maâlem?",
      a: "A maâlem is a master craftsman. In Moroccan crafts, apprentices learn at a maâlem's bench over years, and the title is earned by skill recognised within the trade rather than by a formal diploma.",
    },
  ],
  body: `Moroccan metalwork — *dinanderie* — is the craft of making objects from sheet copper, brass, bronze and nickel silver by hand: hammering vessels up from flat sheet, piercing lamps, chasing and engraving trays. It is one of the major crafts of the Moroccan medinas, alongside zellij, woodwork and leather, and it is still largely taught at the bench, from a master to apprentices.

We have practised it in Marrakech since 2001. This guide is an overview; each technique links to an article with the detail.

## Where the word comes from

*Dinanderie* comes from Dinant, a town in Belgium that was famous in the Middle Ages for its brass work. French made it the general word for the craft, and in Morocco it is the name the trade uses for itself. In Darija, brass and copper are both *nhas*.

## The metals

- **Brass** (copper and zinc) — bright yellow; lamps, trays, door furniture.
- **Copper** — pinkish red; vessels, cookware, anything hammered cold.
- **Bronze** (copper and tin) — hard and brown-gold; castings and outdoor pieces.
- **Nickel silver** (*maillechort*) — silver-white; lamps and tea trays.

More on each in [brass, bronze or copper: what is the difference?](/journal/brass-bronze-copper-difference)

## The techniques

**Raising.** Hammering a flat disc over a steel stake, course by course, until it becomes a hollow form. Nothing is cut away; the metal is moved. It is how every bowl is made — see [anatomy of a forged bowl](/journal/anatomy-of-a-forged-bowl).

**Planishing.** The final course of hammering with a polished hammer on a polished stake, which smooths and hardens the surface and leaves its faceted texture. It can only be judged in good light — the reason for [a north-facing window](/journal/a-north-facing-window).

**Piercing.** Punching a pattern through sheet metal with small shaped chisels, one opening at a time. It is the technique behind every Moroccan lamp: see [how a Moroccan lamp is hand-pierced](/journal/how-moroccan-lamps-are-hand-pierced).

**Chasing and repoussé.** Pushing a design into the metal from the front (chasing) or raising it from the back (repoussé) with blunt punches, without removing metal. It gives trays and vessels their raised decoration.

**Engraving.** Cutting lines into the surface with a sharp graver — the fine decoration on a tea tray.

**Casting.** Pouring molten bronze or brass into a mould. Used for handles, knockers and fittings that must be solid.

**Damascene.** Hammering fine silver wire into a cross-hatched iron surface — a speciality of Meknès.

## The patterns

Moroccan metalwork shares its geometry with zellij tilework and carved plaster: multi-pointed stars, interlaced polygons and rosettes, all constructed with compass and ruler. Between them run floral arabesques and, on some pieces, calligraphy. The geometry is set out first, precisely; the fill is drawn by hand.

## The cities

- **Fès** — the historic centre for brass and copper vessels; the coppersmiths still work around Place Seffarine in the medina.
- **Marrakech** — lanterns and lamps above all, in the souks north of Jemaa el-Fna and around Place des Ferblantiers.
- **Meknès** — damascene.

## How it is passed on

A maâlem — a master — takes apprentices, who learn by doing the simplest jobs first and the hardest ones last, over years. There is no shortcut to it. The judgment of when metal needs annealing, from the sound under the hammer, or of whether a surface is right, is learned only at the bench.

Part of how we learned was [repairing other people's work](/journal/notes-on-repairing-other-peoples-work) for a decade before we made our own.

## Seeing it for yourself

If you are in Marrakech, you can watch the work in the medina or [visit our workshop](/contact#visit). What to look for, and how to buy well, is in [buying handmade metalwork from Marrakech](/journal/buying-handmade-metalwork-marrakech).`,
};

/* ================================================================== buying */

const buyingPillar: SeedPost = {
  slug: "buying-handmade-metalwork-marrakech",
  title: "Buying handmade metalwork from Marrakech: a practical guide",
  category: "Guides",
  cluster: "buying",
  excerpt:
    "Souk, workshop or online; what things should cost; how to check what you are buying; commissions; and getting it home.",
  readMinutes: 8,
  author: "Salma Bennani",
  tags: ["buying", "marrakech", "souk", "commissions", "shipping"],
  imageSlot: "[ journal — lanterns hanging in the souk ]",
  featured: false,
  daysAgo: 47,
  products: ["star-chandelier"],
  takeaways: [
    "You can buy Moroccan metalwork in the medina souks, directly from a workshop, or online; workshops and online shops usually have fixed prices, souks expect bargaining.",
    "Before you buy, check the piece is solid metal (a magnet will not stick) and, for lamps, hand-pierced rather than machine-cut.",
    "Commissions take four to six weeks and are quoted at a fixed price; on runs of more than six pieces you approve a sample first.",
    "Shipping outside Morocco is quoted piece by piece; import duties and VAT are paid in the destination country.",
  ],
  faqs: [
    {
      q: "Where to buy Moroccan lamps in Marrakech?",
      a: "In the medina, lamps and lanterns are sold in the souks north of Jemaa el-Fna and around Place des Ferblantiers. You can also buy directly from workshops, which usually have fixed prices and can make to order — ours is in Guéliz.",
    },
    {
      q: "Should I bargain for metalwork in Marrakech?",
      a: "In the souks, bargaining is expected and a first price is an opening. In workshops and shops with marked prices, including ours, prices are fixed.",
    },
    {
      q: "Can I ship a Moroccan chandelier home?",
      a: "Yes. Large lamps are packed in a made-to-measure crate or double box and sent by express courier. The price depends on size and destination, and the buyer pays import duty and VAT on arrival.",
    },
    {
      q: "Can I visit a metal workshop in Marrakech?",
      a: "Many workshops welcome visitors. Ours is open for visits on set days each week; check the contact page for current hours before you come.",
    },
  ],
  body: `There are three ways to buy handmade metalwork from Marrakech: **in the medina souks, directly from a workshop, or online**. The metal can be exactly the same in all three; what changes is how sure you can be of what you are getting, whether the price is fixed, and whether you can have something made.

We are a workshop, so we are not neutral — but everything below applies wherever you buy.

## Souk, workshop or online?

| | Medina souks | Workshop | Online |
| --- | --- | --- | --- |
| Choice | Enormous | The maker's own range | Varies |
| Prices | Negotiated | Fixed | Fixed |
| Can you see it made? | Sometimes | Yes | No |
| Made to order | Rarely | Yes | Sometimes |
| Shipping abroad | Arranged by the seller, variable | Arranged by the workshop | Built in |

**The souks** are worth the visit for the spectacle alone. Lamps and lanterns are concentrated north of Jemaa el-Fna and around Place des Ferblantiers. Bargaining is expected; a first price is an opening, not an insult.

**A workshop** lets you see how the piece is made, talk to the person who made it, and order something that does not exist yet.

**Online**, look for the dimensions, the metal and the technique stated plainly — "solid brass, hand-pierced" rather than "brass-effect" or "metal".

## Check what you are buying

Whatever the setting, two checks take a minute:

1. **Is it solid?** Brass, copper and bronze are not magnetic. If a magnet sticks, it is plated steel.
2. **Is it handmade?** Hand-punched holes vary slightly; machine-cut ones are identical.

The full list is in [hand-pierced or machine-cut?](/journal/real-vs-machine-made-moroccan-lamps). If you are not sure which metal you are looking at, see [brass, bronze or copper](/journal/brass-bronze-copper-difference).

## What things cost

Our own price, as a reference point for handmade work in solid metal: the [Star chandelier](/products/star-chandelier), 1 m tall and hand-pierced in solid brass, is 5,000 MAD. Commissions are quoted at a fixed price — see below.

The cost of a handmade piece is mostly hours. That is why a large hand-pierced lamp cannot be cheap, and why a very low price is worth a second look.

## Commissions

If you want something that is not in the range — a size, a set, a matching piece — we make it to order. Commissions take four to six weeks, are quoted as a fixed price within two days, and on runs of more than six pieces we send a sample before we make the rest. How a quote is built, line by line, is in [what a commission actually costs](/journal/what-a-commission-actually-costs).

## Getting it home

- **In Morocco:** we deliver by insured, tracked courier in two to four working days; see [shipping](/shipping).
- **Abroad:** quoted piece by piece, because a crated chandelier and a boxed bowl are different problems. What is involved — packing, carriers, customs, voltage — is in [shipping a Moroccan chandelier abroad](/journal/shipping-a-moroccan-chandelier-abroad).
- **In your luggage:** small pieces travel well wrapped in clothes. A large lamp does not; send it.

## Visiting the workshop

We are in Guéliz, the new town, a short taxi ride from the medina. You can see work on the bench, handle the range, and talk through a commission. [Visiting hours and directions are here](/contact#visit) — please check them before you come.

If you want to understand the craft before you buy, start with our [guide to Moroccan metalwork](/journal/moroccan-metalwork-guide).`,
};

const buyingShipping: SeedPost = {
  slug: "shipping-a-moroccan-chandelier-abroad",
  title: "Shipping a Moroccan chandelier abroad: what to expect",
  category: "Guides",
  cluster: "buying",
  excerpt:
    "How a large brass lamp is packed, which carrier takes it, how long it takes, what customs will charge, and what to check about the wiring when it arrives.",
  readMinutes: 5,
  author: "Salma Bennani",
  tags: ["shipping", "international", "customs", "moroccan lamps"],
  imageSlot: "[ journal — a chandelier crated for shipping ]",
  featured: false,
  daysAgo: 65,
  products: ["star-chandelier"],
  takeaways: [
    "A large chandelier is wrapped in felt, blocked so it cannot move, and packed in a made-to-measure crate or double-walled box.",
    "It travels by express courier; the price depends on the packed size and weight and on the destination, so it is quoted piece by piece.",
    "Import duty and VAT are charged by the destination country and paid by the buyer on delivery.",
    "Outside Europe, have a local electrician check the wiring and fitting before the lamp is used.",
  ],
  faqs: [
    {
      q: "How much does it cost to ship a chandelier from Morocco?",
      a: "It depends on the packed dimensions, the weight and the destination, because couriers charge by whichever is greater of actual and volumetric weight. A large chandelier in a crate is priced very differently from a small pendant in a box, so we quote each one before you order.",
    },
    {
      q: "Do I pay customs on a lamp shipped from Morocco?",
      a: "Usually yes: the destination country charges import duty and VAT or sales tax on arrival, collected by the courier before delivery. Lamps and light fittings fall under customs heading 9405.",
    },
    {
      q: "Will a Moroccan lamp work in the USA?",
      a: "Morocco uses 220 V mains and E14/E27 fittings; the USA and Canada use 120 V and E26 fittings. The lamp shade is unaffected, but the lamp holders and wiring should be checked or replaced by a local electrician before use.",
    },
  ],
  body: `A Moroccan chandelier can be shipped anywhere a courier goes. **It is wrapped in felt, blocked inside a made-to-measure crate or double box, and sent by express courier; you pay the shipping up front and the import duty and VAT on arrival.** Here is what each step involves, so there are no surprises.

## Why we quote shipping piece by piece

Couriers charge by weight — but for bulky items, by *volumetric* weight: the size of the package converted to a notional weight. A 1 m chandelier weighs relatively little and takes up a great deal of space, so its crate, not its metal, sets the price. A bowl in a small box is a completely different sum. That is why there is no single international rate on the site: [write to us](/contact?topic=order) before you order and we will price it with the carrier.

## How it is packed

1. The lamp is cleaned and the bulbs removed.
2. Any part that comes apart is taken apart and packed separately.
3. Each piece is wrapped in wool felt, then blocked with board so that nothing touches the walls of the crate.
4. The crate or double-walled box is made to the lamp's size.

No plastic foam: wool felt and recycled board, as for everything we send.

## Carrier and transit time

Large pieces go by express courier with tracking and insurance. To Europe, transit is usually a few working days from collection; further afield, a little longer. The courier's estimate for your address comes with the quote.

## Customs, duty and VAT

- The **destination country** charges import duty and VAT (or sales tax), based on the value of the piece and the shipping.
- The courier normally **collects these before delivery**, sometimes with a small handling fee.
- Lamps and light fittings are classed under customs heading **9405**. We include a full commercial invoice with the shipment.
- Rates vary by country. If you want to know in advance, your national customs website will have a calculator.

## Voltage and fittings

- **Europe and most of Africa, the Middle East and Asia:** 220–240 V, like Morocco. E14 and E27 lamp holders are standard. Nothing to change.
- **UK:** 230 V; the lamp works, but it arrives with a European plug or bare wires for a ceiling rose — have an electrician fit it.
- **USA and Canada:** 120 V and E26 lamp holders. The shade and structure are fine; the holders and wiring should be checked or replaced locally before use.

Whatever the destination, a ceiling chandelier should be installed by a qualified electrician. Choosing the bulb afterwards is covered in [which bulb to use in a Moroccan lamp](/journal/best-bulb-for-moroccan-lamps).

## If something arrives damaged

Photograph the packaging and the piece before you unpack any further, and tell us the same day. The shipment is insured for its full declared value; we deal with the carrier and either repair or replace the piece — see [shipping and returns](/shipping). Brass dents can usually be taken out at the bench.

Back to [buying handmade metalwork from Marrakech](/journal/buying-handmade-metalwork-marrakech), or see our [Star chandelier](/products/star-chandelier).`,
};

export const guidePosts: SeedPost[] = [
  lightingPillar,
  lightingPiercing,
  lightingSize,
  lightingReal,
  lightingBulb,
  lightingClean,
  carePillar,
  careMetals,
  craftPillar,
  buyingPillar,
  buyingShipping,
];
