import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import prisma from '../core/db';

const getAll = async (_: Request, res: Response) => {
    try {
        const plugins = await prisma.plugin.findMany({
            include: {
                _count: {
                    select: {
                        libraries: true,
                    },
                },
            },
        });

        res.status(200).json(plugins);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

const getById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            res.status(400).json({
                message: 'Id is required.',
            });

            return;
        }

        const plugin = await prisma.plugin.findUnique({
            where: {
                id,
            },
            select: {
                name: true,
                libraries: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!plugin) {
            res.status(404).json({
                message: 'Plugin not found.',
            });

            return;
        }

        res.status(200).json(plugin);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const pluginDll = req?.files?.plugin as fileUpload.UploadedFile;

        if (!pluginDll) {
            res.status(400).json({
                message: 'Plugin DLL is required.',
            });

            return;
        }

        if (pluginDll.mimetype !== 'application/x-msdownload') {
            res.status(400).json({
                message: 'Plugin DLL must be a dll file.',
            });

            return;
        }

        const pluginsDir = path.join(__dirname, '..', '..', 'plugins');

        const plugin = await prisma.plugin.create({
            data: {
                name: pluginDll.name,
                file: `${pluginsDir}/${pluginDll.name}`,
            },
        });

        if (plugin) {
            if (!fs.existsSync(pluginsDir)) {
                fs.mkdirSync(pluginsDir);
            }

            await pluginDll.mv(`${pluginsDir}/${pluginDll.name}`);
        }

        res.status(201).json(plugin);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

const stream = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) {
            res.status(400).json({
                message: 'Id is required.',
            });

            return;
        }

        const plugin = await prisma.plugin.findUnique({
            where: {
                id,
            },
        });

        if (!plugin) {
            res.status(404).json({
                message: 'Plugin not found.',
            });

            return;
        }

        const pluginPath = path.join(
            __dirname,
            '..',
            '..',
            'plugins',
            plugin.name
        );

        if (!fs.existsSync(pluginPath)) {
            res.status(404).json({
                message: 'Plugin not found.',
            });

            return;
        }

        const fileContent = fs.readFileSync(pluginPath, 'base64');

        res.status(200).json({
            base64: fileContent,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

const pluginsController = {
    getAll,
    getById,
    create,
    stream,
};

export default pluginsController;
