document.addEventListener('DOMContentLoaded', () => {
    const userId = /* Aquí coloca el ID del usuario que está logueado */;
    const profileForm = document.getElementById('profile-form');
    const deleteButton = document.getElementById('delete-button');
  
    // Obtener información del perfil
    fetch(`/api/profile/${userId}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('name').value = data.name;
        document.getElementById('email').value = data.email;
      })
      .catch(error => console.error('Error:', error));
  
    // Enviar información actualizada del perfil
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      fetch(`/api/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error:', error));
    });
  
    // Eliminar perfil
    deleteButton.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres eliminar tu perfil?')) {
        fetch(`/api/profile/${userId}`, {
          method: 'DELETE'
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message);
            window.location.href = '/';
          })
          .catch(error => console.error('Error:', error));
      }
    });
  });
  