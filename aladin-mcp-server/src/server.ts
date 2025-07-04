import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Aladin } from 'aladin-client';
import { z } from 'zod';
import { db } from './db';

export function createServer() {
  const server = new McpServer({
    name: 'Aladin MCP Server',
    version: '1.0.0',
  });
  const aladin = new Aladin({ ttbKey: process.env.TTB_KEY ?? '' });

  server.tool('get_new_books_by_month', async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const results = await aladin.listItems({
      queryType: 'ItemNewAll',
      searchTarget: 'Book',
      year: year,
      month: month,
      cover: 'Big',
    });

    if (!results.success) {
      return {
        content: [
          {
            type: 'text',
            text: results.error.message,
          },
        ],
        isError: true,
      };
    }
    return {
      content: results.data.item.map((item) => {
        return {
          type: 'text',
          text: JSON.stringify(item),
          mimeType: 'application/json',
        };
      }),
    };
  });

  server.tool(
    'get_new_books_by_category_id',
    { cid: z.number() },
    async ({ cid }) => {
      const results = await aladin.listItems({
        queryType: 'ItemNewAll',
        categoryId: cid,
        cover: 'Big',
      });

      if (!results.success) {
        return {
          content: [
            {
              type: 'text',
              text: results.error.message,
            },
          ],
          isError: true,
        };
      }
      return {
        content: results.data.item.map((item) => {
          return {
            type: 'text',
            text: JSON.stringify(item),
            mimeType: 'application/json',
          };
        }),
      };
    },
  );

  server.tool('get_new_books_special_by_month', async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const results = await aladin.listItems({
      queryType: 'ItemNewSpecial',
      searchTarget: 'Book',
      year: year,
      month: month,
      cover: 'Big',
    });

    if (!results.success) {
      return {
        content: [
          {
            type: 'text',
            text: results.error.message,
          },
        ],
        isError: true,
      };
    }
    return {
      content: results.data.item.map((item) => {
        return {
          type: 'text',
          text: JSON.stringify(item),
          mimeType: 'application/json',
        };
      }),
    };
  });

  server.tool('get_bestsellers', async () => {
    const results = await aladin.listItems({
      queryType: 'Bestseller',
      searchTarget: 'Book',
      cover: 'Big',
    });

    if (!results.success) {
      return {
        content: [
          {
            type: 'text',
            text: results.error.message,
          },
        ],
        isError: true,
      };
    }
    return {
      content: results.data.item.map((item) => {
        return {
          type: 'text',
          text: JSON.stringify(item),
          mimeType: 'application/json',
        };
      }),
    };
  });

  server.tool(
    'get_bestsellers_by_category_id',
    { cid: z.number() },
    async ({ cid }) => {
      const results = await aladin.listItems({
        queryType: 'Bestseller',
        categoryId: cid,
        cover: 'Big',
      });

      if (!results.success) {
        return {
          content: [
            {
              type: 'text',
              text: results.error.message,
            },
          ],
          isError: true,
        };
      }
      return {
        content: results.data.item.map((item) => {
          return {
            type: 'text',
            text: JSON.stringify(item),
            mimeType: 'application/json',
          };
        }),
      };
    },
  );

  server.tool(
    'search_book_categories',
    { query: z.string() },
    async ({ query }) => {
      try {
        // TODO 시멘틱 서치 구현 issue#23
        const result = await db.query(
          `SELECT cid,
							category,
							mall,
							depth1,
							depth2,
							depth3,
							depth4,
							depth5
					 FROM kgbook.public.category
					 WHERE category LIKE $1::text
						OR depth1 LIKE $1::text
						OR depth2 LIKE $1::text
						OR depth3 LIKE $1::text
						OR depth4 LIKE $1::text
						OR depth5 LIKE $1::text`,
          [`%${query}%`],
        );
        return {
          content: result.rows.map((row) => ({
            type: 'text',
            text: JSON.stringify(row),
            mimeType: 'application/json',
          })),
        };
      } catch (err: unknown) {
        console.error(err);
        const message =
          err && typeof err === 'object' && 'message' in err
            ? err.message
            : String(err);
        return {
          content: [
            {
              type: 'text',
              text: `Error querying database: ${message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.tool(
    'search_books_by_title_and_author',
    { query: z.string() },
    async ({ query }) => {
      const results = await aladin.searchItems({
        query: query,
        queryType: 'Keyword',
        cover: 'Big',
      });

      if (!results.success) {
        return {
          content: [
            {
              type: 'text',
              text: results.error.message,
            },
          ],
          isError: true,
        };
      }
      return {
        content: results.data.item.map((item) => {
          return {
            type: 'text',
            text: JSON.stringify(item),
            mimeType: 'application/json',
          };
        }),
      };
    },
  );

  server.tool('get_book_by_item_id', { id: z.number() }, async ({ id }) => {
    const results = await aladin.lookupItem({
      itemId: id,
      itemIdType: 'ItemId',
      cover: 'Big',
    });

    if (!results.success) {
      return {
        content: [
          {
            type: 'text',
            text: results.error.message,
          },
        ],
        isError: true,
      };
    }
    return {
      content: results.data.item.map((item) => {
        return {
          type: 'text',
          text: JSON.stringify(item),
          mimeType: 'application/json',
        };
      }),
    };
  });

  server.tool('get_book_by_isbn', { isbn: z.string() }, async ({ isbn }) => {
    const results = await aladin.lookupItem({
      itemId: isbn,
    });

    if (!results.success) {
      return {
        content: [
          {
            type: 'text',
            text: results.error.message,
          },
        ],
        isError: true,
      };
    }
    return {
      content: results.data.item.map((item) => {
        return {
          type: 'text',
          text: JSON.stringify(item),
          mimeType: 'application/json',
        };
      }),
    };
  });

  return server;
}
