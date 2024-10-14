import CloudinaryStorage from './cloudinary'
import LocalStorage from './local'

import StorageInterface from './type'

const Storage = (type: string): StorageInterface => {
    if (type == "cloudinary") {
        return new CloudinaryStorage()
    }
    return new LocalStorage()
}

export default Storage