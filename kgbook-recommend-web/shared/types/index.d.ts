type UserPreference = {
  job: string;
  interests: string[];
  readTime: string;
  style: string[];
  recentBook: string;
};

type Preference = {
  isSubmitted: boolean;
  user: UserPreference;
};
