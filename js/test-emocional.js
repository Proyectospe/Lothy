// =============================================
// TESTS EMOCIONALES - DATOS ESTÁTICOS
// =============================================

const TESTS_DATA = {
    ansiedad: {
        id: 'ansiedad',
        nombre: 'Test de Ansiedad',
        icono: '😰',
        preguntas: [
            '¿Has sentido nerviosismo o inquietud frecuentemente?',
            '¿Te has sentido preocupado o angustiado sin motivo aparente?',
            '¿Has tenido dificultades para relajarte o estar tranquilo?',
            '¿Has sentido miedo o pánico de forma repentina?',
            '¿Has evitado situaciones que te generan ansiedad?',
            '¿Has tenido problemas para conciliar el sueño por preocupaciones?',
            '¿Has sentido tensión muscular o dolores de cabeza?',
            '¿Has tenido dificultades para concentrarte?',
            '¿Has sentido que algo malo va a pasar?',
            '¿Has sentido que pierdes el control de tus emociones?'
        ],
        recomendaciones: {
            normal: 'Sigue cuidando tu bienestar emocional con hábitos saludables.',
            leve: 'Practica técnicas de respiración y mindfulness para reducir la ansiedad.',
            moderado: 'Considera hablar con un profesional y practicar ejercicio regular.',
            severo: 'Te recomendamos buscar ayuda profesional lo antes posible.'
        }
    },
    estres: {
        id: 'estres',
        nombre: 'Test de Estrés',
        icono: '😩',
        preguntas: [
            '¿Te sientes abrumado por tus responsabilidades diarias?',
            '¿Tienes dificultades para desconectar del trabajo o estudios?',
            '¿Te sientes irritable o de mal humor con frecuencia?',
            '¿Has notado cambios en tu apetito (comer más o menos)?',
            '¿Sientes fatiga o cansancio constante?',
            '¿Tienes dolores de cabeza o musculares frecuentes?',
            '¿Te cuesta mantener la concentración en tus tareas?',
            '¿Sientes que no tienes tiempo para ti mismo?',
            '¿Has perdido el interés en actividades que antes disfrutabas?',
            '¿Sientes que no puedes hacer frente a tus problemas?'
        ],
        recomendaciones: {
            normal: 'Mantén un equilibrio saludable entre trabajo y descanso.',
            leve: 'Incorpora pausas activas y ejercicio en tu rutina diaria.',
            moderado: 'Establece límites saludables y busca apoyo social.',
            severo: 'Considera reducir tu carga de trabajo y buscar ayuda profesional.'
        }
    },
    autoestima: {
        id: 'autoestima',
        nombre: 'Test de Autoestima',
        icono: '💪',
        preguntas: [
            '¿Te sientes satisfecho con quien eres?',
            '¿Aceptas tus defectos y virtudes?',
            '¿Te valoras y te respetas a ti mismo?',
            '¿Crees en tus capacidades y habilidades?',
            '¿Te sientes orgulloso de tus logros?',
            '¿Te comparas constantemente con los demás?',
            '¿Crees que mereces ser feliz?',
            '¿Te resulta difícil recibir cumplidos?',
            '¿Te sientes seguro al tomar decisiones?',
            '¿Te tratas con amabilidad cuando cometes errores?'
        ],
        recomendaciones: {
            normal: 'Sigue cultivando tu autoestima y confianza en ti mismo.',
            leve: 'Practica el autocuidado y celebra tus logros, por pequeños que sean.',
            moderado: 'Trabaja en tus pensamientos negativos y busca actividades que te hagan sentir bien.',
            severo: 'Considera trabajar con un profesional para fortalecer tu autoestima.'
        }
    },
    depresion: {
        id: 'depresion',
        nombre: 'Test de Depresión',
        icono: '😔',
        preguntas: [
            '¿Te sientes triste o vacío la mayor parte del tiempo?',
            '¿Has perdido interés en actividades que antes disfrutabas?',
            '¿Tienes dificultades para dormir (insomnio o hipersomnia)?',
            '¿Sientes fatiga o falta de energía constantemente?',
            '¿Has notado cambios significativos en tu peso?',
            '¿Te sientes inútil o con baja autoestima?',
            '¿Tienes dificultades para concentrarte o tomar decisiones?',
            '¿Has pensado en la muerte o en hacerte daño?',
            '¿Sientes que no hay esperanza para mejorar?',
            '¿Te sientes desconectado de los demás?'
        ],
        recomendaciones: {
            normal: 'Mantén tus hábitos saludables y redes de apoyo.',
            leve: 'Intenta mantener una rutina y busca actividades que te den satisfacción.',
            moderado: 'Considera hablar con un profesional y practicar ejercicio regular.',
            severo: 'ES IMPORTANTE: Busca ayuda profesional inmediata.'
        }
    }
};

// =============================================
// ESTADO GLOBAL
// =============================================
let testActual = null;
let respuestasUsuario = [];
let preguntaIndex = 0;

// =============================================
// INICIAR TEST
// =============================================
function iniciarTest(testId) {
    testActual = TESTS_DATA[testId];
    if (!testActual) {
        alert('Test no encontrado');
        return;
    }

    respuestasUsuario = new Array(testActual.preguntas.length).fill(null);
    preguntaIndex = 0;

    // Mostrar modal
    const modal = document.getElementById('test-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Actualizar UI
    document.getElementById('total-preguntas').textContent = testActual.preguntas.length;
    actualizarContadorPreguntas();
    mostrarPregunta();
}

// =============================================
// MOSTRAR PREGUNTA
// =============================================
function mostrarPregunta() {
    const container = document.getElementById('test-container');
    const pregunta = testActual.preguntas[preguntaIndex];
    const total = testActual.preguntas.length;
    const esUltima = preguntaIndex === total - 1;
    const esPrimera = preguntaIndex === 0;

    // Actualizar progreso
    document.getElementById('pregunta-actual').textContent = preguntaIndex + 1;
    document.getElementById('progress-fill').style.width = `${((preguntaIndex + 1) / total) * 100}%`;

    // Botones
    document.getElementById('btn-anterior').style.display = esPrimera ? 'none' : 'inline-flex';
    document.getElementById('btn-siguiente').style.display = esUltima ? 'none' : 'inline-flex';
    document.getElementById('btn-enviar').style.display = esUltima ? 'inline-flex' : 'none';

    const respuestaGuardada = respuestasUsuario[preguntaIndex];

    let html = `
        <div class="pregunta-container">
            <div class="pregunta-numero">Pregunta ${preguntaIndex + 1} de ${total}</div>
            <div class="pregunta-texto">${pregunta}</div>
            <div class="escala-container">
    `;

    const labels = ['Muy bajo', 'Bajo', 'Medio', 'Alto', 'Muy alto'];
    for (let i = 1; i <= 5; i++) {
        html += `
            <button class="escala-btn ${respuestaGuardada === i ? 'seleccionada' : ''}" 
                    onclick="seleccionarEscala(${i})">
                ${i}
                <span class="escala-label">${labels[i-1]}</span>
            </button>
        `;
    }

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Scroll al inicio del modal
    document.querySelector('.test-modal .modal-content').scrollTop = 0;
}

// =============================================
// SELECCIONAR ESCALA
// =============================================
function seleccionarEscala(valor) {
    respuestasUsuario[preguntaIndex] = valor;

    // Actualizar visualmente
    const botones = document.querySelectorAll('.escala-btn');
    botones.forEach((btn, index) => {
        btn.classList.toggle('seleccionada', (index + 1) === valor);
    });

    // Si no es la última, avanzar automáticamente
    if (preguntaIndex < testActual.preguntas.length - 1) {
        setTimeout(() => preguntaSiguiente(), 300);
    }
}

// =============================================
// NAVEGACIÓN
// =============================================
function preguntaSiguiente() {
    if (preguntaIndex < testActual.preguntas.length - 1) {
        // Verificar que la pregunta actual tenga respuesta
        if (respuestasUsuario[preguntaIndex] === null) {
            alert('Por favor, selecciona una respuesta antes de continuar.');
            return;
        }
        preguntaIndex++;
        mostrarPregunta();
    }
}

function preguntaAnterior() {
    if (preguntaIndex > 0) {
        preguntaIndex--;
        mostrarPregunta();
    }
}

function actualizarContadorPreguntas() {
    // Ya se actualiza en mostrarPregunta
}

// =============================================
// ENVIAR TEST
// =============================================
function enviarTest() {
    // Verificar que todas las preguntas tengan respuesta
    const respuestasFaltantes = respuestasUsuario.some(r => r === null);
    if (respuestasFaltantes) {
        alert('Por favor, responde todas las preguntas antes de ver tus resultados.');
        return;
    }

    // Calcular puntaje
    const puntajeTotal = respuestasUsuario.reduce((a, b) => a + b, 0);
    const maxPuntaje = testActual.preguntas.length * 5;
    const porcentaje = Math.round((puntajeTotal / maxPuntaje) * 100);

    // Determinar nivel
    let nivel, nivelClase;
    if (porcentaje <= 30) {
        nivel = 'Normal';
        nivelClase = 'nivel-normal';
    } else if (porcentaje <= 50) {
        nivel = 'Leve';
        nivelClase = 'nivel-leve';
    } else if (porcentaje <= 70) {
        nivel = 'Moderado';
        nivelClase = 'nivel-moderado';
    } else {
        nivel = 'Severo';
        nivelClase = 'nivel-severo';
    }

    // Obtener recomendación
    const recomendacion = testActual.recomendaciones[nivel.toLowerCase()] || 'Cuida tu bienestar emocional.';

    // Cerrar modal de test
    cerrarTest();

    // Mostrar resultados
    mostrarResultados(puntajeTotal, maxPuntaje, porcentaje, nivel, nivelClase, recomendacion);
}

// =============================================
// MOSTRAR RESULTADOS
// =============================================
function mostrarResultados(puntaje, maxPuntaje, porcentaje, nivel, nivelClase, recomendacion) {
    const modal = document.getElementById('resultados-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    document.getElementById('resultado-test-nombre').textContent = testActual.nombre;

    document.getElementById('resultado-puntaje').innerHTML = `
        ${porcentaje}%
        <span>(${puntaje} / ${maxPuntaje})</span>
    `;

    document.getElementById('resultado-nivel').innerHTML = `
        <span class="${nivelClase}">${nivel}</span>
    `;

    document.getElementById('resultado-recomendacion').innerHTML = `
        <h4>📝 Recomendación</h4>
        <p>${recomendacion}</p>
    `;

    // Detalles por pregunta
    let detallesHtml = '<h4 style="margin-bottom: 0.5rem;">📊 Detalle de respuestas</h4>';
    testActual.preguntas.forEach((pregunta, index) => {
        const valor = respuestasUsuario[index];
        const labels = ['Muy bajo', 'Bajo', 'Medio', 'Alto', 'Muy alto'];
        detallesHtml += `
            <div class="detalle-item">
                <span class="detalle-pregunta">${index + 1}. ${pregunta.substring(0, 40)}${pregunta.length > 40 ? '...' : ''}</span>
                <span class="detalle-respuesta">${valor} - ${labels[valor-1]}</span>
            </div>
        `;
    });

    document.getElementById('resultado-detalles').innerHTML = detallesHtml;

    // Guardar en historial local
    guardarHistorial(testActual.nombre, porcentaje, nivel);
}

// =============================================
// HISTORIAL LOCAL
// =============================================
function guardarHistorial(nombreTest, porcentaje, nivel) {
    const historial = JSON.parse(localStorage.getItem('lothy_historial_tests') || '[]');
    historial.unshift({
        test: nombreTest,
        porcentaje: porcentaje,
        nivel: nivel,
        fecha: new Date().toISOString()
    });
    // Mantener solo los últimos 10
    if (historial.length > 10) historial.pop();
    localStorage.setItem('lothy_historial_tests', JSON.stringify(historial));
}

// =============================================
// COMPARTIR RESULTADO
// =============================================
function compartirResultado() {
    const texto = `📊 Acabo de realizar el "${testActual.nombre}" en Lothy.\nMi nivel es: ${document.querySelector('.resultado-nivel span').textContent}\n¡Conocerse es el primer paso para mejorar! 🧠💪`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mi resultado en Lothy',
            text: texto,
        }).catch(() => {});
    } else {
        // Copiar al portapapeles
        navigator.clipboard.writeText(texto).then(() => {
            alert('✅ Resultado copiado al portapapeles. ¡Compártelo en la comunidad!');
        }).catch(() => {
            alert('📋 Copia este texto:\n\n' + texto);
        });
    }
}

// =============================================
// CERRAR MODALES
// =============================================
function cerrarTest() {
    document.getElementById('test-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function cerrarResultados() {
    document.getElementById('resultados-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧠 Test Emocional cargado correctamente');
});