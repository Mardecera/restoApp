import Products from './Products.js'
import { firebaseApp } from '../../firebase/init-app.js'
import {
    getAuth,
    onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js'
import { showDataUser, getDataProductToForm } from '../../actions.js'

const auth = getAuth(firebaseApp)

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid
        const products = new Products(uid)

        showDataUser('menu__user', uid)
        $('#new__product').addEventListener('submit', (event) => {
            event.preventDefault()
            products.createProduct(
                getDataProductToForm(event.target),
                event.target.getAttribute('edit-id')
            )
        })
    } else {
        window.location.href = '/'
    }
})
