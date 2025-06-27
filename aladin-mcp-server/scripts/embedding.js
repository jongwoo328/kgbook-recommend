import 'dotenv/config';
import pg from 'pg';

const pgclient = new pg.Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});
await pgclient.connect();

function buildEmbeddingText(row) {
    const path = [row.depth1, row.depth2, row.depth3, row.depth4, row.depth5]
        .filter(Boolean)
        .join(' > ');
    return `이 도서는 '${path}' 카테고리에 속하며, 주제는 '${row.category}'입니다.`;
}

async function createEmbedding(text) {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type':  'application/json',
        },
        body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: text,
        }),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`OpenAI API error: ${res.status} ${err}`);
    }
    const { data } = await res.json();
    return data[0].embedding;           // Float[] (length 1536)
}


const { rows } = await pgclient.query('SELECT * FROM kgbook.public.category WHERE category_vector IS NULL');
function chunkArray(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size),
    );
}

async function embedding() {
    for await (const chunk of chunkArray(rows, 1000)) {
        await Promise.all(chunk.map(async (row) => {
            try {
                const vector = await createEmbedding(buildEmbeddingText(row));
                await pgclient.query(
                    "UPDATE kgbook.public.category SET category_vector = $2::vector WHERE cid = $1",
                    [row.cid, JSON.stringify(vector)],
                );
                console.log('1000 rows updated.');
            } catch (err) {
                console.error(`cid ${row.cid} 업데이트 실패:`, err);
            }
        }));
        console.log(`${chunk.length} rows updated`);
    }
}

await embedding();
