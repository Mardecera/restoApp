import deleteDocument from './firebase/database/delete.js'
import deleteAllFiles from './firebase/storage/delete-all.js'
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

function openConfirmation(collectionName, id, data) {
    const template = $('#template__confirmation').content
    const clone = template.cloneNode(true)
    const body = $('body')
    const directoryPath = `${collectionName}/${id}/`

    $$(clone, '#btn__accept').onclick = async () => {
        await deleteDocument(collectionName, id)
        await deleteAllFiles(directoryPath)
        $('#popup__confirmation').remove()
        document.querySelector(`tr#${id}`).remove()
        data.size--
    }
    $$(clone, '#btn__cancel').onclick = () => {
        $('#popup__confirmation').remove()
    }

    body.appendChild(clone)
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

function updateSingleDataInTable(data) {
    const tRow = $(`#${data.id}`)
    const { number } = data.data()
    $$(tRow, '#table__number').textContent = number
}

function setDataTable(doc, templateRowID, collectionName) {
    const templateRow = $(`#${templateRowID}`).content
    const cloneRow = templateRow.cloneNode(true)
    const { name, number } = doc.data()

    $$(cloneRow, 'tr').setAttribute('id', doc.id)
    $$(cloneRow, '#table__name').textContent = name
    $$(cloneRow, '#table__number').textContent = number
    $$(cloneRow, '#table__number').setAttribute('data-sort', number)
    $$(cloneRow, '#item__edit').onclick = (event) => {
        event.preventDefault()
        const newNumber = $('#newitem__form #table__number').textContent
        openPopup('newitem__form')
        $('#newitem__form #table__number').value = newNumber
        $('#newitem__form form').setAttribute('edit-id', doc.id)
    }
    $$(cloneRow, '#item__delete').onclick = async (event) => {
        event.preventDefault()
        openConfirmation(collectionName, doc.id)
    }
    return cloneRow
}

async function setDataProduct(doc, templateRowID, collectionName) {
    const templateRow = $(`#${templateRowID}`).content
    const cloneRow = templateRow.cloneNode(true)
    const { name, picture, price, currency } = doc.data()
    const pictureURL = await getFile(picture)
    const currencyDoc = await getDocument('currencies', currency.id)
    const { nameSymbol } = currencyDoc.data()

    $$(cloneRow, 'tr').setAttribute('id', doc.id)
    $$(cloneRow, '#product__picture img').src = pictureURL
    $$(cloneRow, '#product__name').textContent = name
    $$(cloneRow, '#product__price').textContent = parseFloat(price).toFixed(2)
    $$(cloneRow, '#product__price').setAttribute('data-sort', price)
    $$(cloneRow, '#product__price').setAttribute('data-id', price)
    $$(cloneRow, '#product__currency').textContent = nameSymbol
    $$(cloneRow, '#product__currency').setAttribute('data-id', currency.id)
    $$(cloneRow, '#product__edit').onclick = (event) => {
        event.preventDefault()
        const row = $(`tbody #${doc.id}`)
        const name = $$(row, '#product__name').textContent
        const price = $$(row, '#product__price').getAttribute('data-id')
        const currency = $$(row, '#product__currency').getAttribute('data-id')

        openPopup('newitem__form')
        $('#newitem__form #product__picture').required = false
        $('#newitem__form .popup__header').textContent = 'Edit Product'
        $('#newitem__form #product__name').value = name
        $('#newitem__form #product__price').value = price
        $('#newitem__form #product__currency').value = currency
        $('#newitem__form form').setAttribute('edit-id', doc.id)
        $('#newitem__form #popup__accept').textContent = 'Update'
    }
    // $$(cloneRow, '#item__checkbox').onclick = (event) => {
    //     console.log(event.target.checked)
    //     const table = event.target.parentNode.parentNode.parentNode.parentNode
    //     console.log(table)
    //     if (event.target.checked) {
    //         // $$(table, '.th__checkbox input').setAttribute('type-check', 'mixed')
    //     } else {
    //         // $$(table, '.th__checkbox input').setAttribute('type-check', 'mixed')
    //     }
    // }

    return cloneRow
}

async function loadSingleDataInTable(
    doc,
    tableID,
    templateRowID,
    collectionName
) {
    const tBody = $(`#${tableID} tbody`)

    if (collectionName === 'tables') {
        const clone = setDataTable(doc, templateRowID, collectionName)
        tBody.appendChild(clone)
    } else if (collectionName === 'products') {
        const clone = await setDataProduct(doc, templateRowID, collectionName)
        tBody.appendChild(clone)
    }
}

function loadDataInTable(documents, collectionName, tableId, templateRowId) {
    clearElement(`${tableId} tbody`)
    const tBody = $(`#${tableId} tbody`)
    const fragment = new DocumentFragment()

    if (collectionName === 'tables') {
        documents.forEach((doc) => {
            const clone = setDataTable(doc, templateRowId, collectionName)
            fragment.appendChild(clone)
        })
        tBody.appendChild(fragment)
    } else if (collectionName === 'products') {
        documents.forEach(async (doc) => {
            const clone = await setDataProduct(
                doc,
                templateRowId,
                collectionName
            )
            fragment.appendChild(clone)
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
    loadSingleDataInTable,
    updateSingleDataInTable,
    openConfirmation,
}
