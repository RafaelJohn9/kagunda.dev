import type { CollectionEntry } from 'astro:content';

export const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

// Reading time, measured in coffee
export function readingTime(post: CollectionEntry<'blog'>) {
  const words = (post.body ?? '').split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 230));
  const brew = minutes <= 6 ? 'an espresso' : minutes <= 15 ? 'a cup' : 'a pot';
  return { minutes, brew };
}

// Difficulty tags (1-3, 0 if none) are shown as coffee beans; the rest are subjects
export function splitTags(tags: string[] = []) {
  const lower = tags.map((t) => t.toLowerCase());
  const level = LEVELS.findIndex((l) => lower.includes(l)) + 1;
  const subjects = tags.filter((t) => !(LEVELS as readonly string[]).includes(t.toLowerCase()));
  return { level, subjects };
}

export const tagSlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, '-');
