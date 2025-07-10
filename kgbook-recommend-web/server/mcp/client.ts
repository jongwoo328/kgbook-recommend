import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import AladinMcpServerConfig from "~/server/mcp/servers/aladin";

export const client = new MultiServerMCPClient({
  throwOnLoadError: true,
  // Optional
  additionalToolNamePrefix: "mcp",
  prefixToolNameWithServerName: true,

  // MCP 서버 설정
  mcpServers: {
    aladin: AladinMcpServerConfig,
  },

  // 툴 출력 처리 방식
  outputHandling: {
    text: "content",
    image: "artifact",
    resource: "artifact",
  },
});
