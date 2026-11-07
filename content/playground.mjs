// ─────────────────────────────────────────────────────────────────────────────
//  PLAYGROUND — experiments and personal work
//
//  To add a piece:
//    1. Put the source image in assets/source/ and add it to tools/optimize-images.mjs
//       (or export WebP yourself into src/assets/img/playground/).
//    2. Add an entry below. `image` is the path WITHOUT the "-<width>.webp" suffix;
//       `widths` lists the files that exist, smallest first.
//    3. `shape`: 'tall' | 'wide' | 'square' controls the tile in the grid.
//  If the list is empty, the section shows an "experiments loading" empty state.
// ─────────────────────────────────────────────────────────────────────────────

export const playground = [
  {
    title: 'The Witcher',
    medium: 'Concept art · Photo-manipulation',
    image: '/assets/img/playground/witcher',
    widths: [720, 1400],
    ratio: [1400, 2100],
    shape: 'tall',
  },
  {
    title: 'Cthulhu Extermination',
    medium: 'Concept art · Photo-manipulation',
    image: '/assets/img/playground/cthulhu',
    widths: [800, 1600],
    ratio: [1600, 900],
    shape: 'wide',
  },
  {
    title: 'Basilisk Snake Hunter',
    medium: 'Concept art · Photo-manipulation',
    image: '/assets/img/playground/basilisk',
    widths: [720, 1400],
    ratio: [1400, 1750],
    shape: 'tall',
  },
  {
    title: 'Thalassophobia',
    medium: 'Concept art · Photo-manipulation',
    image: '/assets/img/playground/thalassophobia',
    widths: [800, 1600],
    ratio: [1600, 900],
    shape: 'wide',
  },
  {
    title: 'Dead Rhino',
    medium: 'Concept art · Photo-manipulation',
    image: '/assets/img/playground/dead-rhino',
    widths: [800, 1600],
    ratio: [1600, 1129],
    shape: 'wide',
  },
  {
    title: 'Moonrise',
    medium: 'Illustration',
    image: '/assets/img/playground/moonrise',
    widths: [720, 1400],
    ratio: [1400, 1867],
    shape: 'tall',
  },
];
