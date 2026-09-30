const path = require('path');

const rootDir = path.join(__dirname, '..', '..');

module.exports = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL || 'postgres://tasks:tasks@localhost:5432/tasks',
  uploadsDir: path.resolve(process.env.UPLOADS_DIR || path.join(rootDir, 'uploads')),
  clientDist: process.env.CLIENT_DIST ? path.resolve(process.env.CLIENT_DIST) : '',
  maxUploadBytes: Number(process.env.MAX_UPLOAD_BYTES) || 10 * 1024 * 1024,
};
