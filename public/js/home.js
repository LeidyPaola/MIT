async function autenticarUsuario(username, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      const token = data.token;
      // Guardar el token en la sesión
      sessionStorage.setItem('token', token);
      return token;
    } catch (error) {
      console.error(error);
    }
  }


  async function obtenerUsuario() {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
      }
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      const userName = data.name;
      document.getElementById('user-name').textContent = userName;
      // Guardar la información del usuario en la sesión
      sessionStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  }

  const user = JSON.parse(sessionStorage.getItem('user'));
if (user) {
  document.getElementById('user-name').textContent = user.name;
} else {
  console.error('No se encontró el usuario en la sesión');
}