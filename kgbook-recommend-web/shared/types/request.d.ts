type ChatRequest = {
  message: string;
  messagesBefore: { role: string; content: string }[];
  context?: {
    dataInDisplay?: Record<string, unknown>;
    userPreferences?: UserPreference;
  };
};
