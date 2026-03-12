copilot/au-pair-go-mvp-structure
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
=======
# Au Pair Go ✨

Aplicación web con IA diseñada para centralizar, organizar y resolver las necesidades prácticas de las au pairs hispanohablantes en EE.UU.

## Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **IA:** Google Gemini (via `@google/generative-ai`)
- **Almacenamiento:** `localStorage` (sin auth, MVP)
- **Testing:** Jest + React Testing Library

## Cómo ejecutar

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd au-pair-go-1
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y agrega tu API key de Gemini:
```
GEMINI_API_KEY=tu_api_key_aqui
GEMINI_MODEL=gemini-1.5-flash
```

Obtén tu clave en [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Correr en desarrollo

```bash
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000).

### 4. Ejecutar tests

```bash
npm test
```

### 5. Build para producción

```bash
npm run build
npm start
```

## Estructura del proyecto

```
au-pair-go-1/
├── app/
│   ├── api/chat/route.ts          # Endpoint POST que conecta con Gemini
│   ├── sections/[sectionId]/      # Página dinámica por sección
│   ├── profile/                   # Página de perfil de usuario
│   ├── layout.tsx                 # Layout principal con nav
│   └── page.tsx                   # Página principal (home)
├── components/
│   ├── Chat.tsx                   # Componente de chat con IA
│   ├── Profile.tsx                # Formulario de perfil
│   ├── FreemiumCounter.tsx        # Contador de mensajes gratuitos
│   ├── LocationRecommendations.tsx # Recomendaciones por ubicación
│   ├── SectionCard.tsx            # Tarjeta de sección (home)
│   └── SectionContent.tsx         # Contenido/guía de cada sección
├── lib/
│   ├── sections/sections.ts       # Definición de secciones
│   ├── prompts/
│   │   ├── prompts.ts             # System prompts por sección
│   │   └── index.ts               # Selector de prompt
│   ├── profile.ts                 # Tipos y helpers de perfil
│   ├── chat.ts                    # Helpers de localStorage para chat
│   └── validation.ts              # Validación de mensajes
├── content/sections/
│   ├── toddler.ts                 # Contenido: cuidado infantil
│   ├── dmv.ts                     # Contenido: DMV y conducción
│   ├── aupair.ts                  # Contenido: programa au pair
│   └── index.ts                   # Selector de contenido
├── __tests__/                     # Tests
└── .env.local.example             # Ejemplo de variables de entorno
```

## Secciones disponibles

| Sección | ID | Estado |
|---------|-----|--------|
| Cuidado de Niños | `toddler` | ✅ Disponible |
| DMV & Conducción | `dmv` | ✅ Disponible |
| Programa Au Pair | `aupair` | ✅ Disponible |
| Vida Diaria | `vida-diaria` | 🔜 Próximamente |
| Cultura & Adaptación | `cultura` | 🔜 Próximamente |
| Recomendaciones | `recomendaciones` | 🔜 Próximamente |

## Agregar una nueva sección

1. **Registrar la sección** en `lib/sections/sections.ts`:
   ```ts
   {
     id: "mi-seccion",
     title: "Mi Sección",
     description: "Descripción de la sección",
     icon: "🎯",
     available: true,
     color: "bg-teal-50 border-teal-200",
   }
   ```

2. **Crear el system prompt** en `lib/prompts/prompts.ts`:
   ```ts
   export const miSeccionPrompt = `Eres "Au Pair Go - Experta en Mi Sección"...`;
   ```

3. **Registrar el prompt** en `lib/prompts/index.ts`:
   ```ts
   const promptMap = {
     "mi-seccion": miSeccionPrompt,
     // ...
   };
   ```

4. **Crear el contenido** en `content/sections/mi-seccion.ts`:
   ```ts
   export const miSeccionContent = `## Título\n...`;
   ```

5. **Registrar el contenido** en `content/sections/index.ts`.

## Funcionalidades MVP

- ✅ Chat IA por sección con historial (últimos 10 msgs, en localStorage)
- ✅ Perfil de usuario editable (guardado en localStorage)
- ✅ Freemium: 30 mensajes gratuitos, contador visual
- ✅ Recomendaciones de lugares (geolocalización o perfil)
- ✅ Guardrails IA: sin consejos médicos/legales, "llama al 911" en emergencias
- ✅ Todo en español, accesible desde móvil
- ✅ 3 secciones completas: Toddler, DMV, Au Pair
- ✅ Guías y checklists por sección

## Variables de entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `GEMINI_API_KEY` | API Key de Google Gemini | ✅ Sí |
| `GEMINI_MODEL` | Modelo de Gemini a usar | No (default: `gemini-1.5-flash`) |

## Notas importantes

- El API key **nunca** debe exponerse en el frontend. Solo se usa en el server-side (`app/api/chat/route.ts`).
- Los datos de perfil e historial de chat se guardan en `localStorage` del navegador.
- El contador freemium se reinicia si el usuario borra el localStorage/cookies (comportamiento esperado en MVP).
 main
