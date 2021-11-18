import { firebaseApp } from '../init-app.js'
import {
    getAuth,
    signOut,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js'

const auth = getAuth(firebaseApp)

async function logOutUser() {
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error)
    }
}

export default logOutUser
