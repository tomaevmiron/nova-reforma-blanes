// Nova Reforma Blanes — interacción ligera, sin librerías
(function () {
  var TEL_WA = '34677819884';

  // Menú móvil
  var boton = document.querySelector('.menu-btn');
  var nav = document.querySelector('.nav');
  if (boton && nav) {
    boton.addEventListener('click', function () {
      var abierto = nav.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', abierto);
    });
  }

  // Aparición al hacer scroll
  var ap = document.querySelectorAll('.ap');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    ap.forEach(function (el) { io.observe(el); });
  } else {
    ap.forEach(function (el) { el.classList.add('visto'); });
  }

  // Comparador antes / después
  document.querySelectorAll('.comparar').forEach(function (c) {
    var rango = c.querySelector('input');
    var poner = function () { c.style.setProperty('--p', rango.value + '%'); };
    rango.addEventListener('input', poner);
    poner();
    // Pequeño vaivén la primera vez que se ve, para que se entienda que se arrastra
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var visto = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        visto.disconnect();
        var t0 = null, tocado = false;
        rango.addEventListener('pointerdown', function () { tocado = true; }, { once: true });
        rango.addEventListener('keydown', function () { tocado = true; }, { once: true });
        requestAnimationFrame(function paso(t) {
          if (tocado) return;
          if (!t0) t0 = t;
          var k = (t - t0) / 1600;
          if (k >= 1) { rango.value = 50; poner(); return; }
          rango.value = 50 + Math.sin(k * Math.PI * 2) * 18;
          poner();
          requestAnimationFrame(paso);
        });
      }, { threshold: 0.6 });
      visto.observe(c);
    }
  });

  // Formulario → mensaje de WhatsApp ya redactado
  var form = document.querySelector('#presupuesto');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var lineas = [
        'Hola, me gustaría pedir un presupuesto.',
        'Nombre: ' + d.get('nombre'),
        'Tipo de obra: ' + d.get('tipo'),
        'Población: ' + (d.get('lugar') || '—'),
        'Detalles: ' + (d.get('detalles') || '—')
      ];
      window.open('https://wa.me/' + TEL_WA + '?text=' + encodeURIComponent(lineas.join('\n')), '_blank', 'noopener');
    });
  }
})();
