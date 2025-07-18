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
    return $fetch<BookDetailResponse>(`/api/book/${itemId}`, {
      method: "GET",
      headers: {
        ...commonHeaders,
      },
    });
  },
  searchBooks: (body: BookSearchRequest) => {
    return $fetch<BookSearchResponse>("/api/search", {
      method: "POST",
      body: body,
      headers: {
        ...commonHeaders,
      },
    });
  },
  recommendBooks: (body: RecommendRequest) => {
    return $fetch<RecommendBookResponse>("/api/recommend", {
      method: "POST",
      body: body,
      headers: {
        ...commonHeaders,
      },
    });
  },
  getBookList: (
    bookListType: BookListQueryType,
    page: number,
    size: number,
  ) => {
    return $fetch<BookListResponse>("/api/book/list", {
      method: "GET",
      headers: {
        ...commonHeaders,
      },
      query: {
        type: bookListType,
        page: page || 1, // Default page
        size: size || 10, // Default size
      },
    });
  },
};
