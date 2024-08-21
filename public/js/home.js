// Función para obtener el nombre del usuario autenticado y actualizar el header
async function loadUserInfo() {
    try {
        const response = await fetch('/api/user-info', {
            method: 'GET',
            credentials: 'include' // Asegura que las cookies de sesión se envíen
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('username').textContent = data.name;
        } else {
            console.error('Error al obtener la información del usuario.');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

// Cargar la información del usuario al cargar la página
loadUserInfo();