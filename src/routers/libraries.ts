import { Router } from 'express';
import fileUpload from 'express-fileupload';
import librariesController from '../controllers/libraries';

const librariesRouter = Router();

librariesRouter.get('/', librariesController.getAll);
librariesRouter.get('/:id', librariesController.getById);
librariesRouter.get('/:id/stream', librariesController.stream);

librariesRouter.post('/:pluginId', fileUpload(), librariesController.create);

export default librariesRouter;
