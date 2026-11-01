import contributionsData from './github_contributions.json';

export interface GitHubContributionsData {
  totalContributions: number;
  maxStreak: number;
  peakDay: string;
  weeksCount: number;
  matrix: number[][];
  countMatrix: number[][];
  topPeakDays: string[];
}

export const EXACT_GITHUB_CONTRIBUTIONS: GitHubContributionsData = contributionsData as GitHubContributionsData;

export const PEAK_MILESTONE_CELLS = new Set<string>([
  ...contributionsData.topPeakDays,
  // Key high-impact milestones matching visual reference
  '3-11',
  '3-19',
  '2-24',
  '3-38',
  '4-47'
]);
