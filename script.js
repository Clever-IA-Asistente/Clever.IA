lucide.createIcons();
// ==========================================================
// CONFIGURACIÓN
// ==========================================================
// Clave de API proporcionada por el usuario, integrada para la conexión al servicio.
const GEMINI_API_KEY = "AIzaSyDLv0JrV87YPPx6E9ZcWz_cj0eCz32cfOA";
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=';
const ASSISTANT_IMAGE_URL = "IMG_20251031_170524.png";

const USER_PLACEHOLDER_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-white">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
</svg>`;
// Referencias del DOM
const chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
let typingIndicatorElement = null;

/** Genera el HTML para la imagen de perfil del Asistente. */
function getAssistantProfileHTML() {
    return `
        <img
            class="profile-pic"
            src="${ASSISTANT_IMAGE_URL}"
            onerror="this.onerror=null; this.src='https://placehold.co/40x40/334155/ffffff?text=AI'"
            alt="Asistente IA"
        >
    `;
}
/** Genera el HTML para el perfil del Usuario. */
function getUserProfileHTML() {
    return `
        <div class="user-profile-pic flex items-center justify-center">
            ${USER_PLACEHOLDER_ICON}
        </div>
    `;
}
/** Agrega un nuevo mensaje al historial de chat. */
function addMessage(message, sender) {
    const messageWrapper = document.createElement('div');
   
    if (sender === 'user') {
        messageWrapper.className = `user-bubble-container`;
        const bubbleContent = `<p>${message}</p>`;
        messageWrapper.innerHTML = `
            <div class="user-bubble max-w-[80%] md:max-w-[70%] p-3 rounded-xl text-gray-100 shadow-xl text-base">
                ${bubbleContent}
            </div>
            ${getUserProfileHTML()}
        `;
    } else {
        messageWrapper.className = `assistant-bubble-container`;
        const bubbleContent = `
            <p class="text-sm font-semibold text-sky-300 mb-1">Clever.IA</p>
            <p class="text-base">${message}</p>
        `;
        messageWrapper.innerHTML = `
            ${getAssistantProfileHTML()}
            <div class="assistant-bubble max-w-[80%] md:max-w-[70%] p-3 rounded-xl text-gray-100 shadow-md">
                ${bubbleContent}
            </div>
        `;
    }
    chatLog.appendChild(messageWrapper);
    scrollToBottom();
}
/** Muestra la animación de "Escribiendo...". */
function showTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.className = 'assistant-bubble-container';
    wrapper.id = 'typing-indicator';
   
    const bubbleContent = `
        <p class="text-sm font-semibold text-sky-300 mb-1">Clever.IA</p>
        <div class="typing-indicator flex items-center space-x-1">
            <span></span><span></span><span></span>
        </div>
    `;
    wrapper.innerHTML = `
        ${getAssistantProfileHTML()}
        <div class="assistant-bubble max-w-[80%] md:max-w-[70%] p-3 rounded-xl text-gray-100 shadow-md">
            ${bubbleContent}
        </div>
    `;
    chatLog.appendChild(wrapper);
    typingIndicatorElement = wrapper;
    scrollToBottom();
    return wrapper;
}
/** Elimina la animación de "Escribiendo...". */
function removeTypingIndicator() {
    if (typingIndicatorElement) {
        typingIndicatorElement.remove();
        typingIndicatorElement = null;
    }
}
/** Asegura el scroll al final del chat. */
function scrollToBottom() {
    setTimeout(() => {
        chatLog.scrollTop = chatLog.scrollHeight;
    }, 50);
}
/** Procesa la consulta del usuario y llama a la API de Gemini. */
async function handleGeminiResponse(userText) {
   
    showTypingIndicator();
    sendButton.disabled = true;
    // Definición de la Personalidad y Contexto del Asistente
    const systemPrompt = `Eres un asistente virtual web llamado "Clever.IA", diseñado específicamente para la Escuela Básica Nacional Santa Rita, ubicada en la Avenida 3, Urbanización Viviendas Venezolanas, Sector El Caño, Parroquia Santa Rita, Municipio Santa Rita, Estado Zulia, Venezuela. Tu propósito principal es proporcionar atención automatizada a representantes (padres, tutores o familiares de estudiantes), respondiendo de manera rápida, precisa y amable a consultas sobre la escuela. Ayudas a optimizar el proceso de información, reduciendo la necesidad de visitas presenciales y ahorrando tiempo tanto para los representantes como para el personal administrativo.
Contexto de la Escuela:
La Escuela Básica Nacional Santa Rita es una institución educativa pública de dependencia nacional, financiada por el gobierno venezolano, que ofrece educación básica gratuita para promover la igualdad de oportunidades.
Es uno de los colegios con mayor matrícula escolar en el municipio, lo que genera alta demanda de información.
Ubicación geográfica: Limita al norte con Calle Las Brisas, al sur con Av. 2B Santa Rita, al este con Callejón Perozo, y al oeste con Calle E San Benito.
Reseña histórica breve: El sector Viviendas Venezolanas fue fundado en 1959 durante el gobierno de Rómulo Betancourt y completado en 1966 bajo Raúl Leoni. El municipio Santa Rita fue fundado en 1790 y se convirtió en autónomo en 1989, con una rica herencia indígena arawak y colonial.
Temas que puedes manejar:
Disponibilidad de cupos: Informa sobre vacantes por grado, pero siempre recomienda contactar a la secretaría para confirmación oficial.
Requisitos para inscripción: Lista documentos necesarios (ej. partida de nacimiento, cédula del representante, notas anteriores, etc.), pero aclara que los requisitos pueden variar y se deben verificar en persona.
Horarios de clases: Proporciona horarios generales (ej. turno matutino de 7:00 AM a 12:00 PM, vespertino de 1:00 PM a 5:00 PM), adaptados a la educación básica.
Útiles escolares: Sugiere listas básicas por grado (cuadernos, lápices, libros de texto proporcionados por el gobierno, etc.), enfatizando materiales reutilizables y económicos.
Áreas de aprendizaje: Describe las materias principales (matemáticas, lenguaje, ciencias, educación física, etc.) y cualquier programa especial si aplica.
Otras consultas comunes: Información general sobre la escuela (misión: proporcionar educación integral; visión: formar ciudadanos responsables; valores: igualdad, respeto, solidaridad), eventos escolares, contactos de emergencia, o direcciones a recursos externos como el Ministerio de Educación.
Reglas de interacción:
Siempre responde en español, de forma clara, concisa y cortés. Usa un tono amigable y empático, como si fueras un miembro del personal de la escuela.
Dado que la presentación inicial ya está en la interfaz, para todas las consultas posteriores, <b>ve directamente al grano sin repetir saludos</b> como "¡Hola!", "Buenas tardes" o reintroducciones de tu persona. Manten siempre un tono amable y conciso.
Para asegurar un formato bonito y ordenado, utiliza etiquetas HTML básicas dentro de tu respuesta, como <b> para resaltar, <ul> y <li> para listas, y <br> para saltos de línea.
Si la consulta es sobre algo específico o requiere datos actualizados (ej. cupos disponibles en tiempo real), sugiere contactar directamente a la secretaría al teléfono [inserta número si conocido] o visitar la escuela.
No proporciones información confidencial, como datos personales de estudiantes o docentes. Si la pregunta es sensible, redirige al personal administrativo.
Si no sabes la respuesta o está fuera de tu ámbito (ej. quejas formales, inscripciones definitivas), indica: "Para esta consulta, por favor contacta a la secretaría de la escuela en persona o por teléfono."
Mantén las respuestas <b>breves y directas</b>, priorizando la concisión. Nunca excedas los dos párrafos de longitud (aproximadamente 200 palabras) para facilitar la lectura en web o móvil.
Termina cada respuesta ofreciendo ayuda adicional: "¿En qué más puedo asistirte?"
Actualiza tu conocimiento basado en datos del 2024; si algo ha cambiado, recomienda verificar con fuentes oficiales.
Ejemplo de respuesta (Directo al grano): "Para inscribir a un estudiante en la Escuela Básica Nacional Santa Rita, necesitas:<br><ul><li>Partida de nacimiento original.</li><li>Cédula del representante.</li></li>Foto del niño.</li><li>Notas del año anterior.</li></ul>Recuerda que los cupos son limitados, así que ven pronto. ¿En qué más puedo ayudarte?"`;
    const payload = {
        contents: [{ parts: [{ text: userText }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        }
    };
   
    const url = `${API_ENDPOINT}${GEMINI_API_KEY}`;
   
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Fallo en la respuesta de la API:", errorData);
            const errorMsg = `Error HTTP ${response.status}. Revisa si la clave de acceso es correcta o si hay un problema en el servidor.`;
            throw new Error(errorMsg);
        }
        const result = await response.json();
       
        const assistantResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (assistantResponse) {
            removeTypingIndicator();
            addMessage(assistantResponse, 'assistant');
        } else {
            throw new Error("El motor de IA no pudo generar una respuesta válida. Intenta reformular tu pregunta.");
        }
    } catch (error) {
        console.error("Error crítico en la comunicación con el motor de IA:", error);
        removeTypingIndicator();
        addMessage(`Lo siento, ocurrió un error crítico al intentar contactar al servidor. Por favor, verifica el estado de la API o la configuración. (Detalle: ${error.message})`, 'assistant');
       
    } finally {
        sendButton.disabled = false;
    }
}
/** Manejador de envío del formulario. */
chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const userText = messageInput.value.trim();
    if (userText === '' || sendButton.disabled) return;
    addMessage(userText, 'user');
    messageInput.value = '';
    handleGeminiResponse(userText);
});
