
// Agrega un evento de click al botón de hamburguesa
document.querySelector('.navbar-toggler').addEventListener('click', function() {
  // Agrega o elimina la clase active a la barra lateral
  document.querySelector('.sidebar').classList.toggle('active');
});