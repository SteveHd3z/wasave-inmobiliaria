# PLAN DE DESARROLLO - Wasave Inmobiliaria Backend (Supabase)

> **Estado del proyecto:** Landing page desarrollada y entregada. Se requiere crear backend en Supabase (plan gratuito) con base de datos, API e integracion con la landing page existente.
> **Stack actual:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.
> **Arquitectura:** Feature-based architecture (`app/features/`, `app/shared/`).
> **Proyecto Supabase:** Ya creado (plan gratuito).

> **IMPORTANTE - Flujo de ejecucion:** Cada tarea se ejecuta de forma independiente. El agente de IA NO debe continuar automaticamente a la siguiente tarea. Debe esperar la indicacion explicita del usuario para proceder con la siguiente tarea. Al finalizar cada tarea, el agente debe presentar un resumen de lo realizado y preguntar al usuario si desea continuar con la siguiente tarea.

---

## ANALISIS DE NORMALIZACION Y DISENO DE BASE DE DATOS

### Justificacion del diseno

El esquema sigue las tres formas normales (1NF, 2NF, 3NF):

- **1NF:** Todas las columnas son atomicas, sin grupos repetitivos.
- **2NF:** Cada tabla tiene una clave primaria unica (UUID) y todos los atributos no clave dependen completamente de la PK.
- **3NF:** No existen dependencias transitivas entre atributos no clave.

### Tablas identificadas y justificacion

| Tabla | Justificacion | Forma Normal |
|---|---|---|
| `owner` | Entidad independiente. Representa al propietario de las propiedades. Datos de contacto y documento de identidad. | 3NF |
| `client` | Entidad independiente. Representa a los clientes interesados en propiedades. Datos de contacto y documento de identidad. | 3NF |
| `property` | Entidad central. Depende de `owner` via FK. Almacena datos core del inmueble con tipo como campo libre. | 3NF |
| `property_media` | Relacion 1:N con `property`. Separada para permitir multiples fotos/video por propiedad sin violar 1NF. | 3NF |
| `property_client` | Tabla pivote para relacion N:M entre `property` y `client`. Permite que multiples clientes esten interesados en multiples propiedades. | 3NF |
| `appointment` | Entidad transaccional. Depende de `client` via FK. Almacena citas/visitas con referencia a la propiedad. | 3NF |

### Requerimientos implicitos identificados

1. **Extension pgcrypto:** Se requiere `CREATE EXTENSION IF NOT EXISTS pgcrypto` para habilitar `gen_random_uuid()` en PostgreSQL/Supabase.
2. **Relacion N:M property-client:** La tabla `property_client` permite rastrear que clientes estan interesados en que propiedades, facilitando el seguimiento comercial.

---

## ARQUITECTURA DE BASE DE DATOS

### Diagrama Relacional

```
┌──────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│      owner       │     │      property         │     │   property_media     │
├──────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ owner_id (PK)    │◄────│ owner_id (FK)        │◄────│ property_id (FK)     │
│ document_id      │     │ property_id (PK)     │     │ media_id (PK)        │
│ name             │     │ title                │     │ file_url             │
│ email            │     │ description          │     │ cover_image          │
│ phone            │     │ area                 │     │ display_order        │
└──────────────────┘     │ base_price           │     │ created_at           │
                         │ sale_price           │     └──────────────────────┘
                         │ address              │
                         │ type                 │
                         └──────────────────────┘
                                    │
                                    │ N:M
                                    ▼
┌──────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│     client       │◄────│   property_client    │     │     appointment      │
├──────────────────┤     ├──────────────────────┤     ├──────────────────────┤
│ client_id (PK)   │     │ property_id (FK, PK) │     │ appointment_id (PK)  │
│ document_id      │     │ client_id (FK, PK)   │     │ visit_date           │
│ name             │     └──────────────────────┘     │ status               │
│ last_name        │                                   │ observations         │
│ email            │                                   │ created_at           │
│ phone            │                                   │ updated_at           │
└──────────────────┘                                   │ client_id (FK)       │
       ▲                                               └──────────────────────┘
       │                                                        │
       └────────────────────────────────────────────────────────┘
```

### Tablas

| Tabla | Descripcion |
|---|---|
| `owner` | Propietarios de las inmuebles. Datos de contacto e identificacion. |
| `client` | Clientes interesados en propiedades. Datos de contacto e identificacion. |
| `property` | Propiedades publicadas por el administrador. Cada propiedad pertenece a un owner. |
| `property_media` | Fotografias y videos asociados a cada propiedad. |
| `property_client` | Relacion N:M entre propiedades y clientes (interes/favoritos). |
| `appointment` | Citas/visitas agendadas por los clientes. |

### Procedimientos Almacenados / Funciones

| Funcion | Descripcion |
|---|---|
| `get_available_slots(p_property_id, p_date)` | Retorna horarios disponibles para una fecha y propiedad especifica |
| `validate_appointment(p_client_id, p_date)` | Valida que no exista una cita duplicada en fecha/cliente |
| `get_appointments_by_property(p_property_id)` | Retorna todas las citas de una propiedad |
| `get_appointments_summary()` | Resumen de citas para el panel del administrador |

---

## FASE 1: CONFIGURACION INICIAL Y SEGURIDAD BASE.

### Tarea 1.1 - Configurar variables de entorno y cliente Supabase   OK

**Prompt para el agente de IA:**

```
TAREA 1.1: Configurar integracion con Supabase en el proyecto Next.js existente.

CONTEXTO:
- Proyecto Next.js 16 con App Router en C:\Users\edisson.hernandez\Documents\Wasave\wasave-inmobiliaria
- Ya existe un proyecto en Supabase (plan gratuito)
- El proyecto usa TypeScript, Tailwind CSS v4, y feature-based architecture
- Path aliases: @/* -> root, @features/* -> ./app/features/*, @shared/* -> ./app/shared/*
- NO existe ninguna configuracion previa de Supabase ni variables de entorno

INSTRUCCIONES:
1. Instalar los paquetes necesarios: @supabase/supabase-js
2. Crear archivo .env.local con las siguientes variables (el usuario proporcionara los valores):
   NEXT_PUBLIC_SUPABASE_URL=<url_del_proyecto_supabase>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<clave_anonima_supabase>
   SUPABASE_SERVICE_ROLE_KEY=<clave_service_role>
3. Crear el archivo app/shared/utils/supabase/client.ts que exporte un cliente Supabase para uso en el navegador (browser-safe, usando NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY)
4. Crear el archivo app/shared/utils/supabase/server.ts que exporte una funcion createClient() para uso en Server Components y Route Handlers de Next.js
5. Crear el archivo app/shared/utils/supabase/index.ts como barrel export
6. Actualizar app/shared/utils/index.ts para incluir el nuevo barrel export de supabase
7. Agregar .env.local al .gitignore si no esta presente
8. Ejecutar npm run build para verificar que la compilacion sea exitosa

RESTRICCIONES:
- Usar los planes gratuitos de Supabase
- No agregar comentarios al codigo
- Seguir las convenciones existentes del proyecto (TypeScript estricto, path aliases)
- Verificar la documentacion de Next.js en node_modules/next/dist/docs/ para APIs correctas de esta version
- El cliente del browser debe ser seguro (solo usar claves anonimas/publicas)

VERIFICACION:
- npm run build debe completar sin errores
- Los archivos creados deben seguir la estructura feature-based del proyecto
```

**Ejecucion manual:** El usuario debe obtener las credenciales de su proyecto Supabase (Settings > API) y completar el archivo `.env.local`.

---

### Tarea 1.2 - Script de creacion de base de datos    OK

**Prompt para el agente de IA:**

```
TAREA 1.2: Generar el script SQL completo para crear la base de datos de Wasave Inmobiliaria.

CONTEXTO:
- Proyecto Supabase ya creado (plan gratuito)
- Se necesita crear todas las tablas, indices, constraints y datos iniciales
- El script debe ser ejecutado manualmente por el usuario en el SQL Editor de Supabase
- Se usa pgcrypto para generacion de UUIDs

INSTRUCCIONES:
Generar un archivo sql/001_initial_schema.sql con el siguiente contenido:

0. HABILITAR EXTENSION:
   CREATE EXTENSION IF NOT EXISTS pgcrypto;

1. TABLA owner:
   - owner_id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
   - document_id: VARCHAR(50)
   - name: VARCHAR(255) NOT NULL
   - email: VARCHAR(255)
   - phone: VARCHAR(50)

2. TABLA client:
   - client_id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
   - document_id: VARCHAR(50)
   - name: VARCHAR(255) NOT NULL
   - last_name: VARCHAR(255)
   - email: VARCHAR(255)
   - phone: VARCHAR(50)

3. TABLA property:
   - property_id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
   - title: VARCHAR(255) NOT NULL
   - description: TEXT
   - area: NUMERIC
   - base_price: NUMERIC
   - sale_price: NUMERIC
   - address: VARCHAR(255)
   - type: VARCHAR(100)
   - owner_id: UUID NOT NULL REFERENCES owner(owner_id)

4. TABLA property_media:
   - media_id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
   - file_url: TEXT NOT NULL
   - cover_image: BOOLEAN DEFAULT FALSE
   - display_order: INTEGER
   - created_at: TIMESTAMP DEFAULT now()
   - property_id: UUID NOT NULL REFERENCES property(property_id)

5. TABLA property_client (relacion N:M entre property y client):
   - property_id: UUID NOT NULL REFERENCES property(property_id)
   - client_id: UUID NOT NULL REFERENCES client(client_id)
   - PRIMARY KEY (property_id, client_id)

6. TABLA appointment:
   - appointment_id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
   - visit_date: TIMESTAMP
   - status: VARCHAR(50)
   - observations: TEXT
   - created_at: TIMESTAMP DEFAULT now()
   - updated_at: TIMESTAMP DEFAULT now()
   - client_id: UUID NOT NULL REFERENCES client(client_id)

7. INDICES:
   - CREATE INDEX idx_property_owner ON property(owner_id);
   - CREATE INDEX idx_property_media_property ON property_media(property_id);
   - CREATE INDEX idx_property_client_property ON property_client(property_id);
   - CREATE INDEX idx_property_client_client ON property_client(client_id);
   - CREATE INDEX idx_appointment_client ON appointment(client_id);
   - CREATE INDEX idx_appointment_visit_date ON appointment(visit_date);
   - CREATE INDEX idx_appointment_status ON appointment(status);

8. TRIGGER para actualizar updated_at automaticamente:
   - Crear funcion update_updated_at_column() que ejecute: NEW.updated_at = now(); RETURN NEW;
   - Aplicar trigger a tabla: appointment

9. Habilitar Row Level Security (RLS) en todas las tablas:
   - ALTER TABLE owner ENABLE ROW LEVEL SECURITY;
   - ALTER TABLE client ENABLE ROW LEVEL SECURITY;
   - ALTER TABLE property ENABLE ROW LEVEL SECURITY;
   - ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;
   - ALTER TABLE property_client ENABLE ROW LEVEL SECURITY;
   - ALTER TABLE appointment ENABLE ROW LEVEL SECURITY;

10. POLITICAS RLS (lectura publica, escritura solo autenticados):
    - owner: SELECT para anon y authenticated; INSERT/UPDATE/DELETE solo authenticated
    - client: SELECT para anon y authenticated; INSERT/UPDATE/DELETE solo authenticated
    - property: SELECT para anon y authenticated; INSERT/UPDATE/DELETE solo authenticated
    - property_media: SELECT para anon y authenticated; INSERT/UPDATE/DELETE solo authenticated
    - property_client: SELECT para anon y authenticated; INSERT/DELETE solo authenticated
    - appointment: SELECT/INSERT para anon; SELECT/UPDATE/DELETE para authenticated

VERIFICACION:
- El script SQL debe ser sintacticamente valido para PostgreSQL
- Todas las tablas deben tener sus constraints y relaciones correctamente definidas
- La extension pgcrypto debe habilitarse antes de crear las tablas

NOTA PARA EL USUARIO: Ejecutar este script completo en Supabase > SQL Editor.
```

**Ejecucion manual:** El usuario debe copiar el contenido del archivo `sql/001_initial_schema.sql` y ejecutarlo en el SQL Editor de Supabase.

---

### Tarea 1.3 - Crear procedimientos almacenados (funciones RPC)   OK

**Prompt para el agente de IA:**

```
TAREA 1.3: Generar el script SQL con las funciones/procedimientos almacenados para la logica de negocio.

CONTEXTO:
- La base de datos ya fue creada (Tarea 1.2 ejecutada)
- Se necesitan funciones para validar disponibilidad de citas y consultar datos
- Estas funciones se invocaran via supabase.rpc() desde el frontend
- El esquema usa tablas: owner, client, property, property_media, property_client, appointment

INSTRUCCIONES:
Generar un archivo sql/002_functions.sql con las siguientes funciones:

1. FUNCION: get_appointments_by_property(p_property_id UUID)
   - Retorna todas las citas de una propiedad ordenadas por visit_date descendente
   - JOIN con client para obtener nombre, apellido, email, telefono del cliente
   - Retorna: TABLE con columnas de appointment + client_name, client_last_name, client_email, client_phone

2. FUNCION: get_appointments_summary()
   - Resumen general de citas para el panel del administrador
   - Retorna: JSONB con:
     { total: INT, pending: INT, confirmed: INT, cancelled: INT, completed: INT, upcoming: INT (citas futuras con status pending o confirmed) }

3. FUNCION: cancel_appointment(p_appointment_id UUID)
   - Cancela una cita cambiando su status a 'cancelled'
   - Actualiza updated_at
   - Retorna: JSONB con { success: BOOLEAN, message: TEXT }

4. FUNCION: get_properties_with_owner()
   - Retorna todas las propiedades con datos del owner
   - JOIN con owner para obtener nombre y contacto del propietario
   - Retorna: TABLE con columnas de property + owner_name, owner_email, owner_phone

5. FUNCION: get_property_clients(p_property_id UUID)
   - Retorna todos los clientes interesados en una propiedad
   - JOIN con property_client y client
   - Retorna: TABLE con columnas de client

VERIFICACION:
- Todas las funciones deben ser syntacticamente validas para PostgreSQL/Supabase
- Las funciones deben manejar casos edge (propiedad sin citas, cliente sin datos, etc.)
- Incluir manejo de errores con EXCEPTION WHEN

NOTA PARA EL USUARIO: Ejecutar este script en Supabase > SQL Editor despues de haber ejecutado el script 001.
```

**Ejecucion manual:** El usuario debe ejecutar `sql/002_functions.sql` en el SQL Editor de Supabase.

---

## FASE 2: FEATURE - PROPIETARIOS (OWNER)

### Tarea 2.1 - Tipos TypeScript para owner     OK

**Prompt para el agente de IA:**

```
TAREA 2.1: Crear el feature owner con tipos TypeScript.

CONTEXTO:
- Proyecto Next.js 16 con App Router, TypeScript estricto
- Feature-based architecture: app/features/<feature-name>/{components,constants,types,index.ts}
- Cliente Supabase ya configurado en app/shared/utils/supabase/
- Base de datos creada con tabla owner (owner_id, document_id, name, email, phone)
- Path aliases: @features/* -> ./app/features/*, @shared/* -> ./app/shared/*
- ARQUITECTURA SIMPLIFICADA: No se usan API Routes ni servicios. Las llamadas a Supabase se hacen directamente desde los componentes/páginas.

INSTRUCCIONES:
1. Crear app/features/owner/types/index.ts:
   - Interface Owner { owner_id: string; document_id: string | null; name: string; email: string | null; phone: string | null; }
   - Interface CreateOwnerInput { document_id?: string; name: string; email?: string; phone?: string; }
   - Interface UpdateOwnerInput { document_id?: string; name?: string; email?: string; phone?: string; }

2. Crear app/features/owner/index.ts como barrel export de types

3. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- No crear API Routes ni servicios - las llamadas a Supabase se hacen directamente desde los componentes
- Seguir convenciones existentes del proyecto

VERIFICACION:
- npm run build sin errores
- Los tipos deben coincidir con la estructura de la tabla en Supabase
```

---

## FASE 3: FEATURE - CLIENTES (CLIENT)

### Tarea 3.1 - Tipos TypeScript para client       OK

**Prompt para el agente de IA:**

```
TAREA 3.1: Crear el feature client con tipos TypeScript.

CONTEXTO:
- Proyecto Next.js 16 con App Router, TypeScript estricto
- Feature-based architecture: app/features/<feature-name>/{components,constants,types,index.ts}
- Cliente Supabase ya configurado en app/shared/utils/supabase/
- Base de datos creada con tabla client (client_id, document_id, name, last_name, email, phone)
- Path aliases: @features/* -> ./app/features/*, @shared/* -> ./app/shared/*
- ARQUITECTURA SIMPLIFICADA: No se usan API Routes ni servicios. Las llamadas a Supabase se hacen directamente desde los componentes/páginas.

INSTRUCCIONES:
1. Crear app/features/client/types/index.ts:
   - Interface Client { client_id: string; document_id: string | null; name: string; last_name: string | null; email: string | null; phone: string | null; }
   - Interface CreateClientInput { document_id?: string; name: string; last_name?: string; email?: string; phone?: string; }
   - Interface UpdateClientInput { document_id?: string; name?: string; last_name?: string; email?: string; phone?: string; }

2. Crear app/features/client/index.ts como barrel export de types

3. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- No crear API Routes ni servicios - las llamadas a Supabase se hacen directamente desde los componentes
- Seguir convenciones existentes del proyecto

VERIFICACION:
- npm run build sin errores
- Los tipos deben coincidir con la estructura de la tabla en Supabase
```

---

## FASE 4: FEATURE - PROPIEDADES (CRUD)

### Tarea 4.1 - Tipos TypeScript para propiedades        OK

**Prompt para el agente de IA:**

```
TAREA 4.1: Crear el feature properties con tipos TypeScript.

CONTEXTO:
- Proyecto Next.js 16 con App Router, TypeScript estricto
- Feature-based architecture: app/features/<feature-name>/{components,constants,types,index.ts}
- Cliente Supabase configurado en app/shared/utils/supabase/
- Base de datos con tablas: property, owner, property_media, property_client
- Feature owner ya creado en app/features/owner/
- Feature client ya creado en app/features/client/
- Path aliases: @features/* -> ./app/features/*, @shared/* -> ./app/shared/*
- ARQUITECTURA SIMPLIFICADA: No se usan API Routes ni servicios. Las llamadas a Supabase se hacen directamente desde los componentes/páginas.

INSTRUCCIONES:
1. Crear app/features/properties/types/index.ts:
   - Interface Property { property_id, title, description, area, base_price, sale_price, address, type, owner_id }
   - Interface PropertyMedia { media_id, file_url, cover_image, display_order, created_at, property_id }
   - Interface PropertyWithMedia extends Property { media: PropertyMedia[]; owner?: Owner }
   - Interface CreatePropertyInput { title, description?, area?, base_price?, sale_price?, address?, type, owner_id }
   - Interface UpdatePropertyInput (campos opcionales para actualizar)

2. Crear app/features/properties/index.ts como barrel export de types

3. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- No crear API Routes ni servicios - las llamadas a Supabase se hacen directamente desde los componentes
- Seguir convenciones existentes del proyecto

VERIFICACION:
- npm run build sin errores
- Los tipos deben coincidir con la estructura de la tabla en Supabase
```

---

### Tarea 4.2 - Storage de Supabase para imagenes y videos        OK

**Ejecucion manual en Supabase:**

1. Ir a Supabase Dashboard > Storage
2. Crear bucket 'property-media' con configuracion:
   - Public bucket: ✅ Activado
   - File size limit: 50 MB
   - Allowed MIME types: image/jpeg, image/png, image/webp, video/mp4, video/webm
3. Crear politicas RLS:
   - SELECT publico (anonimos pueden ver imagenes/videos)
   - INSERT/UPDATE/DELETE solo para usuarios autenticados

**Nota:** Las llamadas al storage se hacen directamente desde los componentes usando `supabase.storage.from('property-media')`.

---

## FASE 6: FEATURE - CITAS (APPOINTMENTS)          ok

### Tarea 6.1 - Tipos TypeScript para citas

**Prompt para el agente de IA:**

```
TAREA 6.1: Crear el feature appointments con tipos TypeScript.

CONTEXTO:
- Proyecto Next.js 16 con App Router, TypeScript estricto
- Tabla appointment en Supabase (appointment_id, visit_date, status, observations, created_at, updated_at, client_id)
- FK client_id referencia a tabla client
- Funciones RPC: get_appointments_by_property, get_appointments_summary, cancel_appointment
- Feature client ya creado en app/features/client/
- Feature properties ya creado en app/features/properties/
- ARQUITECTURA SIMPLIFICADA: No se usan API Routes ni servicios. Las llamadas a Supabase se hacen directamente desde los componentes/páginas.

INSTRUCCIONES:
1. Crear app/features/appointments/types/index.ts:
   - Interface Appointment { appointment_id, visit_date, status ('pending'|'confirmed'|'cancelled'|'completed'), observations, created_at, updated_at, client_id }
   - Interface AppointmentWithClient extends Appointment { client: Client }
   - Interface CreateAppointmentInput { visit_date, status?, observations?, client_id }
   - Interface UpdateAppointmentInput { visit_date?, status?, observations? }
   - Type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
   - Interface AppointmentsSummary { total: number; pending: number; confirmed: number; cancelled: number; completed: number; upcoming: number }

2. Crear app/features/appointments/index.ts como barrel export de types

3. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- No crear API Routes ni servicios - las llamadas a Supabase se hacen directamente desde los componentes
- Las funciones RPC se invocan con supabase.rpc() desde los componentes

VERIFICACION:
- npm run build sin errores
- Los tipos deben coincidir con la estructura de la tabla en Supabase
```

---

### Tarea 6.2 - Notificaciones por WhatsApp           ok

**Ejecucion directa en componentes:**

```
TAREA 6.2: Implementar generacion de links de WhatsApp para notificaciones.

CONTEXTO:
- Feature appointments ya creado en app/features/appointments/
- Para WhatsApp: generar links de wa.me con mensaje pre-formateado (sin costo)
- ARQUITECTURA SIMPLIFICADA: No se usan servicios. La logica se implementa directamente en los componentes.

INSTRUCCIONES:
1. Crear app/features/notifications/types/index.ts:
   - Interface NotificationData { appointment: Appointment; client: Client; action: 'created' | 'updated' | 'cancelled' }

2. Crear app/features/notifications/utils/whatsapp.ts:
   - Funcion generateWhatsAppMessage(data: NotificationData): string
   - Funcion getWhatsAppLink(phone: string, message: string): string (retorna link wa.me)

3. Crear app/features/notifications/index.ts como barrel export

4. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- Solo WhatsApp (links wa.me), no email en esta fase
- Los mensajes deben estar en espanol
- Las llamadas a Supabase para obtener datos del cliente se hacen directamente

VERIFICACION:
- npm run build sin errores
- Los links de WhatsApp se generan correctamente

NOTA: Para email en produccion se necesitara configurar un proveedor como Resend (plan gratuito: 3,000 emails/mes).
```

---

## FASE 7: FEATURE - AUTENTICACION DEL ADMINISTRADOR     

### Tarea 7.1 - Configurar autenticacion Supabase     ok

**Prompt para el agente de IA:**

```
TAREA 7.1: Configurar autenticacion para el modulo del administrador usando Supabase Auth.

CONTEXTO:
- Proyecto Supabase con Auth habilitado por defecto
- Se necesita un solo usuario administrador (el propietario de Wasave Inmobiliaria)
- Las operaciones de escritura requieren autenticacion
- Supabase Auth en plan gratuito: 50,000 MAUs
- ARQUITECTURA SIMPLIFICADA: La autenticacion se maneja directamente con Supabase Auth, sin middleware personalizado

INSTRUCCIONES:
1. Crear app/features/auth/types/index.ts:
   - Interface AdminUser { id: string; email: string; created_at: string }
   - Interface LoginInput { email: string; password: string }
   - Interface AuthState { user: AdminUser | null; isLoading: boolean; isAuthenticated: boolean }

2. Crear app/features/auth/hooks/useAuth.ts:
   - Hook useAuth() que retorne AuthState + login + logout
   - Usar supabase.auth.signInWithPassword() y supabase.auth.signOut()
   - Verificar sesion al montar con supabase.auth.getSession()
   - Escuchar cambios con supabase.auth.onAuthStateChange()

3. Crear app/features/auth/context/AuthContext.tsx:
   - AuthProvider component que envuelve la app
   - Proveer useAuth hook

4. Crear app/features/auth/index.ts como barrel export

5. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- Solo un usuario administrador (se crea manualmente en Supabase Dashboard)
- No implementar registro publico
- Usar Supabase Auth con email/password
- Las credenciales nunca deben exponerse en el cliente
- La seguridad de escritura se maneja via RLS en Supabase (no en Next.js)

VERIFICACION:
- npm run build sin errores
- El hook useAuth funciona correctamente
- El AuthProvider envuelve la app sin errores

NOTA PARA EL USUARIO: Crear el usuario administrador en Supabase Dashboard > Authentication > Users > Add User.
```

**Ejecucion manual:** El usuario debe crear el usuario administrador en Supabase Dashboard > Authentication > Users > Add User.

---

## FASE 8: FEATURE - PANEL DE ADMINISTRACION

### Tarea 8.1 - Layout y autenticacion del panel admin      ok

**Prompt para el agente de IA:**

```
TAREA 8.1: Crear el layout y la pagina de login del panel de administracion.

CONTEXTO:
- Proyecto Next.js 16 con App Router, TypeScript estricto, Tailwind CSS v4
- Feature auth ya creado en app/features/auth/ con AuthProvider y useAuth
- Theme system existente con CSS variables en globals.css (light/dark mode)
- Componentes UI reutilizables en app/shared/components/ui/ (Button, Card, SectionHeader)
- Fuente: Montserrat (400, 600, 700)

INSTRUCCIONES:
1. Crear app/(admin)/admin/layout.tsx:
   - Layout del panel admin con sidebar/navegacion
   - Verificar autenticacion, redirigir a /admin/login si no hay sesion
   - Navegacion: Dashboard, Propiedades, Owners, Clientes, Citas, Certificados
   - Responsive (mobile-first)
   - Usar el theme system existente

2. Crear app/(admin)/admin/login/page.tsx:
   - Pagina de login con email y password
   - Usar el hook useAuth para el login
   - Redirigir a /admin si el login es exitoso
   - Mostrar errores de autenticacion
   - Diseno limpio y profesional

3. Crear app/(admin)/admin/page.tsx (Dashboard):
   - Mostrar resumen de citas (usa getAppointmentsSummary)
   - Mostrar proximas citas del dia
   - Metricas rapidas: propiedades activas, citas pendientes, citas de hoy, total owners, total clients

4. Crear componentes compartidos del admin en app/features/admin/components/:
   - AdminSidebar.tsx
   - AdminHeader.tsx
   - StatsCard.tsx

5. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- Usar componentes existentes (Button, Card) cuando sea posible
- Mantener consistencia visual con la landing page (colores, fuente)
- Responsive design

VERIFICACION:
- npm run build sin errores
- /admin/login renderiza correctamente
- /admin redirige a login si no hay sesion
```

---

### Tarea 8.2 - CRUD de propiedades en el panel admin       ok

**Prompt para el agente de IA:**

```
TAREA 8.2: Crear las paginas del panel admin para gestionar propiedades (listar, crear, editar, eliminar).

CONTEXTO:
- Panel admin en app/(admin)/admin/ con layout y autenticacion
- Feature properties con tipos TypeScript
- Feature owner con tipos TypeScript
- Storage de Supabase configurado para property-media bucket
- Componentes UI: Button, Card, SectionHeader
- ARQUITECTURA SIMPLIFICADA: Las llamadas a Supabase se hacen directamente desde los componentes

INSTRUCCIONES:
1. Crear app/(admin)/admin/propiedades/page.tsx:
   - Lista de todas las propiedades con filtros por tipo
   - Tabla/cards con: imagen cover, titulo, tipo, precio base, precio venta, owner, acciones
   - Boton "Nueva Propiedad" que lleva al formulario de creacion
   - Acciones por propiedad: Editar, Eliminar
   - Llamadas directas a supabase.from("property").select("*, owner:owner_id(*)")

2. Crear app/(admin)/admin/propiedades/nueva/page.tsx:
   - Formulario completo para crear propiedad
   - Owner (select desde owners existentes, llamada directa a supabase.from("owner").select())
   - Upload multiple de imagenes/videos con supabase.storage.from("property-media")
   - Al guardar: crear propiedad + subir media + asociar media en property_media

3. Crear app/(admin)/admin/propiedades/[id]/editar/page.tsx:
   - Formulario de edicion precargado con datos existentes
   - Gestion de media existente (eliminar, agregar nuevos)

4. Crear componentes del feature admin/properties:
   - app/features/admin/components/PropertyForm.tsx
   - app/features/admin/components/PropertyList.tsx
   - app/features/admin/components/MediaUploader.tsx
   - app/features/admin/components/ConfirmDialog.tsx

5. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- Las llamadas a Supabase se hacen directamente desde los componentes
- Manejar estados de carga y error
- Confirmar antes de eliminar

VERIFICACION:
- npm run build sin errores
- CRUD completo funcional
- Upload de imagenes funcional
```

---

### Tarea 8.3 - Gestion de owners en el panel admin      ok

**Prompt para el agente de IA:**

```
TAREA 8.3: Crear las paginas del panel admin para gestionar propietarios (owners).

CONTEXTO:
- Panel admin en app/(admin)/admin/ con layout y autenticacion
- Feature owner con tipos TypeScript
- Tabla owner con campos: owner_id, document_id, name, email, phone
- ARQUITECTURA SIMPLIFICADA: Las llamadas a Supabase se hacen directamente desde los componentes

INSTRUCCIONES:
1. Crear app/(admin)/admin/owners/page.tsx:
   - Lista de todos los owners
   - Tabla con: nombre, documento, email, telefono, acciones
   - Boton "Nuevo Propietario"
   - Acciones: Editar, Eliminar
   - Llamadas directas a supabase.from("owner").select()

2. Crear app/(admin)/admin/owners/nuevo/page.tsx:
   - Formulario para crear owner: document_id, name, email, phone
   - Validacion de campos requeridos (name obligatorio)

3. Crear app/(admin)/admin/owners/[id]/editar/page.tsx:
   - Formulario de edicion precargado

4. Crear componentes:
   - app/features/admin/components/OwnerForm.tsx
   - app/features/admin/components/OwnerList.tsx

5. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- Las llamadas a Supabase se hacen directamente desde los componentes
- Validar que no se elimine un owner que tiene propiedades asociadas

VERIFICACION:
- npm run build sin errores
- CRUD completo de owners funcional
```

---

### Tarea 8.4 - Gestion de clientes en el panel admin    ok

**Prompt para el agente de IA:**

```
TAREA 8.4: Crear las paginas del panel admin para gestionar clientes.

CONTEXTO:
- Panel admin en app/(admin)/admin/ con layout y autenticacion
- Feature client con tipos TypeScript
- Tabla client con campos: client_id, document_id, name, last_name, email, phone
- ARQUITECTURA SIMPLIFICADA: Las llamadas a Supabase se hacen directamente desde los componentes

INSTRUCCIONES:
1. Crear app/(admin)/admin/clientes/page.tsx:
   - Lista de todos los clientes
   - Tabla con: nombre, apellido, documento, email, telefono, acciones
   - Boton "Nuevo Cliente"
   - Acciones: Editar, Eliminar
   - Llamadas directas a supabase.from("client").select()

2. Crear app/(admin)/admin/clientes/nuevo/page.tsx:
   - Formulario para crear client: document_id, name, last_name, email, phone
   - Validacion de campos requeridos (name obligatorio)

3. Crear app/(admin)/admin/clientes/[id]/editar/page.tsx:
   - Formulario de edicion precargado

4. Crear componentes:
   - app/features/admin/components/ClientForm.tsx
   - app/features/admin/components/ClientList.tsx

5. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- Las llamadas a Supabase se hacen directamente desde los componentes

VERIFICACION:
- npm run build sin errores
- CRUD completo de clientes funcional
```

---

### Tarea 8.5 - Gestion de citas en el panel admin

**Prompt para el agente de IA:**

```
TAREA 8.5: Crear las paginas del panel admin para gestionar citas agendadas.

CONTEXTO:
- Panel admin en app/(admin)/admin/ con layout y autenticacion
- Feature appointments con tipos TypeScript
- Feature client para obtener datos del cliente asociado a la cita
- Funciones RPC: get_appointments_by_property, get_appointments_summary, cancel_appointment
- ARQUITECTURA SIMPLIFICADA: Las llamadas a Supabase se hacen directamente desde los componentes

INSTRUCCIONES:
1. Crear app/(admin)/admin/citas/page.tsx:
   - Vista de lista/tabla de todas las citas con filtros:
     * Por estado (pending, confirmed, cancelled, completed)
     * Por rango de fechas
   - Columnas: Fecha visita, Cliente (nombre + apellido), Email, Telefono, Estado, Observaciones, Acciones
   - Ordenar por visit_date descendente
   - Indicadores visuales por estado (colores)
   - Llamadas directas a supabase.from("appointment").select("*, client:client_id(*)")

2. Crear app/(admin)/admin/citas/[id]/page.tsx:
   - Vista detalle de la cita
   - Datos completos del cliente y observaciones
   - Acciones: Confirmar, Cancelar, Editar fecha, Eliminar

3. Crear app/(admin)/admin/citas/[id]/editar/page.tsx:
   - Formulario para editar fecha de visita y observaciones
   - Al guardar, validar nueva fecha

4. Crear componentes:
   - app/features/admin/components/AppointmentList.tsx
   - app/features/admin/components/AppointmentDetail.tsx
   - app/features/admin/components/AppointmentFilters.tsx
   - app/features/admin/components/StatusBadge.tsx

5. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- Las llamadas a Supabase se hacen directamente desde los componentes
- Las acciones de editar/cancelar/eliminar deben confirmar antes de ejecutar

VERIFICACION:
- npm run build sin errores
- Lista de citas con filtros funcional
- Edicion y eliminacion de citas funcional
```

---

### Tarea 8.6 - Modulo de certificados de libertad y tradicion

**Prompt para el agente de IA:**

```
TAREA 8.6: Crear el modulo de certificados de libertad y tradicion en el panel admin.

CONTEXTO:
- Panel admin en app/(admin)/admin/ con layout y autenticacion
- El administrador necesita un boton/seccion que lo redirija a la compra de certificados de libertad y tradicion
- En Colombia, los certificados se compran en la pagina de la Superintendencia de Notariado y Registro (SNR): https://www.supernotariado.gov.co/ o en https://ventanilla.supernotariado.gov.co/
- Esto es simplemente un acceso directo/redireccion, no una integracion completa

INSTRUCCIONES:
1. Crear app/(admin)/admin/certificados/page.tsx:
   - Pagina informativa sobre certificados de libertad y tradicion
   - Descripcion del servicio
   - Boton "Comprar Certificado" que redirija a la ventanilla de la SNR (abrir en nueva pestana)
   - Informacion de contacto para asistencia

2. Crear componente:
   - app/features/admin/components/CertificateCard.tsx

3. Agregar enlace en la navegacion del admin (sidebar) si no existe

4. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- El boton debe abrir la URL externa en nueva pestana (target="_blank" rel="noopener noreferrer")
- Diseno consistente con el resto del panel admin

VERIFICACION:
- npm run build sin errores
- La pagina renderiza correctamente
- El boton redirige a la URL correcta
```

---

## FASE 9: FEATURE - VISTA PUBLICA DE PROPIEDADES (CLIENTE)

### Tarea 9.1 - Catalogo de propiedades y detalle con agendamiento

**Prompt para el agente de IA:**

```
TAREA 9.1: Crear las paginas publicas para que los clientes exploren propiedades y agenden citas.

CONTEXTO:
- Landing page existente en app/page.tsx con seccion CompraVentaSection que muestra tipos de propiedad
- Actualmente los botones "Consultar disponibilidad" redirigen a WhatsApp
- Feature properties con tipos TypeScript
- Feature appointments con tipos TypeScript
- Feature client para crear/obtener clientes
- Theme system con CSS variables (light/dark), fuente Montserrat
- Componentes UI: Button, Card, SectionHeader
- ARQUITECTURA SIMPLIFICADA: Las llamadas a Supabase se hacen directamente desde los componentes

INSTRUCCIONES:
1. Crear app/(public)/propiedades/page.tsx:
   - Pagina de catalogo de propiedades
   - Filtro por tipo de propiedad (Lote, Casa Finca, Cabana) como tabs o botones
   - Grid de cards de propiedades con: imagen cover, titulo, precio venta, direccion, area
   - Al hacer clic en una propiedad, navegar al detalle
   - Solo mostrar propiedades activas
   - Llamadas directas a supabase.from("property").select("*, media:property_media(*)")

2. Crear app/(public)/propiedades/[id]/page.tsx:
   - Vista detalle de la propiedad
   - Galeria de imagenes/videos (carrusel o grid)
   - Informacion completa: titulo, descripcion, area, precio base, precio venta, direccion, tipo
   - Datos del propietario (nombre, contacto)
   - Seccion de agendamiento de cita integrada:
     * Selector de fecha (calendario)
     * Selector de hora (time picker)
     * Formulario: nombre, apellido, documento, telefono, email
     * Boton "Agendar Cita"
     * Mensaje de confirmacion con resumen de la cita
   - Validacion de formulario
   - Al agendar: crear cliente si no existe + crear cita + registrar interes en property_client
   - Llamadas directas a Supabase para todas las operaciones

3. Crear componentes:
   - app/features/properties/components/PropertyCard.tsx
   - app/features/properties/components/PropertyGallery.tsx
   - app/features/properties/components/PropertyFilters.tsx
   - app/features/appointments/components/AppointmentForm.tsx
   - app/features/appointments/components/AppointmentConfirmation.tsx

4. Actualizar CompraVentaSection para que los botones "Consultar disponibilidad" redirijan a /propiedades?type=<type> en lugar de WhatsApp

5. Actualizar el Header para incluir enlace a "Propiedades" en la navegacion

6. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- Las paginas son publicas (no requieren autenticacion)
- Las llamadas a Supabase se hacen directamente desde los componentes
- Diseno responsive y consistente con la landing page
- El formulario de cita debe validar: email valido, telefono valido, fecha futura
- Generar link de WhatsApp como canal alternativo de contacto en cada propiedad

VERIFICACION:
- npm run build sin errores
- Catalogo de propiedades con filtros funcional
- Detalle de propiedad con galeria funcional
- Formulario de agendamiento valida y crea citas correctamente
```

---

## FASE 10: REVISION DE SEGURIDAD

### Tarea 10.1 - Auditoria de seguridad

**Prompt para el agente de IA:**

```
TAREA 10.1: Realizar una auditoria de seguridad completa del proyecto y aplicar correcciones.

CONTEXTO:
- Proyecto Next.js 16 + Supabase para Wasave Inmobiliaria
- Features implementados: auth, owner, client, property, appointments, notifications, admin panel
- Autenticacion con Supabase Auth
- RLS habilitado en todas las tablas
- Storage bucket para medios
- ARQUITECTURA SIMPLIFICADA: No hay API Routes, la seguridad se maneja via RLS en Supabase

INSTRUCCIONES:
1. Revisar y fortalecer Row Level Security (RLS):
   - Verificar que todas las tablas tienen RLS habilitado
   - Revisar que las politicas son restrictivas (no overly permissive)
   - Asegurar que los usuarios anonimos solo pueden: leer propiedades/owners/clients, crear citas, registrar interes
   - Asegurar que solo authenticated puede: CRUD propiedades/owners/clients, editar/eliminar citas
   - Agregar politicas para storage.objects del bucket property-media

2. Revisar variables de entorno:
   - Confirmar que .env.local esta en .gitignore
   - Confirmar que SUPABASE_SERVICE_ROLE_KEY solo se usa en server-side
   - Confirmar que NEXT_PUBLIC_* solo expone claves seguras

3. Revisar headers de seguridad:
   - Actualizar next.config.ts con headers de seguridad:
     * X-Frame-Options: DENY
     * X-Content-Type-Options: nosniff
     * Referrer-Policy: strict-origin-when-cross-origin
     * Content-Security-Policy (basico)

4. Revisar el codigo fuente completo:
   - Buscar posibles fugas de datos
   - Buscar uso inseguro de dangerouslySetInnerHTML
   - Verificar que los archivos subidos al storage tienen tipos MIME validados
   - Verificar que las llamadas a Supabase desde componentes usan RLS correctamente

5. Generar reporte de hallazgos y correcciones aplicadas

6. Ejecutar npm run build para verificar compilacion exitosa

RESTRICCIONES:
- No agregar comentarios al codigo
- Las correcciones deben ser minimas y quirurgicas
- Documentar cada cambio de seguridad

VERIFICACION:
- npm run build sin errores
- No se exponen claves sensibles en el bundle del cliente
- RLS bloquea accesos no autorizados
- Headers de seguridad presentes en las respuestas
```

---

## FASE 11: INTEGRACION FINAL Y TESTING

### Tarea 11.1 - Integracion completa y pruebas E2E

**Prompt para el agente de IA:**

```
TAREA 11.1: Realizar pruebas de integracion completa y corregir problemas.

CONTEXTO:
- Todas las fases anteriores completadas
- Landing page + panel admin + base de datos funcionando
- Se necesita verificar que todo el flujo funciona de extremo a extremo
- ARQUITECTURA SIMPLIFICADA: Todas las llamadas a Supabase se hacen directamente desde los componentes

INSTRUCCIONES:
1. Verificar flujos completos:

   FLUJO 1 - Gestionar propietarios:
   - Admin inicia sesion en /admin/login
   - Admin crea un nuevo owner
   - Admin edita el owner
   - El owner aparece en el selector al crear propiedades

   FLUJO 2 - Publicar propiedad:
   - Admin crea una nueva propiedad con imagenes, asociada a un owner
   - La propiedad aparece en /propiedades
   - El detalle muestra datos del propietario

   FLUJO 3 - Gestionar clientes:
   - Admin crea un nuevo cliente desde el panel
   - Admin ve la lista de clientes

   FLUJO 4 - Agendar cita:
   - Cliente ingresa a /propiedades
   - Filtra por tipo de propiedad
   - Selecciona una propiedad
   - Completa formulario y agenda cita (se crea cliente automaticamente si es nuevo)
   - Se registra el interes en property_client
   - Recibe link de WhatsApp

   FLUJO 5 - Gestionar citas (Admin):
   - Admin ve las citas en /admin/citas
   - Filtra por estado
   - Confirma una cita (cambia estado)
   - Edita fecha de una cita
   - Cancela una cita

   FLUJO 6 - Certificados:
   - Admin accede a /admin/certificados
   - Hace clic en "Comprar Certificado"
   - Se abre la pagina de la SNR en nueva pestana

2. Corregir cualquier bug encontrado durante las pruebas

3. Optimizar rendimiento:
   - Verificar que las consultas a Supabase son eficientes
   - Agregar loading states donde falten
   - Implementar error boundaries si no existen

4. Ejecutar npm run build para verificar compilacion exitosa
5. Ejecutar npm run lint para verificar que no hay errores de linting

VERIFICACION:
- npm run build sin errores
- npm run lint sin errores
- Todos los flujos E2E funcionan correctamente
```

---

## RESUMEN DE ARCHIVOS SQL A EJECUTAR EN SUPABASE

| Orden | Archivo | Descripcion | Ejecucion |
|---|---|---|---|
| 1 | `sql/001_initial_schema.sql` | Extension pgcrypto, tablas, indices, triggers, RLS | Manual en SQL Editor |
| 2 | `sql/002_functions.sql` | Funciones RPC (stored procedures) | Manual en SQL Editor |
| 3 | Storage bucket | Crear bucket 'property-media' manualmente | Supabase Dashboard > Storage |

## RESUMEN DE FEATURES (Arquitectura)

### Arquitectura simplificada (Frontend puro)

```
app/features/
├── owner/              # Tipos TypeScript para propietarios
├── client/             # Tipos TypeScript para clientes
├── properties/         # Tipos TypeScript para propiedades
├── appointments/       # Tipos TypeScript para citas
├── notifications/      # Fase 6.2: Email y WhatsApp
├── auth/               # Fase 7: Autenticacion admin
├── admin/              # Fase 8: Panel de administracion
├── home/               # (existente) Landing page
├── seguros/            # (existente) Seccion seguros
├── servicios/          # (existente) Seccion servicios
├── mantenimiento/      # (existente) Seccion mantenimiento
├── compra-venta/       # (existente) Seccion compra-venta
└── representante-legal/# (existente) Seccion representante
```

### Decision de arquitectura

**NO se usan API Routes de Next.js** porque:
1. Supabase ya proporciona API REST automatica al crear tablas
2. El cliente JS de Supabase permite hacer llamadas directas desde el frontend
3. Para una aplicacion con pocas vistas, no es necesario una capa backend adicional
4. La seguridad se maneja via RLS (Row Level Security) en Supabase

**Los features solo contienen tipos TypeScript** (interfaces) para:
- Validacion en tiempo de compilacion
- Autocompletado en el IDE
- Documentacion de la estructura de datos

**Las llamadas a Supabase se hacen directamente** desde:
- Componentes React (client-side)
- Server Components (server-side)
- Usando `createClient` de `@/app/shared/utils/supabase/client`

## RESTRICCIONES DEL PLAN GRATUITO DE SUPABASE

| Recurso | Limite Gratuito |
|---|---|
| Base de datos | 500 MB |
| Storage | 1 GB |
| Ancho de banda | 2 GB/mes |
| Edge Functions | 500,000 invocaciones/mes |
| Auth MAUs | 50,000 |
| Proyectos activos | 2 |
| Pausa por inactividad | Despues de 7 dias sin trafico |

## NOTAS IMPORTANTES

- **El usuario ejecuta manualmente** todos los scripts SQL en Supabase SQL Editor y las configuraciones del Dashboard.
- **Cada tarea incluye `npm run build`** para garantizar compilacion exitosa.
- **Las revisiones de seguridad** se ejecutan en la Fase 10 y deben repetirse periodicamente.
- **Los scripts SQL son incrementales**: cada uno depende del anterior (ejecutar en orden).
- **Extension pgcrypto**: se debe habilitar antes de crear las tablas para usar `gen_random_uuid()`.
- **Para WhatsApp**: en esta fase se usan links de wa.me con mensajes pre-formateados (sin costo). Para notificaciones automaticas reales se requeriria Twilio o similar (plan pagado).
- **Para email**: Supabase Auth incluye emails transaccionales basicos. Para templates personalizados se recomienda Resend (3,000 emails/mes gratis).
- **Mantener el proyecto activo**: el plan gratuito pausa proyectos sin trafico despues de 7 dias. Realizar al menos una peticion periodicamente.
