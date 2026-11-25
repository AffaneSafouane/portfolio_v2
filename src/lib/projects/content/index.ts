import type { ProjectContent, ProjectId } from '../types';
import { le28 } from './le-28';
import { gestimmo } from './gestimmo';
import { dtCompagnie } from './dt-compagnie';
import { rave } from './rave';
import { galeriePhoto } from './galerie-photo';
import { itunesExplorer } from './itunes-explorer';

const contentById: Record<ProjectId, ProjectContent> = {
  'le-28': le28,
  gestimmo,
  'dt-compagnie': dtCompagnie,
  rave,
  'galerie-photo': galeriePhoto,
  'itunes-explorer': itunesExplorer,
};

export const getProjectContent = (id: ProjectId): ProjectContent => contentById[id];
