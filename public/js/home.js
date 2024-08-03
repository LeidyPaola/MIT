document.addEventListener('DOMContentLoaded', function () {
    // Manejador de eventos para los dropdowns en la barra de navegación
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', function (event) {
        event.preventDefault();
        
        const dropdownMenu = this.nextElementSibling;
        
        if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
          // Alterna la visibilidad del menú desplegable
          const isVisible = dropdownMenu.style.display === 'block';
          dropdownMenu.style.display = isVisible ? 'none' : 'block';
        }
      });
    });
  
    // Manejador de eventos para el menú de usuario
    const userMenuToggle = document.querySelector('.user-menu-toggle');
    const userMenuDropdown = document.querySelector('.user-menu-dropdown');
  
    if (userMenuToggle && userMenuDropdown) {
      userMenuToggle.addEventListener('click', function (event) {
        event.preventDefault();
        
        // Alterna la visibilidad del menú desplegable del usuario
        const isVisible = userMenuDropdown.style.display === 'block';
        userMenuDropdown.style.display = isVisible ? 'none' : 'block';
      });
    }
  
    
  
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(event) {
      event.preventDefault();
      let parentLi = this.closest('li');
      let isOpen = parentLi.classList.contains('open');
  
      // Cerrar todos los menús abiertos
      document.querySelectorAll('.dropdown').forEach(item => {
        item.classList.remove('open');
      });
  
      // Abrir el menú actual si no estaba abierto
      if (!isOpen) {
        parentLi.classList.add('open');
      }
    });
  });

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
