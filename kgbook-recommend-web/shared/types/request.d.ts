type ChatRequest = {
  message: string;
  messagesBefore: { role: string; content: string }[];
  context?: {
    dataInDisplay?: Record<string, unknown>;
    userPreferences?: UserPreference;
  };
};

type PersonalRecommendRequest = {
  userPreference: UserPreference;
};

type BookSearchRequest = {
  query: string;
  queryType: BookSearchType;
  categoryId?: number;
  sort?:
    | "Accuracy"
    | "PublishTime"
    | "Title"
    | "SalesPoint"
    | "CustomerRating"
    | "MyReviewCount";
  page: number;
  size: number;
};

type RecommendRequest = {
  message: string;
};

type BookListQueryType = "ItemNewSpecial" | "Bestseller";
