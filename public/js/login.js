// Manejo del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Redireccionar al home.html después de la autenticación exitosa
            window.location.href = '/home.html';
        } else {
            alert('Error en el inicio de sesión');
        }
    })
    .catch(err => {
        console.error('Error:', err);
    });
});

// Manejo de autenticación de Google
function handleCredentialResponse(response) {
    const idToken = response.credential;

    fetch('/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_token: idToken })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/home.html';
        } else {
            alert('Error en el inicio de sesión con Google');
        }
    })
    .catch(err => {
        console.error('Error:', err);
    });
}

// Inicializar Google Sign-In
window.onload = function() {
    google.accounts.id.initialize({
        client_id: '966441046440-oeof7a1kee6la0665j5tcidq2ubbsrms.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });

    google.accounts.id.prompt(); // Mostrar el prompt de Google Sign-In
};
