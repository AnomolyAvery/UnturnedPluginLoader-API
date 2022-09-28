import { Router } from 'express';
import fileUpload from 'express-fileupload';
import pluginsController from '../controllers/plugins';

const pluginsRouter = Router();

pluginsRouter.get('/', pluginsController.getAll);
pluginsRouter.get('/:id/stream', pluginsController.stream);
pluginsRouter.get('/:id', pluginsController.getById);
pluginsRouter.post('/', fileUpload(), pluginsController.create);

export default pluginsRouter;
