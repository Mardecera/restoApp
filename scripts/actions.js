import deleteDocument from './firebase/database/delete.js'
import logOutUser from './firebase/auth/logout.js'
import getDocument from './firebase/database/get.js'
import getFile from './firebase/storage/get.js'
import deleteFile from './firebase/storage/delete.js'
import {
    getFirestore,
    doc,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js'

const menuButton = $('#btn__menu')
const menuSection = $('#section__menu')

menuButton.onclick = () => {
    menuSection.classList.toggle('disabled')
}
$('#newitem').onclick = () => $('#newitem__form').classList.toggle('hidde')
$('#newitem__form #popup__cancel').onclick = (event) => {
    event.preventDefault()
    $('#newitem__form').classList.toggle('hidde')
    resetForm('newitem__form form')
    resetPopup('newitem__form')
}

function deleteVoidValues(map) {
    for (let current of map) {
        if (!!!current[1]) {
            map.delete(current[0])
        }
    }
    return map
}

function showElement(elementId) {
    const element = document.querySelector(`#${elementId}`)
    element.style.display = 'inherent'
}

function hiddenElement(elementId) {
    const element = document.querySelector(`#${elementId}`)
    element.style.display = 'none'
}

function clearElement(elementId) {
    const element = document.querySelector(`#${elementId}`)
    while (element.lastChild) element.lastChild.remove()
}

function resetForm(formId) {
    $(`#${formId}`).reset()
    $(`#${formId}`).setAttribute('edit-id', '')
    $(`#${formId} #popup__accept`).textContent = 'Accept'
}

function resetPopup(popupId) {
    $(`#${popupId} .popup__header`).textContent = 'Add New Product'
}

function closePopup(popupId) {
    $(`#${popupId}`).classList.toggle('hidde')
}

function openPopup(popupId) {
    $(`#${popupId}`).classList.toggle('hidde')
}

async function showDataUser(elementId, uid) {
    clearElement(elementId)
    const userData = await getDocument('users', uid)
    const element = $(`#${elementId}`)
    const template = $('#template__singin').content
    const clone = template.cloneNode(true)

    $$(clone, '#logout').onclick = () => logOutUser()
    if (userData.exists()) {
        const { firstName, lastName, username, profilePicture } =
            userData.data()

        $$(clone, '#data__profile img').src = profilePicture // problema de seguridad consola
        $$(clone, '#data__fullname').textContent = `${firstName} ${lastName}`
        $$(clone, '#data__username').textContent = `@${username}`
    }
    element.appendChild(clone)
}

async function mapToObject(map) {
    const object = new Object()
    for (let item of map) {
        object[item[0]] = await map.get(item[0])
    }
    return object
}

function getDataProductToForm(form) {
    const db = getFirestore()
    const productMap = new Map()
    const picture = $$(form, '#product__picture').files[0] || null
    const name = $$(form, '#product__name').value
    const price = +$$(form, '#product__price').value
    const ref = doc(db, `currencies/${$$(form, '#product__currency').value}`)

    productMap.set('picture', picture)
    productMap.set('name', name)
    productMap.set('price', price)
    productMap.set('currency', ref)

    const newMap = deleteVoidValues(productMap)
    const productObject = Object.fromEntries(newMap)

    return productObject
}

function loadDataInSelect(data, selectId) {
    clearElement(selectId)
    const select = $(`select#${selectId}`)
    const fragment = new DocumentFragment()

    data.forEach((item) => {
        const option = document.createElement('option')
        const { nameSymbol } = item.data()

        option.textContent = nameSymbol
        option.value = item.id
        fragment.appendChild(option)
        select.appendChild(fragment)
    })
}

function loadDataInTable(documents, collectionName, tableId, templateRowId) {
    clearElement(`${tableId} tbody`)
    const tBody = $(`#${tableId} tbody`)
    const templateRow = $(`#${templateRowId}`).content
    const fragment = new DocumentFragment()

    if (collectionName === 'tables') {
        documents.forEach((doc) => {
            const cloneRow = templateRow.cloneNode(true)
            const { name, number } = doc.data()

            $$(cloneRow, 'tr').setAttribute('id', doc.id)
            $$(cloneRow, '#table__name').textContent = name
            $$(cloneRow, '#table__number').textContent = number
            $$(cloneRow, '#item__edit').onclick = (event) => {
                event.preventDefault()
                const row = $(`tbody #${doc.id}`)
                const number = $$(row, '#table__number').textContent

                openPopup('newitem__form')
                $('#newitem__form #table__number').value = number
                $('#newitem__form form').setAttribute('edit-id', doc.id)
            }
            $$(cloneRow, '#item__delete').onclick = async (event) => {
                event.preventDefault()
                await deleteDocument(collectionName, doc.id)
                $(`tbody #${doc.id}`).remove()
            }
            fragment.appendChild(cloneRow)
        })
        tBody.appendChild(fragment)
    } else if (collectionName === 'products') {
        documents.forEach(async (doc) => {
            const cloneRow = templateRow.cloneNode(true)
            const { name, picture, price, currency } = doc.data()
            const pictureUrl = await getFile(picture)
            const currencyDoc = await getDocument('currencies', currency.id)
            const { symbol, nameSymbol } = currencyDoc.data()

            $$(cloneRow, 'tr').setAttribute('id', doc.id)
            $$(cloneRow, '#product__picture img').src = pictureUrl
            $$(cloneRow, '#product__name').textContent = name
            $$(
                cloneRow,
                '#product__price'
            ).textContent = `${symbol}${parseFloat(price).toFixed(2)}`
            $$(cloneRow, '#product__price').setAttribute('data-id', price)
            $$(cloneRow, '#product__currency').textContent = nameSymbol
            $$(cloneRow, '#product__currency').setAttribute(
                'data-id',
                currency.id
            )
            $$(cloneRow, '#product__edit').onclick = (event) => {
                event.preventDefault()
                const row = $(`tbody #${doc.id}`)
                const name = $$(row, '#product__name').textContent
                const price = $$(row, '#product__price').getAttribute('data-id')
                const currency = $$(row, '#product__currency').getAttribute(
                    'data-id'
                )

                openPopup('newitem__form')
                $('#newitem__form #product__picture').required = false
                $('#newitem__form .popup__header').textContent = 'Edit Product'
                $('#newitem__form #product__name').value = name
                $('#newitem__form #product__price').value = price
                $('#newitem__form #product__currency').value = currency
                $('#newitem__form form').setAttribute('edit-id', doc.id)
                $('#newitem__form #popup__accept').textContent = 'Update'
            }
            $$(cloneRow, '#product__delete').onclick = async (event) => {
                event.preventDefault()
                await deleteDocument(collectionName, doc.id)
                await deleteFile(picture)
                $(`tbody #${doc.id}`).remove()
            }
            fragment.appendChild(cloneRow)
            tBody.appendChild(fragment)
        })
    }
}

export {
    showElement,
    hiddenElement,
    loadDataInTable,
    resetForm,
    closePopup,
    showDataUser,
    loadDataInSelect,
    deleteVoidValues,
    mapToObject,
    getDataProductToForm,
}
