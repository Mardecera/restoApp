import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js'
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-storage.js'

const firebaseConfig = {
    apiKey: 'AIzaSyBgpzv58Rrbi1I8ufy7mWtMNpLArDje2zo',
    authDomain: 'restoapp-15437.firebaseapp.com',
    databaseURL: 'https://restoapp-15437-default-rtdb.firebaseio.com',
    projectId: 'restoapp-15437',
    storageBucket: 'restoapp-15437.appspot.com',
    messagingSenderId: '5213165804',
    appId: '1:5213165804:web:907ecd21887aa7e5636dc9',
}
const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)

export { firebaseApp, storage }
