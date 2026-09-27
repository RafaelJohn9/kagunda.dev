// Folders group related posts. A post joins one by setting `series: <id>` in its
// frontmatter. Posts inside a folder are numbered #1, #2, ... by publish date.
// Folders are listed on the home page in the order they appear here, drawn as
// leather-bound books; `color` is the leather, so keep it a dark coffee tone.
export const SERIES = {
  'pos-kenya': {
    title: 'Point of Sale for Kenya',
    description: 'Building till software that keeps selling through power cuts, flaky networks and growing branches.',
    color: '#7a4a2a',
  },
  'software-architecture': {
    title: 'Software Architecture',
    description: 'How to shape systems: the foundations, components, and the events that move between them.',
    color: '#4f3322',
  },
  'under-the-hood': {
    title: 'Under the Hood',
    description: 'What everyday tools are actually doing when you are not looking.',
    color: '#6b4a35',
  },
  algorithms: {
    title: 'Algorithms',
    description: 'Problem-solving techniques, from dynamic programming to taming chaos.',
    color: '#6e2f2a',
  },
  'reading-notes': {
    title: 'Reading Notes',
    description: 'Books and essays worth coming back to.',
    color: '#7d5a3a',
  },
} as const;

export type SeriesId = keyof typeof SERIES;
export const SERIES_IDS = Object.keys(SERIES) as [SeriesId, ...SeriesId[]];
