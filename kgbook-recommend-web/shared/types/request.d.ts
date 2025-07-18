type ChatRequest = {
  message: string;
  messagesBefore: { role: string; content: string }[];
};

type RecommendRequest = {
  message: string;
};

type BookDetailRequest = {
  itemId: number;
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

type BookListQueryType = "ItemNewSpecial" | "Bestseller";
