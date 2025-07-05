type ChatRequest = {
  message: string;
  messagesBefore: { role: "ai" | "human"; content: string }[];
};
