import {
    getFirestore,
    getDoc,
    doc,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js'

async function getDocument(collectionName, id) {
    try {
        const db = getFirestore()
        const docRef = doc(db, collectionName, id)
        const snapShot = await getDoc(docRef)

        return snapShot
    } catch (error) {
        console.log(error)
        return null
    }
}

export default getDocument
