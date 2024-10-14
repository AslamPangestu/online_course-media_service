import { MultipartFile } from "@fastify/multipart";
import { v2 as cloudinary } from "cloudinary";
import type { v2 as Cloudinary, UploadApiResponse } from "cloudinary";

import type StorageInterface from "./type";

export default class CloudinaryStorage implements StorageInterface {
    #app: typeof Cloudinary;

    constructor() {
        cloudinary.config({
            secure: true,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        this.#app = cloudinary;
    }

    async put(file: MultipartFile) {
        try {
            const buffer = await file.toBuffer();
            const uploadResult: UploadApiResponse = await new Promise(
                (resolve, reject) => {
                    this.#app.uploader
                        .upload_stream(
                            { folder: "online-course", overwrite: true, use_filename: true },
                            (error, result) => {
                                if (error) {
                                    return reject(error);
                                }
                                if (!result) {
                                    return reject(new Error("Failed to upload image"));
                                }
                                return resolve(result);
                            }
                        )
                        .end(buffer);
                }
            );
            return {
                file: {
                    path: uploadResult.secure_url,
                    filename: uploadResult.public_id,
                },
                error: null,
            };
        } catch (error) {
            return { file: null, error };
        }
    }

    async remove(path: string) {
        try {
            await this.#app.uploader.destroy(path);
            return { error: null };
        } catch (error) {
            return { error };
        }
    }
}
