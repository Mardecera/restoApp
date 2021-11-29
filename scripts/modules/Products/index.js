import Products from './Products.js'
import { firebaseApp } from '../../firebase/init-app.js'
import {
    getAuth,
    onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js'
import { showDataUser, getDataProductToForm } from '../../actions.js'

const auth = getAuth(firebaseApp)

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const products = new Products(user.uid)
        showDataUser('menu__user', user.uid)
        const success = await products.showProducts()

        if (success) {
            $('#new__product').addEventListener('submit', (event) => {
                event.preventDefault()
                products.createProduct(
                    getDataProductToForm(event.target),
                    event.target.getAttribute('edit-id')
                )
            })
            $('#table__products').addEventListener('click', (event) => {
                console.log(event.target.tagName.toLowerCase())
                if (event.target.id == 'product__delete') {
                    const id = event.target.parentNode.parentNode.id
                    products.deleteProduct(id)
                } else if (event.target.id == 'item__checkbox') {
                    const addValue = event.target.checked ? +1 : -1
                    products.data.mainCheck += addValue
                    products.revieMainCheck()
                } else if (event.target.tagName.toLowerCase() === 'td') {
                    const row = event.target.parentNode
                    const rowCheck = $$(row, '#item__checkbox')
                    rowCheck.checked = !rowCheck.checked

                    const addValue = rowCheck.checked ? +1 : -1
                    products.data.mainCheck += addValue
                    products.revieMainCheck()
                }
                products.reviewButtonDelete()
                products.reviewButtonEdit()
            })
            $('#main__checkmark').addEventListener('click', (event) => {
                const mainCheck = $$(event.target.parentNode, '#main__check')
                const typeCheck = mainCheck.getAttribute('type-checked')
                const checkboxList = $all('#item__checkbox')

                if (typeCheck == 'false') {
                    products.data.mainCheck = products.data.size
                    checkboxList.forEach((item) => (item.checked = true))
                } else {
                    products.data.mainCheck = 0
                    checkboxList.forEach((item) => (item.checked = false))
                }
                products.revieMainCheck()
                products.reviewButtonDelete()
                products.reviewButtonEdit()
            })
        }
    } else {
        window.location.href = '/'
    }
})
