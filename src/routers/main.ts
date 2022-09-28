import { Router } from 'express';
import librariesRouter from './libraries';
import pluginsRouter from './plugins';

const mainRouter = Router();

mainRouter.use('/plugins', pluginsRouter);
mainRouter.use('/libraries', librariesRouter);

export default mainRouter;
