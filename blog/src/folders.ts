import { getCollection, type CollectionEntry } from 'astro:content';
import { SERIES, SERIES_IDS, type SeriesId } from './series';

export interface Folder {
  id: SeriesId;
  title: string;
  description: string;
  color: string;
  posts: CollectionEntry<'blog'>[];
}

// Oldest first, so the first post published is #1. Ties break on id to stay stable.
const byPublished = (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) =>
  a.data.pubDate.getTime() - b.data.pubDate.getTime() || a.id.localeCompare(b.id);

export async function getFolders(): Promise<Folder[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft && !!data.series);
  return SERIES_IDS.map((id) => ({
    id,
    ...SERIES[id],
    posts: posts.filter((post) => post.data.series === id).sort(byPublished),
  })).filter((folder) => folder.posts.length > 0);
}

export async function getFolder(id: SeriesId): Promise<Folder | undefined> {
  return (await getFolders()).find((folder) => folder.id === id);
}
