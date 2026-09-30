const { TaskRepository } = require('./repositories/TaskRepository');
const { AttachmentRepository } = require('./repositories/AttachmentRepository');
const { FileStorage } = require('./services/FileStorage');
const { TaskService } = require('./services/TaskService');
const { AttachmentService } = require('./services/AttachmentService');
const { TaskController } = require('./controllers/TaskController');
const { AttachmentController } = require('./controllers/AttachmentController');
const { createUpload } = require('./middlewares/upload');

function createContainer({ pool, config }) {
  const taskRepository = new TaskRepository(pool);
  const attachmentRepository = new AttachmentRepository(pool);
  const fileStorage = new FileStorage(config.uploadsDir);
  const taskService = new TaskService({ taskRepository, attachmentRepository, fileStorage });
  const attachmentService = new AttachmentService({
    taskRepository,
    attachmentRepository,
    fileStorage,
  });

  return {
    taskService,
    taskController: new TaskController(taskService),
    attachmentController: new AttachmentController(attachmentService),
    upload: createUpload(config),
  };
}

module.exports = { createContainer };
