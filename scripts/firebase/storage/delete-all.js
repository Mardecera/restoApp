import { storage } from '../init-app.js'
import {
    ref,
    deleteObject,
    listAll,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-storage.js'
import deleteFile from './delete.js'

async function deleteAllFiles(path) {
    try {
        const filesRef = ref(storage, path)
        const allPictures = await listAll(filesRef)
        allPictures.items.forEach(
            async (item) => await deleteFile(item.fullPath)
        )
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export default deleteAllFiles
