import { firebaseApp } from '../init-app.js'

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js'

const auth = getAuth(firebaseApp)

async function getCredential(auth, email, password, type) {
    if (type === 'singin') {
        return await signInWithEmailAndPassword(auth, email, password)
    } else if (type === 'singup') {
        return await createUserWithEmailAndPassword(auth, email, password)
    }
}

async function singAccount(event, type) {
    event.preventDefault()
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    try {
        const userCredential = getCredential(auth, email, password, type)
        const user = userCredential.user
        event.target.parentNode.parentNode.parentNode.remove()
    } catch (error) {
        console.error(error)
    }
}

export { singAccount }
