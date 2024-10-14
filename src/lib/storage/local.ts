import { MultipartFile } from "@fastify/multipart";
import util from "util";
import { pipeline } from "stream";
import fs from "fs";

import type StorageInterface from "./type";

const BASE_PATH = `${process.env.BASE_URL}/public/`

export default class LocalStorage implements StorageInterface {
    async put(file: MultipartFile) {
        try {
            const pump = util.promisify(pipeline);
            await pump(file.file, fs.createWriteStream(`./storage/${file.filename}`));
            return {
                file: {
                    path: `${BASE_PATH}${file.filename}`,
                    filename: file.filename,
                },
                error: null,
            };
        } catch (error) {
            return { file: null, error };
        }
    }

    async remove(path: string) {
        try {
            await new Promise((resolve, reject) => {
                fs.unlink(`./storage/${path.replace(BASE_PATH, "")}`, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(true);
                });
            });
            return { error: null };
        } catch (error) {
            return { error };
        }
    }
}
