// Manejo del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
  
    if (email === '' || password === '') {
      alert('Por favor, complete todos los campos');
      return;
    }
  
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        // Almacenar el token de autenticación en el cliente (navegador)
        localStorage.setItem('token', data.token);
  
        // Redireccionar al home.html después de la autenticación exitosa
        window.location.href = '/home';
      } else {
        alert('Error en el inicio de sesión');
      }
    })
    .catch((err) => {
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
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Almacenar el token de autenticación en el cliente (navegador)
        localStorage.setItem('token', data.token);
  
        window.location.href = '/home';
      } else {
        alert('Error en el inicio de sesión con Google');
      }
    })
    .catch((err) => {
      console.error('Error:', err);
    });
  }
  
  // Inicializar Google Sign-In
  window.onload = () => {
    google.accounts.id.initialize({
      client_id: '966441046440-oeof7a1kee6la0665j5tcidq2ubbsrms.apps.googleusercontent.com',
      callback: handleCredentialResponse
    });
  
    google.accounts.id.prompt(); // Mostrar el prompt de Google Sign-In
  };
  
  // Verificar si el token de autenticación es válido en cada solicitud
  function verificarAutenticacion() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      window.location.href = '/login';
    } else {
      fetch('/api/verificar-autenticacion', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => response.json())
      .then((data) => {
        if (!data.autenticado) {
          window.location.href = '/login';
        }
      })
      .catch((err) => {
        console.error('Error:', err);
      });
    }
  }
  
  // Llamar a la función de verificación de autenticación en cada solicitud
  verificarAutenticacion();
  
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
});
