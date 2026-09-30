const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { createTaskRouter } = require('./routes/taskRoutes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

function createApp({ taskController, attachmentController, upload, taskService, config }) {
  const app = express();

  app.use(morgan('dev'));
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/tasks', createTaskRouter({
    taskController,
    attachmentController,
    upload,
    taskService,
  }));

  if (config.clientDist && fs.existsSync(config.clientDist)) {
    app.use(express.static(config.clientDist));
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(config.clientDist, 'index.html'), (error) => {
        if (error) next(error);
      });
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
