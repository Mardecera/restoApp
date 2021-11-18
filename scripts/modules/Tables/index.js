import { firebaseApp } from '../../firebase/init-app.js'
import {
    getAuth,
    onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.2.0/firebase-auth.js'
import { showDataUser } from '../../actions.js'
import Tables from './Tables.js'

const auth = getAuth(firebaseApp)

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid
        const tables = new Tables(uid)

        showDataUser('menu__user', uid)
        $('#newitem__form form').addEventListener('submit', (event) => {
            event.preventDefault()
            tables.createTable(
                {
                    name: 'table',
                    number: +$$(event.target, '#table__number').value,
                },
                event.target.getAttribute('edit-id')
            )
        })
    } else {
        window.location.href = '/'
    }
})
