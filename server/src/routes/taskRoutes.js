const express = require('express');
const { taskRules, listQueryRules } = require('../middlewares/validators');
const { handleValidation } = require('../middlewares/validate');
const { asyncHandler } = require('../middlewares/asyncHandler');

function createTaskRouter({ taskController, attachmentController, upload, taskService }) {
  const router = express.Router();

  const ensureTask = asyncHandler(async (req, res, next) => {
    await taskService.getById(req.params.id);
    next();
  });

  router.get('/', listQueryRules, handleValidation, asyncHandler(taskController.list));
  router.post('/', taskRules, handleValidation, asyncHandler(taskController.create));
  router.get('/:id', asyncHandler(taskController.show));
  router.put('/:id', taskRules, handleValidation, asyncHandler(taskController.update));
  router.delete('/:id', asyncHandler(taskController.destroy));

  router.post(
    '/:id/attachments',
    ensureTask,
    upload.single('file'),
    asyncHandler(attachmentController.create),
  );
  router.delete(
    '/:id/attachments/:attachmentId',
    asyncHandler(attachmentController.destroy),
  );
  router.get(
    '/:id/attachments/:attachmentId/download',
    asyncHandler(attachmentController.download),
  );

  return router;
}

module.exports = { createTaskRouter };
