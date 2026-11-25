import { getAvailableProjectMedia } from '../../lib/projects/media';
import type { ProjectMedia } from '../../lib/projects/types';
import { ProjectImage, ProjectMediaPlaceholder } from './ProjectImage';

export function ProjectFigure({ media, compact = false }: { media?: ProjectMedia; compact?: boolean }) {
  const available = getAvailableProjectMedia(media);
  if (available) return <ProjectImage media={available} compact={compact} />;
  if (process.env.NODE_ENV === 'development' && media) return <ProjectMediaPlaceholder media={media} compact={compact} />;
  return null;
}
