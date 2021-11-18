import getDocuments from '../../firebase/database/get-all.js'
import updateDocument from '../../firebase/database/update.js'
import setDocument from '../../firebase/database/set.js'
import setFile from '../../firebase/storage/set.js'
import {
    hiddenElement,
    showElement,
    loadDataInTable,
    closePopup,
    resetForm,
    loadDataInSelect,
} from '../../actions.js'

class Products {
    constructor(uid) {
        this.uid = uid
        this.showProducts()
    }

    async showProducts() {
        const { isNotVoid, data } = await getDocuments('products')
        if (isNotVoid) {
            hiddenElement('info__void')
            showElement('info__show')
            loadDataInTable(data, 'products', 'info__show', 'template__product')
            this.showCurrencies()
        }
    }

    async createProduct(data, editId) {
        if (!!editId) {
            const onsuccess = await this.updateProduct(data, editId)
            if (onsuccess) this.showNewProduct()
        } else {
            const onsuccess = await this.setProduct(data)
            if (onsuccess) this.showNewProduct()
        }
    }

    showNewProduct() {
        closePopup('newitem__form')
        resetForm('newitem__form form')
        this.showProducts()
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
            return true
        } catch (error) {
            console.log(error)
            return false
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

    async showCurrencies() {
        const { data } = await getDocuments('currencies')
        loadDataInSelect(data, 'product__currency')
    }
}

export default Products
