import {
    showElement,
    hiddenElement,
    loadDataInTable,
    resetForm,
    closePopup,
} from '../../actions.js'
import getDocuments from '../../firebase/get-documents.js'
import setDocuments from '../../firebase/set-documents.js'
import updateDocument from '../../firebase/update-document.js'

class Tables {
    constructor(uid) {
        this.uid = uid
        this.showTables()
    }

    // leer tablas
    async showTables() {
        const { isNotVoid, data } = await getDocuments('tables')

        if (isNotVoid) {
            hiddenElement('info__void')
            showElement('info__show')
            loadDataInTable(data, 'tables', 'info__show', 'template__table')
        }
    }

    // crear item tabla
    async createTable(data, editId) {
        if (!!editId) {
            const onsuccess = await updateDocument(data, 'tables', editId)
            if (onsuccess) this.showTablesBefore()
        } else {
            const onsuccess = await setDocuments(data, 'tables')
            if (onsuccess) this.showTablesBefore()
        }
    }

    showTablesBefore() {
        closePopup('newitem__form')
        resetForm('newitem__form form')
        this.showTables()
    }
    // actualizar item tabla
    // eliminar item tabla
}

export default Tables
