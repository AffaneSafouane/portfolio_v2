import type { ProjectId } from '../projects/types';

export type ExperienceId =
  | 'le-28-production'
  | 'dt-compagnie-production'
  | 'sci-dine-stage'
  | 'dt-compagnie-stage'
  | 'sarl-james-stage'
  | 'spie-ics-stage';

export type CaseStudyProjectId = Extract<ProjectId, 'le-28' | 'dt-compagnie' | 'gestimmo'>;

export type ExperienceBase = {
  id: ExperienceId;
  organization: string;
  role: string;
  periodLabel: string;
  context: string;
  responsibilityAndMethod: string;
  outcome: string;
  homeSummary?: string;
  projectId?: CaseStudyProjectId;
  projectLinkLabel?: string;
};

export type ClientIntervention = ExperienceBase & {
  kind: 'client-intervention';
  sinceMonth: `${number}-${number}`;
};

export type Internship = ExperienceBase & {
  kind: 'internship';
  degree: 'licence-pro' | 'bts-sio';
  startDate: `${number}-${number}-${number}`;
  endDate: `${number}-${number}-${number}`;
};

export type Experience = ClientIntervention | Internship;
export type HomeExperience = Experience & { homeSummary: string };
