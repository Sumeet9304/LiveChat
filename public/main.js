const socket = io()

const clientsTotal = document.getElementById('client-total')
const messageContainer = document.getElementById('msg-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('msg-form')
const messageInput = document.getElementById('msg-input')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`
})

function sendMessage() {
    if (messageInput.value === '') return

    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }

    socket.emit('message', data)
    addMessageUI(true, data)
    messageInput.value = ''
}

socket.on('chat-msg', (data) => {
    addMessageUI(false, data)
})

function addMessageUI(isOwnMessage, data) {
    clearFeedback()

    const element = `
        <li class="${isOwnMessage ? 'msg-right' : 'msg-left'}">
            <p class="msg">
                ${data.message}
                <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
            </p>
        </li>
    `
    messageContainer.innerHTML += element
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

// Typing feedback handlers
messageInput.addEventListener('focus', () => {
    socket.emit('feedback', { feedback: `${nameInput.value} is typing...` })
})

messageInput.addEventListener('keypress', () => {
    socket.emit('feedback', { feedback: `${nameInput.value} is typing...` })
})

messageInput.addEventListener('blur', () => {
    socket.emit('feedback', { feedback: '' })
})

socket.on('feedback', (data) => {
    clearFeedback()

    if (data.feedback !== '') {
        const element = `
            <li class="msg-feedback">
                <p class="feedback">${data.feedback}</p>
            </li>
        `
        messageContainer.innerHTML += element
    }
})

function clearFeedback() {
    document.querySelectorAll('li.msg-feedback').forEach((el) => {
        el.remove()
    })
}
