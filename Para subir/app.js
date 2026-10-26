(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const COLORES = ['#a8222b', '#c9963a', '#ecc871', '#f2e4c4', '#1d4e55'];
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const azar = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const obras = (Array.isArray(window.OBRAS) ? window.OBRAS : [])
    .filter((o) => o && o.src)
    .map((o, i) => {
      const tipo = o.tipo === 'video' || /\.(mp4|webm|mov|m4v)$/i.test(o.src) ? 'video' : 'foto';
      return {
        ...o,
        tipo,
        num: 'N.º ' + String(i + 1).padStart(2, '0'),
        titulo: o.titulo || 'Número sin título',
        nota: o.nota || '',
        acto: o.acto || (tipo === 'video' ? 'En movimiento' : 'Retrato'),
        rot: ((i * 37) % 5) - 2,
      };
    });

  /* ---------- Confeti ---------- */
  const lienzo = $('#confeti');
  const ctx = lienzo.getContext('2d');
  let piezas = [];
  let animando = false;

  function ajustarLienzo() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    lienzo.width = innerWidth * dpr;
    lienzo.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener('resize', ajustarLienzo);
  ajustarLienzo();

  function confeti({ x = innerWidth / 2, y = innerHeight / 3, n = 110, dir = -Math.PI / 2, abanico = Math.PI * 2, fuerza = 1 } = {}) {
    if (reducido) n = Math.min(n, 25);
    for (let k = 0; k < n; k++) {
      const ang = dir + (Math.random() - 0.5) * abanico;
      const vel = (5 + Math.random() * 8) * fuerza;
      piezas.push({
        x, y,
        vx: Math.cos(ang) * vel,
        vy: Math.sin(ang) * vel,
        g: 0.2 + Math.random() * 0.12,
        w: 6 + Math.random() * 7,
        h: 4 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        color: azar(COLORES),
        estrella: Math.random() < 0.18,
        vida: 0,
        max: 150 + Math.random() * 90,
      });
    }
    if (!animando) {
      animando = true;
      requestAnimationFrame(paso);
    }
  }

  function estrella(r) {
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const rad = k % 2 ? r * 0.45 : r;
      const a = (k * Math.PI) / 5 - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
  }

  function paso() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    piezas = piezas.filter((p) => p.vida < p.max && p.y < innerHeight + 40);
    for (const p of piezas) {
      p.vida++;
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.min(1, (p.max - p.vida) / 40);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.estrella) estrella(p.w * 0.8);
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.cos(p.rot * 2));
      ctx.restore();
    }
    if (piezas.length) {
      requestAnimationFrame(paso);
    } else {
      animando = false;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  function canones() {
    confeti({ x: 0, y: innerHeight, dir: -Math.PI / 3, abanico: 0.7, n: 90, fuerza: 1.5 });
    confeti({ x: innerWidth, y: innerHeight, dir: (-2 * Math.PI) / 3, abanico: 0.7, n: 90, fuerza: 1.5 });
  }

  /* ---------- Escenas: los personajes entran y salen ---------- */
  let funcionIniciada = false;
  const escenas = $$('.escena');
  const obsEscenas = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      en.target.dataset.visible = en.isIntersecting ? '1' : '';
      if (funcionIniciada) en.target.classList.toggle('en-escena', en.isIntersecting);
    });
  }, { threshold: 0, rootMargin: '-20% 0px -20% 0px' });
  escenas.forEach((e) => obsEscenas.observe(e));

  /* ---------- Antesala: carga y telón ---------- */
  const antesala = $('#antesala');
  const estado = $('#estadoCarga');
  const abrir = $('#abrirTelon');
  const MENSAJES = ['Afinando la orquesta', 'Peinando al león', 'Inflando globos', 'Tensando la cuerda floja'];

  const criticas = [
    ...$$('.funcion img'),
    $('.boleteria-cartel'),
  ].map((img) => img.currentSrc || img.src);

  let cargadas = 0;
  const precarga = [...new Set(criticas)].map((src) => new Promise((ok) => {
    const im = new Image();
    im.onload = im.onerror = () => {
      cargadas++;
      const pct = Math.round((cargadas / criticas.length) * 100);
      estado.textContent = `${MENSAJES[Math.min(MENSAJES.length - 1, Math.floor(pct / 26))]}… ${Math.min(pct, 100)}%`;
      ok();
    };
    im.src = src;
  }));
  const minimo = new Promise((ok) => setTimeout(ok, 1800));
  Promise.all([Promise.all(precarga), minimo]).then(() => {
    estado.textContent = '¡Todo listo! La función está por comenzar.';
    abrir.hidden = false;
    abrir.focus();
  });

  // Sonidos: iPhone solo permite audio con sonido después de un toque,
  // por eso el redoble arranca al tocar "Pasen y vean"
  const redoble = $('#audioRedoble');
  const cancion = $('#audioCumple');
  function sonar(audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  abrir.addEventListener('click', () => {
    sonar(redoble);
    antesala.classList.add('abierta');
    document.body.classList.remove('bloqueado');
    funcionIniciada = true;
    escenas.forEach((e) => e.classList.toggle('en-escena', e.dataset.visible === '1'));
    setTimeout(canones, 450);
    setTimeout(() => {
      antesala.classList.add('fuera');
      const v = $('video', antesala);
      v.pause();
      v.removeAttribute('src');
      v.load();
    }, 1600);
  });

  $('#btnAplausos').addEventListener('click', canones);

  /* ---------- Primer Acto ---------- */
  const muro = $('#muro');

  // Proporción de cada Marco Preset y su abertura interior (% de alto/ancho)
  const PRESETS = {
    1: { ar: 540 / 800, t: 10.8, r: 14.4, b: 9.4, l: 13.5 },
    2: { ar: 722 / 800, t: 30.6, r: 20.2, b: 17.6, l: 33.4 },
    3: { ar: 425 / 618, t: 10.8, r: 14.4, b: 11.2, l: 14.4 },
    4: { ar: 729 / 800, t: 21.0, r: 23.5, b: 19.9, l: 22.6 },
  };

  function crearMedio(o, enVisor) {
    if (o.marco) {
      const img = document.createElement('img');
      img.className = 'obra-marco';
      img.src = o.src;
      img.alt = o.titulo;
      img.decoding = 'async';
      if (!enVisor) img.loading = 'lazy';
      return img;
    }
    // Marco Preset: la foto o el video va en la abertura y el marco encima
    const p = PRESETS[o.preset] || PRESETS[1];
    const marco = document.createElement('div');
    marco.className = 'marco-preset' + (o.tipo === 'video' && enVisor ? ' video-arriba' : '');
    marco.style.cssText = `--arn:${p.ar};--t:${p.t}%;--r:${p.r}%;--b:${p.b}%;--l:${p.l}%`;
    const hueco = document.createElement('div');
    hueco.className = 'hueco';
    const marcoImg = document.createElement('img');
    marcoImg.className = 'marco-img';
    marcoImg.src = `img/marcos/preset-${o.preset || 1}.png`;
    marcoImg.alt = '';
    if (!enVisor) marcoImg.loading = 'lazy';
    marco.append(hueco, marcoImg);

    if (o.tipo === 'video') {
      const v = document.createElement('video');
      v.playsInline = true;
      v.muted = !enVisor;
      v.setAttribute('playsinline', '');
      if (o.poster) v.poster = o.poster;
      if (enVisor) {
        v.controls = true;
        v.autoplay = true;
        v.src = o.src;
        hueco.appendChild(v);
      } else {
        v.setAttribute('muted', '');
        v.loop = true;
        v.preload = 'metadata';
        v.src = o.poster ? o.src : o.src + '#t=0.1';
        const play = document.createElement('span');
        play.className = 'play';
        play.textContent = '▶';
        hueco.append(v, play);
      }
      return marco;
    }
    const img = document.createElement('img');
    img.src = o.src;
    img.alt = o.titulo;
    img.decoding = 'async';
    if (!enVisor) img.loading = 'lazy';
    hueco.appendChild(img);
    return marco;
  }

  const tarjetas = obras.map((o, i) => {
    const fig = document.createElement('figure');
    fig.className = 'obra';
    fig.style.setProperty('--rot', o.rot + 'deg');

    const btn = document.createElement('button');
    btn.className = 'obra-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', `Ver número: ${o.titulo}`);
    btn.appendChild(crearMedio(o, false));
    btn.addEventListener('click', () => abrirVisor(i));

    const placa = document.createElement('figcaption');
    placa.className = 'placa';
    placa.innerHTML = '<span class="num"></span><strong></strong>';
    $('.num', placa).textContent = `${o.num} · ${o.acto}`;
    $('strong', placa).textContent = o.titulo;

    fig.append(btn, placa);
    return fig;
  });

  // Reparte los números en columnas siguiendo el orden de lectura (izquierda a derecha)
  const anchos = [matchMedia('(min-width: 900px)'), matchMedia('(min-width: 640px)')];
  function repartir() {
    const n = anchos[0].matches ? 4 : anchos[1].matches ? 3 : 2;
    const columnas = Array.from({ length: n }, () => {
      const c = document.createElement('div');
      c.className = 'columna';
      return c;
    });
    tarjetas.forEach((t, k) => columnas[k % n].appendChild(t));
    muro.replaceChildren(...columnas);
  }
  anchos.forEach((m) => m.addEventListener('change', repartir));
  repartir();

  const videosMuro = tarjetas.map((t) => $('video', t)).filter(Boolean);

  // Aparición al hacer scroll
  const obsObras = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        obsObras.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  tarjetas.forEach((t) => (reducido ? t.classList.add('visible') : obsObras.observe(t)));

  // Los videos del muro se reproducen en silencio solo cuando se ven
  const obsVideos = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting && visor.hidden) {
        v.play().then(() => v.nextElementSibling && (v.nextElementSibling.hidden = true)).catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.4 });
  videosMuro.forEach((v) => obsVideos.observe(v));

  /* ---------- Visor ---------- */
  const visor = $('#visor');
  const visorMedio = $('#visorMedio');
  let actual = 0;
  let ultimoFoco = null;

  function pausarVisor() {
    visorMedio.querySelectorAll('video').forEach((v) => v.pause());
  }

  function mostrar(i) {
    actual = i;
    const o = obras[i];
    pausarVisor();
    visorMedio.replaceChildren(crearMedio(o, true));
    $('#visorNum').textContent = `${o.num} · ${o.acto}`;
    $('#visorTitulo').textContent = o.titulo;
    $('#visorNota').textContent = o.nota;
    $('#visorContador').textContent = `Número ${i + 1} de ${obras.length}`;
    const unica = obras.length < 2;
    $('#visorAnterior').hidden = unica;
    $('#visorSiguiente').hidden = unica;
  }

  function mover(delta) {
    mostrar((actual + delta + obras.length) % obras.length);
  }

  function abrirVisor(i) {
    ultimoFoco = document.activeElement;
    videosMuro.forEach((v) => v.pause());
    visor.hidden = false;
    document.body.classList.add('bloqueado');
    mostrar(i);
    $('#visorCerrar').focus({ preventScroll: true });
  }

  function cerrarVisor() {
    pausarVisor();
    visorMedio.replaceChildren();
    visor.hidden = true;
    document.body.classList.remove('bloqueado');
    if (ultimoFoco) ultimoFoco.focus({ preventScroll: true });
  }

  $('#visorCerrar').addEventListener('click', cerrarVisor);
  $('#visorAnterior').addEventListener('click', () => mover(-1));
  $('#visorSiguiente').addEventListener('click', () => mover(1));
  visor.addEventListener('click', (e) => {
    if (e.target === visor || e.target.classList.contains('visor-figura')) cerrarVisor();
  });
  document.addEventListener('keydown', (e) => {
    if (visor.hidden) return;
    if (e.key === 'Escape') cerrarVisor();
    else if (e.key === 'ArrowLeft') mover(-1);
    else if (e.key === 'ArrowRight') mover(1);
  });

  // Deslizar con el dedo
  let toque = null;
  visor.addEventListener('touchstart', (e) => {
    toque = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  visor.addEventListener('touchend', (e) => {
    if (!toque) return;
    const dx = e.changedTouches[0].clientX - toque.x;
    const dy = e.changedTouches[0].clientY - toque.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && obras.length > 1) mover(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) cerrarVisor();
    toque = null;
  });

  /* ---------- Gran final: torta ---------- */
  const torta = $('#torta');
  const soplar = $('#soplar');
  cancion.addEventListener('ended', () => $('#gran-final').classList.remove('sonando'));
  soplar.addEventListener('click', () => {
    const apagar = !torta.classList.contains('apagada');
    torta.classList.toggle('apagada', apagar);
    $('#gran-final').classList.toggle('sonando', apagar);
    if (apagar) {
      redoble.pause();
      sonar(cancion);
      const r = torta.getBoundingClientRect();
      confeti({ x: r.left + r.width * 0.45, y: r.top + r.height * 0.1, n: 150 });
      setTimeout(canones, 300);
      $('#deseoMensaje').textContent = '¡Deseo concedido! Que siga la función.';
      soplar.textContent = 'Encender de nuevo';
    } else {
      cancion.pause();
      $('#deseoMensaje').textContent = '';
      soplar.textContent = 'Soplar las velas';
    }
  });
})();
