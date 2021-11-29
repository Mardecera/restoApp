import getDocuments from '../../firebase/database/get-all.js'
import updateDocument from '../../firebase/database/update.js'
import setDocument from '../../firebase/database/set.js'
import getDocument from '../../firebase/database/get.js'
import setFile from '../../firebase/storage/set.js'
import deleteAllFiles from '../../firebase/storage/delete-all.js'
import {
    hiddenElement,
    showElement,
    loadDataInTable,
    closePopup,
    resetForm,
    loadDataInSelect,
    loadSingleDataInTable,
    openConfirmation,
} from '../../actions.js'

class Products {
    constructor(uid) {
        this.uid = uid
        this.data = {
            mainCheck: 0,
            size: 0,
        }
        this.table = new Tablesort(document.getElementById('table__products'), {
            // sortAttribute: 'data-custom-sort-val',
        })
    }

    async showProducts() {
        try {
            const { size, data } = await getDocuments('products')
            if (!!size) {
                hiddenElement('info__void')
                showElement('info__show')
                loadDataInTable(
                    data,
                    'products',
                    'info__show',
                    'template__product'
                )
                this.data.size = size
                this.showCurrencies()
            }
            this.table.refresh()
            return new Promise((resolve) => {
                resolve(true)
            })
        } catch (error) {
            return new Promise((resolve) => {
                resolve(false)
            })
        }
    }

    async createProduct(data, editId) {
        if (!!editId) {
            const onsuccess = await this.updateProduct(data, editId)
            if (onsuccess) {
                const doc = await getDocument('products', editId)
                this.showTableOnDOM(doc)
            }
        } else {
            const { id } = await this.setProduct(data)
            if (id) {
                const doc = await getDocument('products', id)
                this.showTableOnDOM(doc)
                this.data.size++
            }
        }
        this.table.refresh()
    }

    showTableOnDOM(doc) {
        closePopup('newitem__form')
        resetForm('newitem__form form')
        loadSingleDataInTable(
            doc,
            'table__products',
            'template__product',
            'products'
        )
    }

    async setProduct(data) {
        const picture = data.picture
        const type = picture.name.split('.').pop()
        data.picture = ''

        try {
            const productSnap = await setDocument(data, 'products')
            const picturePath = `products/${productSnap.id}/profile.${type}`
            await setFile(picturePath, picture)
            await updateDocument(
                { picture: picturePath },
                'products',
                productSnap.id
            )
            return productSnap
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async updateProduct(data, editId) {
        try {
            if (data.picture) {
                const type = data.picture.name.split('.').pop()
                const picturePath = `products/${editId}/profile.${type}`
                await setFile(picturePath, data.picture)
                delete data.picture
            }
            await updateDocument(data, 'products', editId)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    deleteProduct(id) {
        openConfirmation('products', id, this.data)
    }

    async showCurrencies() {
        const { data } = await getDocuments('currencies')
        loadDataInSelect(data, 'product__currency')
    }

    revieMainCheck() {
        const mainCheck = $('#table__products #main__check')
        if (this.data.mainCheck > 0 && this.data.mainCheck < this.data.size) {
            mainCheck.setAttribute('type-checked', 'mixed')
        } else if (this.data.mainCheck === this.data.size) {
            mainCheck.setAttribute('type-checked', 'true')
        } else if (this.data.mainCheck === 0) {
            mainCheck.setAttribute('type-checked', 'false')
        }
    }

    reviewButtonDelete() {
        if (this.data.mainCheck > 0) showDeleteButton()
        else hideDeleteButton()
    }

    reviewButtonEdit() {
        if (this.data.mainCheck === 1) showEditButton()
        else hideEditButton()
    }

    eventCheck() {}
}

export default Products
