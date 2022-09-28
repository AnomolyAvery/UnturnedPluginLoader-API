import express from 'express';
import mainRouter from '../routers/main';
import config from './config';
import cors from 'cors';

const createApp = () => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(
        cors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        })
    );

    app.use('/api', mainRouter);

    app.use('*', (_, res) => {
        res.status(404).json({
            message: 'Not found',
        });
    });

    return {
        start: () => {
            app.listen(config.port, () => {
                console.log(`Server running on port ${config.port}`);
            });
        },
    };
};

export default createApp;
