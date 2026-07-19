/**
 * Migration: Add missing columns to Supabase orders table
 * Run: node tools/migrate_add_columns.js
 */
const { Client } = require('pg');

const DB_HOST = 'db.kyzlxhncnqahlpfhtoky.supabase.co';
const DB_PORT = 5432;
const DB_USER = 'postgres';
const DB_NAME = 'postgres';

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const question = (q) => new Promise(resolve => rl.question(q, resolve));

async function main() {
    console.log('\n=== SSA Supabase Migration: Add Missing Columns ===\n');
    const password = process.env.DB_PASSWORD || await question('Supabase DB password: ');
    rl.close();

    const client = new Client({
        host: DB_HOST, port: DB_PORT, user: DB_USER, password, database: DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✓ Connected to Supabase PostgreSQL\n');

        const migrations = [
            `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "estimatedDelivery" text`,
            `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "rating" integer`,
            `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "ratingComment" text`,
            `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "rating_at" text`,
            `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "ratingImage" text`,
        ];

        for (const sql of migrations) {
            await client.query(sql);
            const col = sql.match(/"([^"]+)"\s*\w+$/)[1];
            console.log(`  ✓ orders."${col}" column added (or already exists)`);
        }

        console.log('\n✅ Migration complete! All columns are ready.\n');
    } catch (err) {
        console.error('\n❌ Migration failed:', err.message);
        if (err.message.includes('password') || err.message.includes('authentication')) {
            console.error('   → Check the password. Find it in: Supabase Dashboard → Settings → Database → Connection string');
        }
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
