import { storage } from '../init-app.js'
import {
    ref,
    getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-storage.js'
import { myAlert } from '../../widgets.js'

async function getFile(path) {
    try {
        const imageRef = ref(storage, path)
        const url = await getDownloadURL(imageRef)
        return url
    } catch (error) {
        // myAlert(`Set-image: ${error.message}`, 'error')
        console.error(error)
    }
}

export default getFile
