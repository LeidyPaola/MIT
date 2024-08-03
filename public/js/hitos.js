// Selecciona todos los botones "Más"
const moreButtons = document.querySelectorAll('.more-btn');

// Agrega un evento de clic a cada botón
moreButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Selecciona la sección correspondiente
    const sectionId = button.getAttribute('data-target');
    const section = document.querySelector(sectionId);

    // Muestra u oculta la sección correspondiente
    if (window.innerWidth > 768) {
      // En pantallas grandes, muestra la sección correspondiente y oculta las demás
      const sections = document.querySelectorAll('.info-section');
      sections.forEach((s) => {
        s.classList.remove('visible');
      });
      section.classList.add('visible');
    } else {
      // En pantallas pequeñas, muestra la sección correspondiente debajo de la card
      section.classList.toggle('visible');
      const card = button.closest('.item');
      card.appendChild(section);
    }

    // Cambia el texto del botón "Más" a "Menos" o viceversa
    if (button.textContent === 'Más') {
      button.textContent = 'Menos';
    } else {
      button.textContent = 'Más';
    }

    // Solo cambia el texto del botón en pantallas pequeñas
    if (window.innerWidth >= 768) {
        if (button.textContent === 'Más') {
          button.textContent = 'Menos';
        } else {
          button.textContent = 'Más';
        }
      }
    });
  });
  

// Oculta las secciones en pantallas pequeñas al cargar la página
if (window.innerWidth <= 768) {
  const sections = document.querySelectorAll('.info-section');
  sections.forEach((section) => {
    section.classList.remove('visible');
  });
}