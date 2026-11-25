import Image from 'next/image';
import { getAvailableProjectMedia } from '../../lib/projects/media';
import type { ProjectMedia } from '../../lib/projects/types';

const frameClass = {
  landscape: 'aspect-video',
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
} as const;

export function ProjectFigure({ media, compact = false }: { media?: ProjectMedia; compact?: boolean }) {
  const available = getAvailableProjectMedia(media);
  if (!available) return null;
  const portraitDetail = !compact && available.shape === 'portrait';

  return (
    <figure className={portraitDetail ? 'mx-auto w-full max-w-sm' : 'min-w-0'}>
      <div className={`relative w-full overflow-hidden rounded-lg bg-gray-900 ${compact ? 'h-56' : frameClass[available.shape]}`}>
        <Image
          src={available.src}
          alt={available.alt}
          fill
          sizes={portraitDetail ? '(max-width: 640px) 100vw, 384px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          className="object-contain"
        />
      </div>
      {available.caption ? <figcaption className="mt-2 text-sm text-gray-400">{available.caption}</figcaption> : null}
    </figure>
  );
}
