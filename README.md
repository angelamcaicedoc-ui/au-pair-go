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
