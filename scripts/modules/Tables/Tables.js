import {
    showElement,
    hiddenElement,
    loadDataInTable,
    loadSingleDataInTable,
    updateSingleDataInTable,
    resetForm,
    closePopup,
} from '../../actions.js'
import getDocuments from '../../firebase/database/get-all.js'
import setDocument from '../../firebase/database/set.js'
import updateDocument from '../../firebase/database/update.js'
import getDocument from '../../firebase/database/get.js'

class Tables {
    constructor(uid) {
        this.uid = uid
        this.showTables()
        this.table = new Tablesort($('#table__tables'), {
            sortAttribute: 'data-custom-sort-val',
            // descending: true,
        })
    }

    // leer tablas
    async showTables() {
        const { isNotVoid, data } = await getDocuments('tables')

        if (isNotVoid) {
            hiddenElement('info__void')
            showElement('info__show')
            loadDataInTable(data, 'tables', 'info__show', 'template__table')
        }
        this.table.refresh()
    }

    // crear item tabla
    async createTable(data, editId) {
        if (!!editId) {
            const onsuccess = await updateDocument(data, 'tables', editId)
            const newData = await getDocument('tables', editId)
            if (onsuccess) this.updateTableOnDom(newData)
        } else {
            const { id } = await setDocument(data, 'tables')
            const newData = await getDocument('tables', id)
            if (newData) this.showTableOnDOM(newData)
        }
        this.table.refresh()
    }

    showTableOnDOM(data) {
        closePopup('newitem__form')
        resetForm('newitem__form form')
        loadSingleDataInTable(data, 'info__show', 'template__table', 'tables')
    }

    updateTableOnDom(data) {
        closePopup('newitem__form')
        resetForm('newitem__form form')
        updateSingleDataInTable(data)
    }
    // actualizar item tabla
    // eliminar item tabla
}

export default Tables
