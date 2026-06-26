// =============================================
// CONFIGURACIÓN
// =============================================
const URL_SUPABASE = 'https://akbnpyuvyonnhijcarvd.supabase.co';
const CLAVE_SUPABASE = 'sb_publishable_pU47lL9dduqVPclX4H6KRg_SoUoET-S';
const SITE_KEY_RECAPTCHA = '6LdhljMtAAAAAH7OEDVrJq8SB7wZsdkmW-n0F4Gw';

const CABECERAS = {
  'apikey': CLAVE_SUPABASE,
  'Authorization': `Bearer ${CLAVE_SUPABASE}`,
  'Content-Type': 'application/json'
};

// =============================================
// UTILIDADES
// =============================================
function escaparHtml(texto) {
  const el = document.createElement('div');
  el.textContent = texto;
  return el.innerHTML;
}

function formatearFecha(fechaIso) {
  return new Date(fechaIso).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function generarColorAvatar(nombre) {
  const colores = ['#6c63ff', '#a78bfa', '#f472b6', '#fb923c', '#34d399', '#60a5fa', '#fbbf24'];
  const index = nombre ? nombre.length % colores.length : 0;
  return colores[index];
}

function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function obtenerUsuarioId() {
  let id = localStorage.getItem('lothy_usuario_id');
  if (!id) {
    id = generarUUID();
    localStorage.setItem('lothy_usuario_id', id);
  }
  return id;
}

// =============================================
// SISTEMA DE NOTIFICACIONES CON ANIMACIÓN
// =============================================

function mostrarNotificacion(tipo, titulo, mensaje, duracion = 4000) {
    const container = document.getElementById('notification-container');
    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.id = 'notification-container';
        newContainer.className = 'notification-container';
        document.body.appendChild(newContainer);
        return mostrarNotificacion(tipo, titulo, mensaje, duracion);
    }

    const iconos = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    const colores = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    const notificacion = document.createElement('div');
    notificacion.className = 'notification';
    notificacion.style.borderLeftColor = colores[tipo] || colores.success;

    notificacion.innerHTML = `
        <div class="notif-icon ${tipo === 'error' ? 'error' : ''}">
            ${iconos[tipo] || '✅'}
        </div>
        <div class="notif-content">
            <h4>${titulo}</h4>
            <p>${mensaje}</p>
        </div>
        <button class="notif-close" onclick="cerrarNotificacion(this)">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notificacion);

    const timeout = setTimeout(() => {
        cerrarNotificacion(notificacion);
    }, duracion);

    notificacion.dataset.timeout = timeout;

    return notificacion;
}

function cerrarNotificacion(elemento) {
    const notificacion = elemento.closest ? elemento.closest('.notification') : elemento;
    if (!notificacion) return;

    if (notificacion.dataset.timeout) {
        clearTimeout(parseInt(notificacion.dataset.timeout));
    }

    if (notificacion.classList.contains('cerrando')) return;

    notificacion.classList.add('cerrando');

    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.remove();
        }
    }, 400);
}

function limpiarNotificaciones() {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notificaciones = container.querySelectorAll('.notification');
    notificaciones.forEach(notif => {
        cerrarNotificacion(notif);
    });
}

// =============================================
// PUBLICACIONES
// =============================================
let publicacionesCache = [];
let categoriaFiltro = 'Todas';

async function cargarPublicaciones() {
  try {
    const respuesta = await fetch(
      `${URL_SUPABASE}/rest/v1/publicaciones?order=creado_en.desc`,
      { headers: CABECERAS }
    );
    publicacionesCache = await respuesta.json();
    renderPublicaciones();
    actualizarContador();
  } catch (error) {
    console.error('❌ Error al cargar publicaciones:', error);
    mostrarNotificacion('error', 'Error al cargar', 'No se pudieron cargar las publicaciones.');
  }
}

function actualizarContador() {
  const contador = document.getElementById('contador-publicaciones');
  if (contador) {
    const count = publicacionesCache.length;
    contador.textContent = `${count} publicación${count !== 1 ? 'es' : ''}`;
  }
}

async function contarComentarios(publicacionId) {
  try {
    const respuesta = await fetch(
      `${URL_SUPABASE}/rest/v1/comentarios?publicacion_id=eq.${publicacionId}&select=count`,
      { headers: CABECERAS }
    );
    const data = await respuesta.json();
    return data.length || 0;
  } catch {
    return 0;
  }
}

function renderPublicaciones() {
  const container = document.getElementById('publicaciones-container');
  if (!container) return;

  let filtradas = publicacionesCache;
  if (categoriaFiltro !== 'Todas') {
    filtradas = filtradas.filter(p => p.categoria === categoriaFiltro);
  }

  if (!filtradas.length) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>No hay publicaciones en esta categoría</p>
        <p class="sub">¡Sé el primero en compartir!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtradas.map(p => {
    const usuarioId = p.usuario_id || 'anonimo';
    const inicial = usuarioId !== 'anonimo' ? usuarioId[0].toUpperCase() : 'A';
    const colorAvatar = usuarioId !== 'anonimo' ? generarColorAvatar(usuarioId) : '#94a3b8';
    
    return `
      <div class="publicacion-card" data-id="${p.id}">
        <div class="publicacion-header">
          <div class="publicacion-usuario">
            <div class="avatar-anonimo" style="background: ${colorAvatar}">
              <div class="avatar">
                  <i class="fas fa-user"></i>
              </div>
            </div>
            <div>
              <strong>${usuarioId !== 'anonimo' ? 'Usuario' : 'Anónimo'}</strong>
              <span class="fecha">${formatearFecha(p.creado_en)}</span>
            </div>
          </div>
          ${p.categoria && p.categoria !== 'Sin categoría' && p.categoria !== 'Reto Semanal' ? 
            `<span class="publicacion-categoria">${p.categoria}</span>` : 
            ''}
        </div>
        
        <p class="publicacion-contenido">${escaparHtml(p.contenido)}</p>
        
        <div class="publicacion-footer">
          <button class="btn-like ${p.user_liked ? 'liked' : ''}" data-id="${p.id}">
            <i class="fas fa-heart"></i>
            <span>${p.likes || 0}</span>
          </button>
          
          <button class="btn-comentar" data-id="${p.id}">
            <i class="fas fa-comment"></i>
            <span id="contador-comentarios-${p.id}">0</span>
          </button>
        </div>
        
        <div class="comentarios-container" id="comentarios-${p.id}"></div>
        <div class="form-comentario" id="form-comentario-${p.id}">
          <textarea placeholder="Escribe un comentario..." rows="2"></textarea>
          <button class="btn-enviar-comentario" data-id="${p.id}">Comentar</button>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.btn-like').forEach(btn => {
    btn.addEventListener('click', () => toggleLike(btn.dataset.id));
  });

  document.querySelectorAll('.btn-comentar').forEach(btn => {
    btn.addEventListener('click', () => toggleComentarioForm(btn.dataset.id));
  });

  document.querySelectorAll('.btn-enviar-comentario').forEach(btn => {
    btn.addEventListener('click', () => publicarComentario(btn.dataset.id));
  });

  filtradas.forEach(p => {
    cargarComentarios(p.id);
    contarComentarios(p.id).then(count => {
      const span = document.getElementById(`contador-comentarios-${p.id}`);
      if (span) span.textContent = count;
    });
  });
}

// =============================================
// LIKES
// =============================================
async function toggleLike(publicacionId) {
  const usuarioId = obtenerUsuarioId();
  
  try {
    const check = await fetch(
      `${URL_SUPABASE}/rest/v1/likes_publicaciones?publicacion_id=eq.${publicacionId}&usuario_id=eq.${usuarioId}`,
      { headers: CABECERAS }
    );
    const existing = await check.json();

    if (existing.length > 0) {
      await fetch(
        `${URL_SUPABASE}/rest/v1/likes_publicaciones?publicacion_id=eq.${publicacionId}&usuario_id=eq.${usuarioId}`,
        { method: 'DELETE', headers: CABECERAS }
      );
    } else {
      await fetch(`${URL_SUPABASE}/rest/v1/likes_publicaciones`, {
        method: 'POST',
        headers: CABECERAS,
        body: JSON.stringify({ publicacion_id: publicacionId, usuario_id: usuarioId })
      });
    }
    
    await cargarPublicaciones();
  } catch (error) {
    console.error('❌ Error al dar like:', error);
    mostrarNotificacion('warning', 'No se pudo dar like', 'Intenta de nuevo.');
  }
}

// =============================================
// COMENTARIOS
// =============================================
async function cargarComentarios(publicacionId) {
  try {
    const respuesta = await fetch(
      `${URL_SUPABASE}/rest/v1/comentarios?publicacion_id=eq.${publicacionId}&order=creado_en.asc`,
      { headers: CABECERAS }
    );
    const comentarios = await respuesta.json();
    renderComentarios(publicacionId, comentarios);
    
    const span = document.getElementById(`contador-comentarios-${publicacionId}`);
    if (span) span.textContent = comentarios.length;
  } catch (error) {
    console.error('❌ Error al cargar comentarios:', error);
  }
}

function renderComentarios(publicacionId, comentarios) {
  const container = document.getElementById(`comentarios-${publicacionId}`);
  if (!container) return;

  if (!comentarios.length) {
    container.innerHTML = '';
    return;
  }

  const principales = comentarios.filter(c => !c.padre_id);
  const respuestas = comentarios.filter(c => c.padre_id);

  container.innerHTML = principales.map(c => {
    const respuestasHijo = respuestas.filter(r => r.padre_id === c.id);
    const usuarioId = c.usuario_id || 'anonimo';
    
    return `
      <div class="comentario-item" data-id="${c.id}">
        <div class="comentario-header">
          <strong>${usuarioId !== 'anonimo' ? 'Usuario' : 'Anónimo'}</strong>
          <span>·</span>
          <span>${formatearFecha(c.creado_en)}</span>
        </div>
        <div class="comentario-contenido">${escaparHtml(c.contenido)}</div>
        <div class="comentario-acciones">
          <button class="btn-like-comentario" data-id="${c.id}">
            <i class="fas fa-heart"></i> ${c.likes || 0}
          </button>
          <button class="btn-responder" data-id="${c.id}">Responder</button>
        </div>
        ${respuestasHijo.length ? `
          <div class="respuestas-container">
            ${respuestasHijo.map(r => {
              const rUsuarioId = r.usuario_id || 'anonimo';
              return `
                <div class="comentario-item" data-id="${r.id}" style="margin-left: 0; border-left: 2px solid #e8ecf4; padding-left: 0.75rem;">
                  <div class="comentario-header">
                    <strong>${rUsuarioId !== 'anonimo' ? 'Usuario' : 'Anónimo'}</strong>
                    <span>·</span>
                    <span>${formatearFecha(r.creado_en)}</span>
                  </div>
                  <div class="comentario-contenido">${escaparHtml(r.contenido)}</div>
                  <div class="comentario-acciones">
                    <button class="btn-like-comentario" data-id="${r.id}">
                      <i class="fas fa-heart"></i> ${r.likes || 0}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  document.querySelectorAll('.btn-like-comentario').forEach(btn => {
    btn.addEventListener('click', () => toggleLikeComentario(btn.dataset.id));
  });

  document.querySelectorAll('.btn-responder').forEach(btn => {
    btn.addEventListener('click', () => mostrarFormularioRespuesta(publicacionId, btn.dataset.id));
  });
}

// =============================================
// PUBLICAR COMENTARIO
// =============================================
async function publicarComentario(publicacionId, padreId = null) {
  const formId = padreId ? `form-respuesta-${padreId}` : `form-comentario-${publicacionId}`;
  const textarea = document.querySelector(`#${formId} textarea`);
  const boton = document.querySelector(`#${formId} .btn-enviar-comentario`);
  
  if (!textarea) return;
  
  const contenido = textarea.value.trim();
  if (!contenido) {
    mostrarNotificacion('warning', 'Campo vacío', 'Escribe un comentario antes de enviar.');
    textarea.focus();
    return;
  }

  boton.disabled = true;
  boton.textContent = 'Enviando...';

  try {
    const usuarioId = obtenerUsuarioId();

    const cuerpo = {
      publicacion_id: publicacionId,
      contenido,
      usuario_id: usuarioId,
      anonimo: true
    };

    if (padreId) cuerpo.padre_id = padreId;

    const respuesta = await fetch(`${URL_SUPABASE}/rest/v1/comentarios`, {
      method: 'POST',
      headers: CABECERAS,
      body: JSON.stringify(cuerpo)
    });

    if (respuesta.ok) {
      textarea.value = '';
      await cargarComentarios(publicacionId);
      await cargarPublicaciones();
      mostrarNotificacion('success', 'Comentario enviado 💬', 'Tu comentario se publicó correctamente.');
      
      if (padreId) {
        const form = document.getElementById(formId);
        if (form) form.classList.remove('visible');
      }
    } else {
      mostrarNotificacion('error', 'Error al enviar', 'No se pudo publicar el comentario.');
    }
  } catch (error) {
    console.error('❌ Error al publicar comentario:', error);
    mostrarNotificacion('error', 'Error de conexión', 'Verifica tu conexión a internet.');
  }

  boton.disabled = false;
  boton.textContent = 'Comentar';
}

// =============================================
// TOGGLES Y UTILIDADES
// =============================================
function toggleComentarioForm(publicacionId) {
  const form = document.getElementById(`form-comentario-${publicacionId}`);
  if (form) {
    form.classList.toggle('visible');
    if (form.classList.contains('visible')) {
      form.querySelector('textarea').focus();
    }
  }
}

function mostrarFormularioRespuesta(publicacionId, comentarioId) {
  const container = document.querySelector(`#comentarios-${publicacionId} .comentario-item[data-id="${comentarioId}"]`);
  if (!container) return;

  let form = container.querySelector('.form-respuesta');
  if (!form) {
    form = document.createElement('div');
    form.className = 'form-comentario visible form-respuesta';
    form.id = `form-respuesta-${comentarioId}`;
    form.innerHTML = `
      <textarea placeholder="Escribe una respuesta..." rows="2"></textarea>
      <button class="btn-enviar-comentario" data-id="${comentarioId}">Responder</button>
    `;
    container.appendChild(form);

    form.querySelector('.btn-enviar-comentario').addEventListener('click', () => {
      publicarComentario(publicacionId, comentarioId);
    });
  } else {
    form.classList.toggle('visible');
    if (form.classList.contains('visible')) {
      form.querySelector('textarea').focus();
    }
  }
}

async function toggleLikeComentario(comentarioId) {
  const usuarioId = obtenerUsuarioId();
  
  try {
    const check = await fetch(
      `${URL_SUPABASE}/rest/v1/likes_comentarios?comentario_id=eq.${comentarioId}&usuario_id=eq.${usuarioId}`,
      { headers: CABECERAS }
    );
    const existing = await check.json();

    if (existing.length > 0) {
      await fetch(
        `${URL_SUPABASE}/rest/v1/likes_comentarios?comentario_id=eq.${comentarioId}&usuario_id=eq.${usuarioId}`,
        { method: 'DELETE', headers: CABECERAS }
      );
    } else {
      await fetch(`${URL_SUPABASE}/rest/v1/likes_comentarios`, {
        method: 'POST',
        headers: CABECERAS,
        body: JSON.stringify({ comentario_id: comentarioId, usuario_id: usuarioId })
      });
    }
    
    publicacionesCache.forEach(p => cargarComentarios(p.id));
  } catch (error) {
    console.error('❌ Error al dar like a comentario:', error);
    mostrarNotificacion('warning', 'No se pudo dar like', 'Intenta de nuevo.');
  }
}

// =============================================
// FILTROS
// =============================================
function setupFiltros() {
  const container = document.getElementById('filtros-container');
  if (!container) return;

  const categorias = ['Todas', 'Ansiedad', 'Estrés', 'Amigos', 'Estudios', 'Familia'];
  
  container.innerHTML = categorias.map(cat => `
    <button class="filtro-btn ${cat === 'Todas' ? 'activo' : ''}" data-categoria="${cat}">
      ${cat === 'Todas' ? '📋 Todas' : cat}
    </button>
  `).join('');

  container.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      categoriaFiltro = btn.dataset.categoria;
      renderPublicaciones();
    });
  });
}

// =============================================
// NUEVA PUBLICACIÓN (con botón type="button")
// =============================================
function publicarNuevaPublicacion() {
  const form = document.getElementById('nueva-publicacion-form');
  if (!form) return;

  const textarea = form.querySelector('textarea');
  const boton = document.getElementById('btn-publicar');
  if (!boton) return;

  let categoriaSeleccionada = 'Sin categoría';

  form.querySelectorAll('.categoria-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      form.querySelectorAll('.categoria-chip').forEach(c => c.classList.remove('activa'));
      chip.classList.add('activa');
      categoriaSeleccionada = chip.dataset.categoria;
    });
  });

  boton.addEventListener('click', async function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const contenido = textarea.value.trim();
    if (!contenido) {
      mostrarNotificacion('warning', 'Campo vacío', 'Escribe algo antes de publicar.');
      textarea.focus();
      return;
    }

    boton.disabled = true;
    boton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publicando...';

    try {
      const usuarioId = obtenerUsuarioId();
      
      const cuerpo = {
        contenido,
        usuario_id: usuarioId,
        anonimo: true
      };
      
      if (categoriaSeleccionada && categoriaSeleccionada !== 'Sin categoría') {
        cuerpo.categoria = categoriaSeleccionada;
      }

      const respuesta = await fetch(`${URL_SUPABASE}/rest/v1/publicaciones`, {
        method: 'POST',
        headers: CABECERAS,
        body: JSON.stringify(cuerpo)
      });

      if (respuesta.ok) {
        textarea.value = '';
        form.querySelectorAll('.categoria-chip').forEach(c => c.classList.remove('activa'));
        form.querySelector('.categoria-chip[data-categoria="Sin categoría"]')?.classList.add('activa');
        categoriaSeleccionada = 'Sin categoría';
        await cargarPublicaciones();
        mostrarNotificacion('success', '¡Publicado! 🎉', 'Tu mensaje se compartió con la comunidad.');
      } else {
        const error = await respuesta.text();
        console.error('Error:', error);
        mostrarNotificacion('error', 'Error al publicar', 'Intenta de nuevo en unos momentos.');
      }
    } catch (error) {
      console.error('❌ Error al publicar:', error);
      mostrarNotificacion('error', 'Error de conexión', 'Verifica tu conexión a internet.');
    }

    boton.disabled = false;
    boton.innerHTML = '<i class="fas fa-paper-plane"></i> Publicar';
  });
}

// =============================================
// JUEGOS
// =============================================
function setupJuegos() {
  document.querySelectorAll('.game-card button').forEach(btn => {
    btn.addEventListener('click', () => {
      const promptText = btn.dataset.prompt;
      const respuesta = prompt(promptText);
      if (respuesta !== null && respuesta.trim() !== '') {
        const resultContainer = btn.parentElement.querySelector('.game-result');
        if (resultContainer) {
          resultContainer.textContent = `💭 ${respuesta.trim()}`;
          mostrarNotificacion('success', '¡Respuesta guardada! 🎮', 'Tu respuesta se ha registrado.');
        }
      } else {
        mostrarNotificacion('warning', 'Respuesta vacía', 'Escribe algo para compartir.');
      }
    });
  });
}

// =============================================
// CAJA ANÓNIMA ORIGINAL (usando slug_pagina)
// =============================================

async function cargarMensajesCajaAnonima() {
  try {
    const respuesta = await fetch(
      `${URL_SUPABASE}/rest/v1/comentarios?slug_pagina=eq.caja-anonima&order=creado_en.desc&limit=10`,
      { headers: CABECERAS }
    );
    const mensajes = await respuesta.json();
    const container = document.getElementById('messages-container');
    
    if (!container) return;
    
    if (!mensajes.length) {
      container.innerHTML = '<p class="sin-mensajes">Aún no hay mensajes. ¡Sé el primero!</p>';
      return;
    }

    container.innerHTML = mensajes.map(m => `
      <div class="mensaje-card">
        <p>${escaparHtml(m.contenido)}</p>
        <span class="mensaje-fecha">${formatearFecha(m.creado_en)}</span>
      </div>
    `).join('');
  } catch (error) {
    console.error('❌ Error al cargar mensajes:', error);
    mostrarNotificacion('error', 'Error al cargar', 'No se pudieron cargar los mensajes.');
  }
}

function setupFormularioAnonimo() {
  const form = document.getElementById('anonymous-form');
  if (!form) return;

  const textarea = form.querySelector('textarea');
  const boton = form.querySelector('button[type="submit"]');

  if (!boton) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const contenido = textarea.value.trim();
    if (!contenido) {
      mostrarNotificacion('warning', 'Campo vacío', 'Escribe un mensaje antes de enviar.');
      textarea.focus();
      return;
    }

    boton.disabled = true;
    boton.textContent = 'Enviando...';

    try {
      const usuarioId = obtenerUsuarioId();
      
      const respuesta = await fetch(`${URL_SUPABASE}/rest/v1/comentarios`, {
        method: 'POST',
        headers: CABECERAS,
        body: JSON.stringify({
          slug_pagina: 'caja-anonima',
          contenido,
          usuario_id: usuarioId,
          anonimo: true
        })
      });

      if (respuesta.ok) {
        textarea.value = '';
        await cargarMensajesCajaAnonima();
        mostrarNotificacion('success', '¡Mensaje enviado! 💬', 'Tu mensaje se compartió de forma anónima.');
      } else {
        const error = await respuesta.text();
        console.error('Error:', error);
        mostrarNotificacion('error', 'Error al enviar', 'Intenta de nuevo en unos momentos.');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      mostrarNotificacion('error', 'Error de conexión', 'Verifica tu conexión a internet.');
    }

    boton.disabled = false;
    boton.textContent = 'Enviar Comentario';
  });
}

// =============================================
// RETO SEMANAL (con botón type="button")
// =============================================

async function cargarMensajesReto() {
  try {
    const respuesta = await fetch(
      `${URL_SUPABASE}/rest/v1/comentarios?slug_pagina=eq.reto-semanal&order=creado_en.desc&limit=10`,
      { headers: CABECERAS }
    );
    const mensajes = await respuesta.json();
    const container = document.getElementById('challenge-feedback-container');
    
    if (!container) return;
    
    if (!mensajes.length) {
      container.innerHTML = '<p class="sin-mensajes">Aún no hay reflexiones. ¡Comparte la tuya!</p>';
      return;
    }

    container.innerHTML = mensajes.map(m => `
      <div class="challenge-feedback-card">
        <p>${escaparHtml(m.contenido)}</p>
        <span class="fecha">${formatearFecha(m.creado_en)}</span>
      </div>
    `).join('');
  } catch (error) {
    console.error('❌ Error al cargar reflexiones:', error);
    mostrarNotificacion('error', 'Error al cargar', 'No se pudieron cargar las reflexiones.');
  }
}

function setupFormularioReto() {
  const form = document.getElementById('challenge-form');
  if (!form) return;

  const textarea = form.querySelector('textarea');
  const boton = document.getElementById('btn-enviar-reto');
  if (!boton) return;

  boton.addEventListener('click', async function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const contenido = textarea.value.trim();
    if (!contenido) {
      mostrarNotificacion('warning', 'Campo vacío', 'Comparte tu experiencia del reto.');
      textarea.focus();
      return;
    }

    boton.disabled = true;
    boton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      const usuarioId = obtenerUsuarioId();
      
      const respuesta = await fetch(`${URL_SUPABASE}/rest/v1/comentarios`, {
        method: 'POST',
        headers: CABECERAS,
        body: JSON.stringify({
          slug_pagina: 'reto-semanal',
          contenido,
          usuario_id: usuarioId,
          anonimo: true
        })
      });

      if (respuesta.ok) {
        textarea.value = '';
        await cargarMensajesReto();
        mostrarNotificacion('success', '¡Experiencia compartida! 🌱', 'Gracias por compartir tu reflexión del reto semanal.');
      } else {
        const error = await respuesta.text();
        console.error('Error:', error);
        mostrarNotificacion('error', 'Error al enviar', 'Intenta de nuevo en unos momentos.');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      mostrarNotificacion('error', 'Error de conexión', 'Verifica tu conexión a internet.');
    }

    boton.disabled = false;
    boton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar experiencia';
  });
}

// =============================================
// INICIALIZACIÓN
// =============================================
function initApp() {
    console.log('🚀 Iniciando Caja Anónima...');

    // Verificar que exista el contenedor de notificaciones
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    const container = document.getElementById('publicaciones-container');
    if (!container) {
        console.warn('⚠️ No se encontró el contenedor de publicaciones');
        return;
    }

    // Inicializar todas las secciones
    setupFiltros();
    setupJuegos();
    cargarPublicaciones();
    publicarNuevaPublicacion();

    // Caja Anónima original
    if (document.getElementById('messages-container')) {
        cargarMensajesCajaAnonima();
        setupFormularioAnonimo();
    }

    // Reto Semanal
    if (document.getElementById('challenge-feedback-container')) {
        cargarMensajesReto();
        setupFormularioReto();
    }

    console.log('✅ Caja Anónima inicializada correctamente');
}

// =============================================
// EJECUTAR CUANDO EL DOM ESTÉ LISTO
// =============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// =============================================
// EXPORTAR FUNCIONES
// =============================================
window.publicarComentario = publicarComentario;
window.toggleLike = toggleLike;
window.cargarPublicaciones = cargarPublicaciones;
window.cargarComentarios = cargarComentarios;
window.mostrarNotificacion = mostrarNotificacion;
window.cerrarNotificacion = cerrarNotificacion;
window.limpiarNotificaciones = limpiarNotificaciones;
window.cargarMensajesCajaAnonima = cargarMensajesCajaAnonima;
window.cargarMensajesReto = cargarMensajesReto;