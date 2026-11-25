import { statSync } from 'node:fs';
import path from 'node:path';
import type { ProjectMedia } from './types';

export type AvailableProjectMedia = ProjectMedia & { src: `/static/img/${string}`; alt: string };

export function getAvailableProjectMedia(media?: ProjectMedia): AvailableProjectMedia | null {
  const alt = media?.alt?.trim();
  if (!media?.src || !alt) return null;

  const imageRoot = path.resolve(process.cwd(), 'public/static/img');
  const file = path.resolve(process.cwd(), 'public', media.src.slice(1));
  if (!file.startsWith(imageRoot + path.sep)) return null;

  try {
    if (!statSync(file).isFile()) return null;
  } catch {
    return null;
  }

  return { ...media, src: media.src, alt };
}
