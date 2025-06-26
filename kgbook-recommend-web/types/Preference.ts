export interface UserPreference {
  job: string;
  interests: string[];
  readTime: string;
  style: string[];
  recentBook: string;
}

export interface Preference {
  isSubmitted: boolean;
  user: UserPreference;
}
