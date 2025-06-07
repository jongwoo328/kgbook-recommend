import 'dotenv/config';

import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import Express from 'express';
import { createServer } from './server';

const app = Express();
app.use(Express.json());

app.post('/mcp', async (req, res) => {
	try {
		const server = createServer();
		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: undefined,
		});

		res.on('close', () => {
			transport.close();
			server.close();
		});
		await server.connect(transport);
		await transport.handleRequest(req, res, req.body);
	} catch (error) {
		console.error('Error in /mcp:', error);
		if (!res.headersSent) {
			res.status(500).json({
				jsonrpc: '2.0',
				error: {
					code: -32603,
					message: 'Internal server error.',
				},
				id: null,
			});
		}
	}
});

app.all('/mcp', async (req, res) => {
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

app.all('/{*any}', (req, res) => {
	res.writeHead(404).end(
		JSON.stringify({
			jsonrpc: '2.0',
			error: {
				code: -32601,
				message: 'Not found.',
			},
			id: null,
		}),
	);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
	// log node version
	console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});
