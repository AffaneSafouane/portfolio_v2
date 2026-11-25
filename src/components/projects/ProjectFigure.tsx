import Image from 'next/image';
import { getAvailableProjectMedia } from '../../lib/projects/media';
import type { ProjectMedia } from '../../lib/projects/types';

const frameClass = {
  landscape: 'aspect-video',
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
} as const;

export function ProjectFigure({ media }: { media?: ProjectMedia }) {
  const available = getAvailableProjectMedia(media);
  if (!available) return null;

  return (
    <figure className="min-w-0">
      <div className={`relative w-full overflow-hidden rounded-lg bg-gray-900 ${frameClass[available.shape]}`}>
        <Image
          src={available.src}
          alt={available.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain"
        />
      </div>
      {available.caption ? <figcaption className="mt-2 text-sm text-gray-400">{available.caption}</figcaption> : null}
    </figure>
  );
}
