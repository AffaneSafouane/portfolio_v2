'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { AvailableProjectMedia } from '../../lib/projects/media';
import type { ProjectMedia } from '../../lib/projects/types';

const frameClass = {
  landscape: 'aspect-video',
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
} as const;

function figureClass(shape: ProjectMedia['shape'], compact: boolean) {
  return !compact && shape === 'portrait' ? 'mx-auto w-full max-w-sm' : 'min-w-0';
}

function frameSize(shape: ProjectMedia['shape'], compact: boolean) {
  return compact ? 'h-56' : frameClass[shape];
}

export function ProjectMediaPlaceholder({ media, compact = false }: { media: ProjectMedia; compact?: boolean }) {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <figure className={figureClass(media.shape, compact)}>
      <div className={`flex w-full flex-col justify-center gap-2 rounded-lg border border-dashed border-gray-600 bg-gray-800/50 p-5 text-sm text-gray-300 ${frameSize(media.shape, compact)}`}>
        <strong className="text-gray-100">Capture à ajouter · {media.shape === 'portrait' ? 'Portrait' : media.shape === 'landscape' ? 'Paysage' : 'Carré'}</strong>
        <span>{media.placement}</span>
        <code className="break-all text-xs text-blue-300">{media.src ? `public${media.src}` : 'Chemin à renseigner dans les données du projet'}</code>
      </div>
    </figure>
  );
}

export function ProjectImage({ media, compact = false }: { media: AvailableProjectMedia; compact?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return process.env.NODE_ENV === 'development' ? <ProjectMediaPlaceholder media={media} compact={compact} /> : null;
  const portraitDetail = !compact && media.shape === 'portrait';

  return (
    <figure className={figureClass(media.shape, compact)}>
      <div className={`relative w-full overflow-hidden rounded-lg bg-gray-900 ${frameSize(media.shape, compact)}`}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={portraitDetail ? '(max-width: 640px) 100vw, 384px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          className="object-contain"
          onError={() => setFailed(true)}
        />
      </div>
      {media.caption ? <figcaption className="mt-2 text-sm text-gray-400">{media.caption}</figcaption> : null}
    </figure>
  );
}
