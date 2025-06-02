// Create an MCP server
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({
	name: 'aladin-mcp-server',
	version: '1.0.0',
});

export { server };
