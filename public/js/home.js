// Chatbot
function startChatbot() {
    document.getElementById('chatbot-start-btn').style.display = 'none'; // Oculta el botón de inicio del chatbot
    document.querySelector('.medico-container').style.display = 'none'; // Oculta el contenedor del médico
    document.getElementById('chatbot-iframe-container').style.display = 'block'; // Muestra el contenedor del chatbot
    document.getElementById('chatbot-iframe').src = 'https://poe.com/M-I-T'; // URL del chatbot de Poe
}

function closeChatbot() {
    document.getElementById('chatbot-iframe').src = ''; // Detiene la carga del chatbot
    document.getElementById('chatbot-iframe-container').style.display = 'none'; // Oculta el contenedor del chatbot
    document.querySelector('.medico-container').style.display = 'flex'; // Muestra el contenedor del médico
    document.getElementById('chatbot-start-btn').style.display = 'block'; // Muestra el botón de inicio del chatbot
}

function closeMedico() {
    document.querySelector('.medico-container').style.display = 'none'; // Oculta el contenedor del médico
}