// Think Clearly hub hero: a student thinking in a school hallway, Bible
// under his arm. The photo ships as a base64 data URI because the site's
// file pipeline is text-only; the chunks live in ./heroImage/ and are only
// loaded via dynamic import from the Think Clearly hub, so no other page's
// bundle carries this weight.
import { HERO_PART_1 } from "./heroImage/part1";
import { HERO_PART_2 } from "./heroImage/part2";
import { HERO_PART_3 } from "./heroImage/part3";

export const THINK_CLEARLY_HERO_SRC =
  "data:image/webp;base64," + HERO_PART_1 + HERO_PART_2 + HERO_PART_3;
