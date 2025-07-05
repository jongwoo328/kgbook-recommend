type ChatRequest = {
  message: string;
  messagesBefore: { role: string; content: string }[];
};
