import { storage } from '../init-app.js'
import {
    ref,
    deleteObject,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-storage.js'

async function deleteFile(path) {
    try {
        const deleteRef = ref(storage, path)
        await deleteObject(deleteRef)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export default deleteFile
