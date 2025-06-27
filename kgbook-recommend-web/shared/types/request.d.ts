type ChatRequest = {
  message: string;
  messagesBefore: { role: "ai" | "user"; content: string }[];
};
