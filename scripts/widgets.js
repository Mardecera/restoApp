function myAlert(message, type) {
    const body = document.querySelector('body')
    const template = document.querySelector('#template__alert').content
    const clone = template.cloneNode(true)
    const i = clone.querySelector('.alert__icon i')

    i.classList.add('fas')
    if (type === 'success') i.classList.add('fa-check')
    else if (type === 'error') i.classList.add('fa-ban')

    $$(clone, '.alert__body').textContent = message
    $$(clone, '.alert__action button').onclick = (event) => {
        event.preventDefault()
        event.target.parentNode.parentNode.classList.add('desappear')
        setTimeout(() => {
            event.target.parentNode.parentNode.remove()
        }, 1000)
    }
    body.style.position = 'relative'
    body.appendChild(clone)
}

export { myAlert }
