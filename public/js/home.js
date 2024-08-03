

  
 

  document.addEventListener('DOMContentLoaded', function () {
    // ...
    const userMenuToggle = document.querySelector('.user-menu-toggle');
    const userMenuDropdown = document.querySelector('.user-menu-dropdown');
    const userNameElement = document.querySelector('.user-name span.username');

    if (userMenuToggle && userMenuDropdown) {
      userMenuToggle.addEventListener('click', function (event) {
        event.preventDefault();

        // Hacer solicitud a la API para obtener el nombre del usuario autenticado
        fetch('/api/user-info')
          .then(response => response.json())
          .then(data => {
            userNameElement.textContent = data.username;
          })
          .catch(error => console.error('Error:', error));
      });
    }
});

// Agrega un evento de click al botón de hamburguesa
document.querySelector('.navbar-toggler').addEventListener('click', function() {
  // Agrega o elimina la clase active a la barra lateral
  document.querySelector('.sidebar').classList.toggle('active');
});