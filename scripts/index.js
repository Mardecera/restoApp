import { firebaseApp } from './firebase/init-app.js'
import { singAccount } from './firebase/auth/sing.js'
import {
    getAuth,
    onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js'

const auth = getAuth(firebaseApp)
const formSingin = document.querySelector('#singin')

onAuthStateChanged(auth, (user) =>
    user ? (window.location.href = '/pages/products/') : _
)

formSingin.addEventListener('submit', (event) => singAccount(event, 'singin'))
