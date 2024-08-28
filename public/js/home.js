async function obtenerUsuario() {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No se encontró el token de autenticación');
      window.location.href = '/login'; // Redirige al login si no hay token
      return;
    }
    const response = await fetch('/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    if (data && data.name) {
      console.log('Información del usuario:', data);
      document.getElementById('user-name').textContent = data.name;
      sessionStorage.setItem('user', JSON.stringify(data)); // Guarda la información del usuario
    } else {
      console.error('No se pudo obtener la información del usuario');
      window.location.href = '/login'; // Redirige al login si no se puede obtener el usuario
    }
  } catch (error) {
    console.error(error);
    window.location.href = '/login'; // Redirige al login si hay un error
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  console.log("Usuario desde sessionStorage:", user);
  
  if (!user) {
    console.log("Usuario no encontrado en sessionStorage, obteniendo del servidor...");
    await obtenerUsuario(); // Intenta obtener el usuario si no está en sessionStorage
  } else {
    document.getElementById('user-name').textContent = user.name;
  }
});