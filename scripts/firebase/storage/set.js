import { storage } from '../init-app.js'
import {
    ref,
    uploadBytesResumable,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-storage.js'
import { myAlert } from '../../widgets.js'

async function setFile(path, imageFile) {
    try {
        const imageRef = ref(storage, path)
        await uploadBytesResumable(imageRef, imageFile)
        return true
    } catch (error) {
        myAlert(`Set-image: ${error.message}`, 'error')
        console.error(error)
        return false
    }
}

export default setFile
