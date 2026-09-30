const fs = require('fs');
const path = require('path');
const config = require('./config');
const { createPool, waitForDatabase } = require('./db/pool');
const { createContainer } = require('./container');
const { createApp } = require('./app');

async function main() {
  const pool = createPool(config.databaseUrl);
  await waitForDatabase(pool);

  const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
  await pool.query(schema);

  const container = createContainer({ pool, config });
  const app = createApp({ ...container, config });

  const server = app.listen(config.port, () => {
    console.log(`Сервер слушает порт ${config.port}`);
  });

  async function shutdown() {
    server.close();
    await pool.end();
    process.exit(0);
  }

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
