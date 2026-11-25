export type ProjectId = 'le-28' | 'gestimmo' | 'dt-compagnie' | 'rave' | 'galerie-photo' | 'itunes-explorer';
export type ProjectPlatform = 'web' | 'mobile';
export type ProjectVisibility = 'public' | 'draft';
export type ProjectThemeId = 'menu' | 'rental-dashboard' | 'textile' | 'equalizer' | 'camera' | 'disc';

export type ProjectMedia = {
  placement: string;
  shape: 'landscape' | 'portrait' | 'square';
  src?: `/static/img/${string}`;
  alt?: string;
  caption?: string;
};

export type Project = {
  id: ProjectId;
  slug: string;
  platform: ProjectPlatform;
  visibility: ProjectVisibility;
  order: number;
  featuredOrder?: number;
  themeId: ProjectThemeId;
  technologies: readonly string[];
  cover?: ProjectMedia;
  links?: { site?: string; source?: string; document?: string };
};

export type ProjectBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: readonly string[] }
  | { kind: 'subheading'; text: string }
  | { kind: 'media'; media: ProjectMedia };

export type ProjectSectionId = 'objective' | 'context' | 'architecture' | 'methodology' | 'challenges' | 'outcome';
export type ProjectSection = { id: ProjectSectionId; title: string; blocks: readonly ProjectBlock[] };
export type ProjectContent = { title: string; summary: string; lead: string; sections: readonly ProjectSection[] };
