document.addEventListener('DOMContentLoaded', function() {

    // Smooth scroll para los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            let targetId = this.getAttribute('href');
            // Asegurarse de que el targetId no es solo "#" (enlace a la parte superior)
            if (targetId.length > 1) {
                let targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Ajustar por la altura del navbar fijo
                        behavior: 'smooth'
                    });
                }
            } else { // Si es solo "#", ir al inicio de la página
                 window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Validación del formulario de contacto
    const contactForm = document.getElementById('contactForm');
    const formMessageContainer = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir el envío real del formulario

            // Limpiar mensajes anteriores
            formMessageContainer.innerHTML = '';

            // Obtener valores de los campos
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            let isValid = true;
            let errors = [];

            // Validar nombre
            if (name === '') {
                isValid = false;
                errors.push('El nombre es obligatorio.');
            }

            // Validar email
            if (email === '') {
                isValid = false;
                errors.push('El email es obligatorio.');
            } else if (!isValidEmail(email)) {
                isValid = false;
                errors.push('El formato del email no es válido.');
            }

            // Validar mensaje
            if (message === '') {
                isValid = false;
                errors.push('El mensaje es obligatorio.');
            }

            if (isValid) {
                // Simular envío exitoso
                formMessageContainer.innerHTML = '<div class="alert alert-success">¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</div>';
                contactForm.reset(); // Limpiar el formulario
            } else {
                // Mostrar errores
                let errorHtml = '<div class="alert alert-danger"><ul>';
                errors.forEach(error => {
                    errorHtml += `<li>${error}</li>`;
                });
                errorHtml += '</ul></div>';
                formMessageContainer.innerHTML = errorHtml;
            }
        });
    }

    // Función auxiliar para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Activar el estado 'active' en los links de navegación según el scroll
    // (Opcional, pero mejora la UX)
    const sections = document.querySelectorAll('section[id]');
    const navbarLinks = document.querySelectorAll('#navbarNav .nav-link');

    function changeLinkState() {
        let index = sections.length;

        while(--index && window.scrollY + 100 < sections[index].offsetTop) {} // 100 es un offset

        navbarLinks.forEach((link) => link.classList.remove('active'));

        // Asegurarse de que el link correspondiente existe antes de añadir la clase active
        if (sections[index]) {
            const activeLink = document.querySelector(`#navbarNav .nav-link[href="#${sections[index].id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        } else if (window.scrollY < sections[0].offsetTop - 100) { // Si estamos arriba de la primera seccion
             const homeLink = document.querySelector(`#navbarNav .nav-link[href="#"]`); // O el link a la primera sección si no hay "home"
             if (homeLink) {
                // No hacer nada o quitar active de todos si se prefiere
             }
        }
    }

    // Ejecutar al cargar y al hacer scroll
    if (sections.length > 0 && navbarLinks.length > 0) {
        changeLinkState();
        window.addEventListener('scroll', changeLinkState);
    }

    // (Opcional) Carrusel para Productos Destacados con Bootstrap
    // Si se decide usar el carrusel de Bootstrap, se puede inicializar aquí si es necesario.
    // Por ejemplo, si se quiere controlar con JS:
    // $('.carousel').carousel({
    //   interval: 2000
    // })
    // Para esto, el HTML de la sección de productos necesitaría la estructura de un carrusel.
    // Por simplicidad, el HTML actual no tiene un carrusel, sino cards estáticas.

});
