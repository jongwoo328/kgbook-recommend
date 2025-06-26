import { client } from "~/server/mcp/client";

export default defineEventHandler(async (event) => {
  const tools = await client.getTools();
  console.log(tools);
  return {
    status: "ok",
    message: "MCP Test Endpoint",
    data: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      serverUrl: process.env.MCP_SERVER_URL || "http://localhost:3000/mcp",
    },
  };
});
