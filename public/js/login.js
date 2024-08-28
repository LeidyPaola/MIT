document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
      if (response.ok) {
        // Almacenar el token en sessionStorage en lugar de localStorage
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/home';  // Redirigir al home
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  
  // Elimino la función autenticarUsuario ya que no se utiliza en el código