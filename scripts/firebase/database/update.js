import {
    getFirestore,
    doc,
    updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js'
import { myAlert } from '../../widgets.js'

async function updateDocument(newdata, collectionName, id) {
    try {
        const db = getFirestore()
        const collectionRef = doc(db, collectionName, id)
        await updateDoc(collectionRef, newdata)
        myAlert('Actualizado correctamente!', 'success')
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export default updateDocument
