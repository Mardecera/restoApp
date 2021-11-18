import {
    getFirestore,
    collection,
    addDoc,
    Timestamp,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js'
import { myAlert } from '../../widgets.js'

async function setDocument(docData, collectionName) {
    docData.dateCreated = Timestamp.now()

    try {
        const db = getFirestore()
        const collectionRef = collection(db, collectionName)
        const snapShot = await addDoc(collectionRef, docData)

        return snapShot
    } catch (error) {
        // myAlert(error.message, 'error')
        console.error(error)
        return null
    }
}

export default setDocument
