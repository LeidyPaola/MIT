document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const passwordError = document.getElementById('password-error');
  
    // Agrega evento de input a los campos de contraseña y confirmar contraseña
    password.addEventListener('input', verificarContraseñas);
    confirmPassword.addEventListener('input', verificarContraseñas);
  
    // Función para verificar si las contraseñas coinciden
    function verificarContraseñas() {
      if (password.value !== confirmPassword.value) {
        passwordError.textContent = 'Las contraseñas no coinciden.';
        passwordError.style.color = 'red'; // Agrega estilo para cambiar el color a rojo
      } else {
        passwordError.textContent = '';
        passwordError.style.color = ''; // Restablece el estilo por defecto
      }
    }
  
    // Agrega evento de submit al formulario
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Verifica si las contraseñas coinciden antes de enviar el formulario
      if (password.value !== confirmPassword.value) {
        passwordError.textContent = 'Las contraseñas no coinciden.';
        passwordError.style.color = 'red'; // Agrega estilo para cambiar el color a rojo
        return;
      }
  
      passwordError.textContent = '';
      passwordError.style.color = ''; // Restablece el estilo por defecto
  
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        registrationDate: new Date().toISOString()
      };
  
      console.log('Datos enviados:', data); // Verifica los datos en la consola
  
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        const result = await response.json();
        if (response.ok) {
          alert('Registro exitoso');
          window.location.href = '/home';
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar. Inténtalo de nuevo.');
      }
    });
  });
  
  // Función para cambiar la visibilidad de la contraseña
  function togglePasswordVisibility(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const eyeIcon = document.getElementById(`eye-icon-${fieldId}`);
  
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    } else {
      passwordField.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  }

  function googleSignIn() {
    // Inicializa la autenticación de Google
    const googleAuth = new google.auth.GoogleAuth({
      client_id: 'TU_CLIENT_ID_DE_GOOGLE',
      scope: 'profile email',
    });
  
    // Abre la ventana de autenticación de Google
    googleAuth.signIn().then((result) => {
      // Obtiene la información de autenticación de Google
      const token = result.credential.accessToken;
      const profile = result.getBasicProfile();
  
      // Envía la información de autenticación a tu servidor
      fetch('/google-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          profile,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Si la autenticación es exitosa, redirige a la página de inicio con la sesión iniciada
          window.location.href = '/home';
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }