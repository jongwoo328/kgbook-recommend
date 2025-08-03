const url =
  process.env.NODE_ENV === "production"
    ? "http://aladin-mcp-server:3000/mcp"
    : "http://localhost:3000/mcp";

export default {
  transport: "http",
  automaticSSEFallback: false,
  url,
  reconnect: {
    enabled: true,
    delayMs: 2000,
    maxAttempts: 5,
  },
} as const;
