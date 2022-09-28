import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import fileUpload from 'express-fileupload';
import prisma from '../core/db';

const getAll = async (_: Request, res: Response) => {
    try {
        const libs = await prisma.library.findMany();

        res.status(200).json(libs);
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

const getById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const library = await prisma.library.findUnique({
            where: {
                id,
            },
        });

        if (!library) {
            res.status(404).json({
                message: 'Library not found.',
            });

            return;
        }

        res.status(200).json(library);
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const libraryDll = req.files?.library as fileUpload.UploadedFile;

        const rawPluginId = req.params.pluginId;

        const pluginId = parseInt(rawPluginId);

        if (!pluginId || isNaN(pluginId)) {
            res.status(400).json({
                message: 'Plugin ID is required.',
            });

            return;
        }

        if (!libraryDll) {
            res.status(400).json({
                message: 'Library DLL is required.',
            });

            return;
        }

        if (libraryDll.mimetype !== 'application/x-msdownload') {
            res.status(400).json({
                message: 'Library DLL must be a dll file.',
            });

            return;
        }

        const libsDir = path.join(__dirname, '..', '..', 'libs');

        const library = await prisma.library.create({
            data: {
                file: `${libsDir}/${libraryDll.name}`,
                name: libraryDll.name,
                pluginId,
            },
        });

        if (library) {
            if (!fs.existsSync(libsDir)) {
                fs.mkdirSync(libsDir);
            }

            await libraryDll.mv(`${libsDir}/${libraryDll.name}`);
        }

        res.status(201).json(library);
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong.',
        });
    }
};

const stream = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id) {
            res.status(400).json({
                message: 'Library ID is required.',
            });

            return;
        }

        const library = await prisma.library.findUnique({
            where: {
                id,
            },
        });

        if (!library) {
            res.status(404).json({
                message: 'Library not found.',
            });

            return;
        }

        const libsDir = path.join(__dirname, '..', '..', 'libs');

        const file = `${libsDir}/${library.name}`;

        if (!fs.existsSync(file)) {
            res.status(404).json({
                message: 'Library not found.',
            });

            return;
        }

        // Convert file to base64 string
        const fileContent = fs.readFileSync(file, 'base64');

        res.status(200).json({
            base64: fileContent,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong.',
        });
    }
};

const librariesController = {
    getAll,
    getById,
    create,
    stream,
};

export default librariesController;
