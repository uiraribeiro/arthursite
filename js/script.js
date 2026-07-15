(function () {
  'use strict';

  /* ---------- Header: solid background on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu');
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    '.section-title, .section-subtitle, .empty-state, .media-video, .media-spotify, ' +
    '.instagram-block, .about-text, .about-photos, .contact-form'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  var feedback = document.getElementById('form-feedback');

  function setFieldError(field, hasError) {
    var group = field.closest('.form-group');
    if (group) group.classList.toggle('has-error', hasError);
  }

  function validateForm() {
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      var fieldValid = field.checkValidity();
      setFieldError(field, !fieldValid);
      if (!fieldValid) valid = false;
    });
    return valid;
  }

  form.querySelectorAll('[required]').forEach(function (field) {
    field.addEventListener('blur', function () {
      setFieldError(field, !field.checkValidity());
    });
  });

  function handleContactSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      feedback.textContent = 'Preencha todos os campos obrigatórios antes de enviar.';
      feedback.className = 'form-feedback error';
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    feedback.textContent = 'Enviando...';
    feedback.className = 'form-feedback';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          feedback.textContent = 'Pedido enviado com sucesso! Em breve entraremos em contato.';
          feedback.className = 'form-feedback success';
          form.reset();
        } else {
          feedback.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
          feedback.className = 'form-feedback error';
        }
      })
      .catch(function () {
        feedback.textContent = 'Não foi possível enviar agora. Verifique sua conexão e tente novamente.';
        feedback.className = 'form-feedback error';
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  }

  form.addEventListener('submit', handleContactSubmit);
})();
