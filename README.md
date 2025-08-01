# 🧠 Psy WebApp

Aplicación web moderna para agendar sesiones psicológicas, construida con Next.js 15, React 19, TypeScript y Tailwind CSS.

## 🚀 Configuración Rápida

### Prerrequisitos

- Node.js 18+ 
- npm
- Backend corriendo en puerto 5000

### Instalación

1. **Instalar dependencias:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configurar variables de entorno:**
   ```bash
   # Crear archivo .env.local
   cp env.example .env.local
   ```

3. **Verificar configuración del backend:**
   - El backend debe estar corriendo en `http://localhost:5000`
   - Si el backend usa otro puerto, actualizar `NEXT_PUBLIC_API_URL` en `.env.local`

### Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Arquitectura

### Stack Tecnológico

- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconos

### Estructura del Proyecto

```
psy-webapp/
├── app/                    # App Router de Next.js
│   ├── page.tsx           # Página principal
│   ├── my-sessions/       # Mis sesiones
│   ├── therapist/[id]/    # Perfil del terapeuta
│   └── session/           # Páginas de sesión
├── components/            # Componentes reutilizables
│   └── ui/               # Componentes de UI
├── hooks/                # Hooks personalizados
├── lib/                  # Utilidades y tipos
└── public/              # Archivos estáticos
```

## 🔌 Integración con Backend

### API Client

El proyecto incluye un cliente HTTP moderno en `lib/api-client.ts` que maneja:

- ✅ Peticiones HTTP con fetch
- ✅ Manejo de errores centralizado
- ✅ Headers automáticos
- ✅ Idempotencia para sesiones
- ✅ Tipado TypeScript completo

### Hooks de React

Hooks personalizados en `hooks/use-api.ts`:

- `useTopics()` - Cargar temas disponibles
- `useTherapists(params)` - Buscar terapeutas con filtros
- `useTherapist(id)` - Obtener terapeuta específico
- `useTherapistSessionTypes(id)` - Tipos de sesión del terapeuta
- `useTherapistAvailability(id, params)` - Disponibilidad del terapeuta
- `useCreateSession()` - Crear nueva sesión
- `useSession(id)` - Obtener detalles de sesión
- `useCancelSession()` - Cancelar sesión

### Estados de Carga

Componentes reutilizables para manejar estados:

- `LoadingPage` - Página completa de carga
- `Loading` - Spinner con texto opcional
- `ErrorPage` - Página de error con retry
- `Error` - Componente de error inline

## 🎨 Componentes UI

### Sistema de Diseño

- **Colores:** Paleta emerald/teal/cyan
- **Tipografía:** Sistema de fuentes escalable
- **Espaciado:** Sistema de espaciado consistente
- **Responsive:** Mobile-first design

### Componentes Principales

- `Button` - Botones con variantes
- `Card` - Contenedores de contenido
- `Badge` - Etiquetas y estados
- `Dialog` - Modales y overlays
- `Input` - Campos de formulario

## 🔄 Flujo de Usuario

1. **Página Principal** - Selección de temas y modalidad
2. **Búsqueda** - Filtrado de terapeutas por criterios
3. **Perfil Terapeuta** - Información y tipos de sesión
4. **Disponibilidad** - Calendario de horarios disponibles
5. **Confirmación** - Datos del paciente y confirmación
6. **Mis Sesiones** - Gestión de sesiones agendadas

## 📱 Características

- ✅ **Responsive Design** - Optimizado para móviles
- ✅ **Accesibilidad** - Componentes accesibles
- ✅ **Performance** - Optimizado con Next.js
- ✅ **TypeScript** - Tipado completo
- ✅ **Error Handling** - Manejo robusto de errores
- ✅ **Loading States** - Estados de carga elegantes
- ✅ **API Integration** - Integración completa con backend

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
```

### Variables de Entorno

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Environment
NODE_ENV=development
```

### Estructura de Tipos

Los tipos TypeScript están definidos en `lib/types.ts`:

- `Topic` - Temas de terapia
- `Therapist` - Información del terapeuta
- `SessionType` - Tipos de sesión
- `Session` - Datos de sesión
- `AvailabilitySlot` - Horarios disponibles

## 🚨 Solución de Problemas

### Error de Dependencias

Si hay conflictos con React 19:

```bash
npm install --legacy-peer-deps
```

### Backend No Disponible

Verificar que el backend esté corriendo:

```bash
# En el directorio del backend
npm run start:dev
```

### Variables de Entorno

Asegurarse de que `.env.local` esté configurado:

```bash
cp env.example .env.local
# Editar .env.local con la URL correcta del backend
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autor

- **Lucas Della Sala** - [@lucasdellasala](https://github.com/lucasdellasala)
