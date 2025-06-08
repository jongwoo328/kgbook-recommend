import 'dotenv/config';
import Database from 'better-sqlite3';
import pg from 'pg';

const sqlite = new Database('./db.sqlite');
const pgclient = new pg.Client({
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: 'localhost',
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
});
await pgclient.connect();

const rows = sqlite.prepare('select * from category').all();
function chunkArray(arr, size) {
	return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
		arr.slice(i * size, i * size + size),
	);
}

(async function migrate() {
	for await (const chunk of chunkArray(rows, 1000)) {
		await Promise.all(
			chunk.map((row) =>
				pgclient.query(
					`
				INSERT INTO kgbook.public.category (cid, category, mall, depth1, depth2, depth3, depth4, depth5,
																							category_vector)
				VALUES ($1::integer,
									$2::text,
									$3::text,
									$4::text,
									$5::text,
									$6::text,
									$7::text,
									$8::text,
									NULL);
			`,
					[
						row.cid,
						row.category,
						row.mall,
						row.depth1,
						row.depth2,
						row.depth3,
						row.depth4,
						row.depth5,
					],
				),
			),
		).catch((err) => {
			console.error('Error inserting chunk:', err);
		});
		console.log('1000 rows migrated');
	}
})();
