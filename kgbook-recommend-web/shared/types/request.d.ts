type ChatRequest = {
  message: string;
  messagesBefore: { role: string; content: string }[];
  context?: {
    dataInDisplay?: Record<string, unknown>;
    userPreferences?: UserPreference;
  };
};

type RecommendRequest = {
  title?: string;
  author?: string;
  category?: string;
  description?: string;
  userPreferences?: UserPreference;
};

type BookSearchRequest = {
  query: string;
  queryType: "Keyword" | "Title" | "Author" | "Publisher";
  categoryId?: number;
  sort?:
    | "Accuracy"
    | "PublishTime"
    | "Title"
    | "SalesPoint"
    | "CustomerRating"
    | "MyReviewCount";
};
