import {
    getFirestore,
    doc,
    deleteDoc,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js'
import { myAlert } from '../../widgets.js'

async function deleteDocument(collection, id) {
    try {
        const db = getFirestore()
        await deleteDoc(doc(db, collection, id))
        myAlert('Eliminado correctamente ✌', 'success')

        return true
    } catch (error) {
        myAlert(error.message, 'error')
        return false
    }
}

export default deleteDocument
