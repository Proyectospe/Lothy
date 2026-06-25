const URL_SUPABASE       = 'https://akbnpyuvyonnhijcarvd.supabase.co';
const CLAVE_SUPABASE     = 'sb_publishable_pU47lL9dduqVPclX4H6KRg_SoUoET-S';
const SITE_KEY_RECAPTCHA = '6LdhljMtAAAAAH7OEDVrJq8SB7wZsdkmW-n0F4Gw';

const CABECERAS = {
  'apikey': CLAVE_SUPABASE,
  'Authorization': `Bearer ${CLAVE_SUPABASE}`,
  'Content-Type': 'application/json'
};

// ─── RECAPTCHA ────────────────────────────────────────────────
async function obtenerTokenRecaptcha(accion) {
  return new Promise((resolver, rechazar) => {
    grecaptcha.ready(() => {
      grecaptcha.execute(SITE_KEY_RECAPTCHA, { action: accion })
        .then(resolver)
        .catch(rechazar);
    });
  });
}

// ─── CARGAR COMENTARIOS ───────────────────────────────────────
async function cargarComentarios(slugPagina, contenedorId) {
  try {
    const respuesta = await fetch(
      `${URL_SUPABASE}/rest/v1/comentarios?slug_pagina=eq.${slugPagina}&order=creado_en.desc`,
      { headers: CABECERAS }
    );
    const comentarios = await respuesta.json();
    const contenedor = document.getElementById(contenedorId);

    if (!comentarios.length) {
      contenedor.innerHTML = '<p class="sin-mensajes">Aún no hay mensajes. ¡Sé el primero!</p>';
      return;
    }

    contenedor.innerHTML = comentarios.map(c => `
      <div class="mensaje-card">
        <p>${escaparHtml(c.contenido)}</p>
        <span class="mensaje-fecha">${formatearFecha(c.creado_en)}</span>
      </div>
    `).join('');

  } catch (error) {
    console.error('❌ Error al cargar comentarios:', error);
  }
}

// ─── PUBLICAR COMENTARIO ──────────────────────────────────────
async function publicarComentario(slugPagina, contenedorId, textareaEl, botonEl) {
  const contenido = textareaEl.value.trim();
  if (!contenido) {
    return;
  }

  botonEl.disabled = true;
  botonEl.textContent = 'Enviando...';

  try {
    // ── Validar reCAPTCHA ──

    const tokenRecaptcha = await obtenerTokenRecaptcha('enviar_comentario');

    // ── Enviar a Supabase ──
    const cuerpo = { slug_pagina: slugPagina, contenido };

    const respuesta = await fetch(`${URL_SUPABASE}/rest/v1/comentarios`, {
      method: 'POST',
      headers: { ...CABECERAS, 'Prefer': 'return=minimal' },
      body: JSON.stringify(cuerpo)
    });

    const textoRespuesta = await respuesta.text();

    if (respuesta.ok) {
      textareaEl.value = '';
      await cargarComentarios(slugPagina, contenedorId);
    } else {
      alert('Error al enviar. Intenta de nuevo.');
    }

  } catch (error) {
    alert('No se pudo conectar. Intenta de nuevo.');
  }

  botonEl.disabled = false;
  botonEl.textContent = botonEl.dataset.textoOriginal;
}

// ─── UTILIDADES ───────────────────────────────────────────────
function escaparHtml(texto) {
  const el = document.createElement('div');
  el.textContent = texto;
  return el.innerHTML;
}

function formatearFecha(fechaIso) {
  return new Date(fechaIso).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ─── INICIALIZAR ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // — Caja anónima —
  const formAnonimo  = document.getElementById('anonymous-form');
  const textareaAnon = formAnonimo.querySelector('textarea');
  const botonAnon    = formAnonimo.querySelector('button[type="submit"]');
  botonAnon.dataset.textoOriginal = botonAnon.textContent;

  cargarComentarios('caja-anonima', 'messages-container');

  formAnonimo.addEventListener('submit', (e) => {
    e.preventDefault();
    publicarComentario('caja-anonima', 'messages-container', textareaAnon, botonAnon);
  });

  // — Reto semanal —
  const formReto     = document.getElementById('challenge-form');
  const textareaReto = formReto.querySelector('textarea');
  const botonReto    = formReto.querySelector('button[type="submit"]');
  botonReto.dataset.textoOriginal = botonReto.textContent;

  cargarComentarios('reto-semanal', 'challenge-feedback-container');

  formReto.addEventListener('submit', (e) => {
    e.preventDefault();
    publicarComentario('reto-semanal', 'challenge-feedback-container', textareaReto, botonReto);
  });

});