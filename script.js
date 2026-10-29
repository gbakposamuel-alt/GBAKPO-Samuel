/* ==========================================================================
   GBAKPO Samuel — Portfolio
   Interactions & comportements (JavaScript natif)
   --------------------------------------------------------------------------
   01. Menu de navigation mobile
   02. Lien actif dans la navigation
   03. Formulaire de contact (envoi par e-mail)
   04. Année du pied de page
   ========================================================================== */

(function () {
  'use strict';

  const MOBILE_BREAKPOINT = 900;

  /* 01. Menu de navigation mobile ------------------------------------------ */

  const menuButton = document.querySelector('.menu-button');
  const nav = document.getElementById('primary-nav');

  if (menuButton && nav) {
    const setMenuState = (open) => {
      nav.classList.toggle('nav--open', open);
      menuButton.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };

    menuButton.addEventListener('click', () => {
      setMenuState(!nav.classList.contains('nav--open'));
    });

    // Fermer le menu après le choix d’une destination
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenuState(false);
    });

    // Fermer avec la touche Échap, puis rendre le focus au bouton
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('nav--open')) {
        setMenuState(false);
        menuButton.focus();
      }
    });

    // Fermer au clic à l’extérieur du menu
    document.addEventListener('click', (event) => {
      if (!nav.classList.contains('nav--open')) return;
      if (nav.contains(event.target) || menuButton.contains(event.target)) return;
      setMenuState(false);
    });

    // Réinitialiser l’état lorsque l’on repasse sur grand écran
    window.addEventListener('resize', () => {
      if (window.innerWidth > MOBILE_BREAKPOINT && nav.classList.contains('nav--open')) {
        setMenuState(false);
      }
    });
  }

  /* 02. Lien actif dans la navigation -------------------------------------- */

  const navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav > a[href^="#"]')
  );

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const visible = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });

        // On retient la section la plus haute encore visible
        const current = sections
          .filter((section) => visible.has(section.id))
          .map((section) => section.id)[0];

        navLinks.forEach((link) => {
          const isCurrent = current && link.getAttribute('href') === '#' + current;
          link.classList.toggle('is-active', Boolean(isCurrent));
          if (isCurrent) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* 03. Formulaire de contact ---------------------------------------------- */

  const form = document.getElementById('contact-form');

  if (form) {
    const note = document.getElementById('form-note');
    const errorBox = document.getElementById('form-error');
    const email = 'gbakposamuel@gmail.com';

    const showError = (message, field) => {
      if (errorBox) {
        errorBox.textContent = message;
        errorBox.hidden = false;
      }
      if (field) {
        field.setAttribute('aria-invalid', 'true');
        field.focus();
      }
    };

    const clearError = () => {
      if (errorBox) {
        errorBox.hidden = true;
        errorBox.textContent = '';
      }
      form.querySelectorAll('[aria-invalid]').forEach((field) => {
        field.removeAttribute('aria-invalid');
      });
    };

    form.addEventListener('input', clearError);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      clearError();

      // Validation native : messages du navigateur, accessibles au clavier
      if (!form.checkValidity()) {
        const invalid = form.querySelector(':invalid');
        showError('Merci de compléter les champs obligatoires.', invalid);
        return;
      }

      const data = new FormData(form);
      const subject = encodeURIComponent(
        String(data.get('subject') || 'Nouveau projet')
      );
      const body = encodeURIComponent(
        'Nom : ' + data.get('name') +
        '\nE-mail : ' + data.get('email') +
        '\n\n' + data.get('message')
      );

      if (note) note.hidden = false;
      window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
    });
  }

  /* 04. Année du pied de page ---------------------------------------------- */

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
