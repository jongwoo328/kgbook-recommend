import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp';
import Express from 'express';
import type { Request, Response } from 'express';
import { server } from './mcp';

const app = Express();
app.use(Express.json());

app.post('/mcp', async (req: Request, res: Response) => {
	// In stateless mode, create a new instance of transport and server for each request
	// to ensure complete isolation. A single instance would cause request ID collisions
	// when multiple clients connect concurrently.

	try {
		const transport: StreamableHTTPServerTransport =
			new StreamableHTTPServerTransport({
				sessionIdGenerator: undefined,
			});
		res.on('close', () => {
			transport.close();
			server.close();
		});
		await server.connect(transport);
		await transport.handleRequest(req, res, req.body);
	} catch (error) {
		console.error('Error handling MCP request:', error);
		if (!res.headersSent) {
			res.status(500).json({
				jsonrpc: '2.0',
				error: {
					code: -32603,
					message: 'Internal server error',
				},
				id: null,
			});
		}
	}
});

app.get('/mcp', async (req: Request, res: Response) => {
	res.writeHead(405).end(
		JSON.stringify({
			jsonrpc: '2.0',
			error: {
				code: -32000,
				message: 'Method not allowed.',
			},
			id: null,
		}),
	);
});

app.delete('/mcp', async (req: Request, res: Response) => {
	res.writeHead(405).end(
		JSON.stringify({
			jsonrpc: '2.0',
			error: {
				code: -32000,
				message: 'Method not allowed.',
			},
			id: null,
		}),
	);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});
