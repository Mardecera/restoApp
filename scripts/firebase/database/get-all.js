import {
    getFirestore,
    collection,
    getDocs,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js'

async function getDocuments(collectionName) {
    try {
        const db = getFirestore()
        const collectionRef = collection(db, collectionName)
        const querySnap = await getDocs(collectionRef)
        return {
            size: querySnap.size,
            data: querySnap,
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

export default getDocuments
