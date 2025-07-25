import type {
  ListItem,
  ListItemResponse,
  LookupItemResponse,
  SearchItemResponse,
} from "aladin-client";

const commonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export default {
  chat: (body: ChatRequest) => {
    return $fetch<ChatResponse>("/api/chat", {
      method: "POST",
      body: body,
      headers: {
        ...commonHeaders,
      },
    });
  },
  getBookDetail: (itemId: number) => {
    return $fetch<LookupItemResponse>(`/api/book/${itemId}`, {
      method: "GET",
      headers: {
        ...commonHeaders,
      },
    });
  },
  searchBooks: (body: BookSearchRequest) => {
    return $fetch<{ response: SearchItemResponse }>("/api/search", {
      method: "POST",
      body: body,
      headers: {
        ...commonHeaders,
      },
    });
  },
  recommendPersonalBooks: (body: PersonalRecommendRequest) => {
    return $fetch<RecommendBookItem[]>("/api/recommend", {
      method: "POST",
      body: body,
      headers: {
        ...commonHeaders,
      },
    });
  },
  recommendBooks: (itemId: number) => {
    return $fetch<RecommendBookItem[]>(`/api/recommend/${itemId}`, {
      method: "GET",
      headers: {
        ...commonHeaders,
      },
    });
  },
  getBookList: (
    bookListType: BookListQueryType,
    page: number = 1,
    size: number = 10,
  ) => {
    return $fetch<ListItemResponse<ListItem>>("/api/book/list", {
      method: "GET",
      headers: {
        ...commonHeaders,
      },
      query: {
        type: bookListType,
        page: page,
        size: size,
      },
    });
  },
};
