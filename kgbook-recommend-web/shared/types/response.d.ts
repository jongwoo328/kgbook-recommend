type ChatResponse = {
  response: string;
};

type BookItem = {
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  description: string;
  categoryName: string;
  cover: string;
  priceStandard: number;
  priceSales: number;
  stockStatus: string;
  customerReviewRank: number;
  itemId: number;
  isbn: string;
  link: string;
};
type RecommendBookItem = z.infer<typeof BookSchema>;

type BookDetailResponse = LookupItemResponse<BookItem>;
type BookSearchResponse = SearchItemResponse<BookItem>;
type RecommendBookResponse = {
  response: RecommendBookItem[];
};
type BookListResponse = ListItemResponse<BookItem>;
