import { MultipartFile } from "@fastify/multipart";

interface FileInterface {
    path: string
    filename: string
}

export default interface StorageInterface {
    put(file: MultipartFile): Promise<{ file: FileInterface | null, error: any }>
    remove(path: string): Promise<{ error: any }>
}