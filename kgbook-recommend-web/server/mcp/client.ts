import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import AladinMcpServerConfig from "~/server/mcp/servers/aladin";
import { Aladin } from "aladin-client";

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

export const aladinClient = new Aladin({ ttbKey: process.env.TTB_KEY });
