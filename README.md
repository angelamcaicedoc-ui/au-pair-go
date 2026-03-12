# Au Pair Go — MVP

**Au Pair Go** es una aplicación web con IA diseñada para centralizar, organizar y resolver las necesidades prácticas de las au pairs hispanohablantes en EE.UU.

## Stack tecnológico

- **Next.js 15** (App Router)
- **React + TypeScript**
- **Tailwind CSS** (UI responsive y mobile-first)
- **Google Gemini AI** (via `@google/generative-ai`)
- **localStorage** (datos del perfil e historial de chat)

## Funcionalidades del MVP

- 🧒 **Cuidado de Niños** — rutinas, actividades, seguridad y tips
- 🚗 **DMV y Manejo** — licencia de conducir, trámites y reglas de tránsito
- 🌟 **Programa Au Pair** — derechos, obligaciones, rematch, visa J-1
- 💬 **Chat IA por sección** con prompts especializados por área
- 👤 **Perfil editable** guardado en localStorage (sin auth)
- 📊 **Contador de mensajes gratuitos** (30 gratis)
- 📍 **Recomendaciones por ubicación** (geolocalización o ciudad/zip)
- 🛡️ **Guardrails de seguridad** (no consejo médico/legal, derivación al 911)

## Estructura de carpetas

```
/app
  /api/chat/route.ts          ← Endpoint backend (Gemini AI)
  /sections/[sectionId]/page.tsx ← Páginas dinámicas por sección
  layout.tsx                  ← Layout principal
  page.tsx                    ← Pantalla de inicio

/components
  Chat.tsx                    ← Chat IA con historial
  Profile.tsx                 ← Perfil editable en localStorage
  MessageCounter.tsx          ← Contador de mensajes gratuitos
  SectionClient.tsx           ← Wrapper cliente para páginas de sección

/content/sections/
  toddler-kids-care.md        ← Guía de cuidado de niños
  dmv-driving.md              ← Guía DMV y manejo
  au-pair-program.md          ← Guía programa au pair

/lib
  /prompts/
    toddler-kids-care.ts      ← System prompt para cuidado de niños
    dmv-driving.ts            ← System prompt para DMV
    au-pair-program.ts        ← System prompt para programa au pair
  /sections/sections.ts       ← Definición y lista de secciones
  chatUtils.ts                ← Utilidades: localStorage, perfil, contador
  contentLoader.ts            ← Carga archivos Markdown de contenido

/__tests__/                   ← Tests básicos
.env.local.example            ← Variables de entorno de ejemplo
```

## Configuración inicial

### 1. Obtén tu API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/apikey)
2. Crea o copia tu API Key
3. Es **gratuita** para uso personal (con límites)

### 2. Configura las variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y reemplaza `TU_CLAVE_AQUI` con tu API Key real:

```
GEMINI_API_KEY=AIzaSy...tu-clave-real
GEMINI_MODEL=gemini-1.5-flash
```

### 3. Instala dependencias y ejecuta

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Agregar una nueva sección

1. **Crea el contenido** en `content/sections/nueva-seccion.md`
2. **Crea el prompt IA** en `lib/prompts/nueva-seccion.ts` (exporta `systemPrompt`)
3. **Agrega la entrada** en `lib/sections/sections.ts`:
   ```typescript
   {
     id: "nueva-seccion",
     label: "Nueva Sección",
     description: "Descripción breve",
     icon: "🆕",
     available: true,
   }
   ```
4. **Importa el prompt** en `app/api/chat/route.ts` y agrégalo al mapa `SECTION_PROMPTS`
5. ¡Listo! La sección aparece automáticamente en el inicio.

## Tests

```bash
npm test
```

Los tests básicos están en `/__tests__/`.

## Guardrails de IA

La IA tiene restricciones programadas:
- **No da consejos médicos**: redirige al pediatra
- **No da consejos legales**: redirige a la agencia o abogado
- **Emergencias**: siempre indica llamar al **911**
- **Tono**: cálido, claro y empoderador
- **Idioma**: siempre en español (con frases útiles en inglés cuando aplica)

## Despliegue en Vercel

1. Conecta tu repo en [vercel.com](https://vercel.com)
2. Agrega las variables de entorno en el panel de Vercel
3. ¡Deploy automático!

## Notas

- Los datos del perfil y el historial de chat se guardan **solo en el navegador del usuario** (localStorage)
- El contador de mensajes gratuitos se reinicia si el usuario borra los datos del navegador
- No se requiere base de datos ni autenticación para el MVP
