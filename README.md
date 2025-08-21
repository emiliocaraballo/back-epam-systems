# 📚 Book Reviews API

Una API RESTful para gestionar libros, reseñas y búsquedas de libros utilizando la API de OpenLibrary.

## 🚀 Características

- **Autenticación JWT**: Sistema de autenticación seguro con tokens JWT
- **Gestión de Libros**: CRUD completo para libros y reseñas
- **Búsqueda de Libros**: Integración con OpenLibrary API
- **Historial de Búsquedas**: Almacenamiento y gestión de búsquedas recientes
- **Base de Datos MongoDB**: Persistencia de datos con MongoDB
- **Logging**: Sistema de logs completo con Winston
- **Docker**: Configuración con Docker Compose para MongoDB

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **Winston** - Sistema de logging
- **Docker** - Containerización
- **OpenLibrary API** - API externa para búsqueda de libros

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- Docker y Docker Compose
- npm o yarn

## 🚀 Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
git clone <repository-url>
cd backend
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=3111
MONGODB_URI=mongodb://admin:password123@localhost:27019/book-reviews?authSource=admin
CORS_ORIGIN=*
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=admin123
JWT_SECRET=your_jwt_secret_key_here
```

### Paso 4: Iniciar MongoDB con Docker

```bash
# Iniciar MongoDB
docker-compose up -d

# Verificar que MongoDB esté corriendo
docker-compose ps
```

### Paso 5: Ejecutar la Aplicación

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

La API estará disponible en: `http://localhost:3111`

## 🐳 Configuración de Docker

### MongoDB Container

El archivo `docker-compose.yml` configura MongoDB con los siguientes parámetros:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: book-reviews-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: book-reviews
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
    driver: local
```

### Comandos Docker Útiles

```bash
# Iniciar MongoDB
docker-compose up -d

# Detener MongoDB
docker-compose down

# Ver logs de MongoDB
docker-compose logs mongodb

# Acceder al shell de MongoDB
docker exec -it book-reviews-mongodb mongosh -u admin -p password123

# Conectar desde tu aplicación local
mongodb://admin:password123@localhost:27019/book-reviews?authSource=admin

# Eliminar volumen de datos (¡CUIDADO! Esto borrará todos los datos)
docker-compose down -v
```

## 📚 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── configenv.js          # Configuración de variables de entorno
│   ├── controllers/
│   │   ├── authController.js     # Controlador de autenticación
│   │   └── bookController.js     # Controlador de libros
│   ├── routes/
│   │   ├── authRoutes.js         # Rutas de autenticación
│   │   └── bookRoutes.js         # Rutas de libros
│   ├── services/
│   │   ├── authService.js        # Servicios de autenticación
│   │   ├── bookService.js        # Servicios de libros
│   │   └── openLibraryService.js # Servicio de OpenLibrary
│   ├── models/
│   │   ├── User.js               # Modelo de usuario
│   │   ├── Book.js               # Modelo de libro
│   │   └── SearchHistory.js      # Modelo de historial
│   ├── middleware/
│   │   └── auth.js               # Middleware de autenticación
│   ├── utils/
│   │   └── logger.js             # Configuración de logging
│   └── server.js                 # Servidor principal
├── logs/                         # Archivos de logs
├── docker-compose.yml            # Configuración de Docker
├── package.json                  # Dependencias del proyecto
└── README.md                     # Documentación
```

## 🔐 Autenticación

### Registro de Usuario

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "usuario",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Inicio de Sesión

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "username": "usuario",
    "email": "usuario@ejemplo.com"
  }
}
```

## 📖 Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Registrar nuevo usuario |
| POST | `/api/v1/auth/login` | Iniciar sesión |

### Libros

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/v1/books` | Obtener todos los libros | ✅ |
| GET | `/api/v1/books/:id` | Obtener libro por ID | ✅ |
| POST | `/api/v1/books` | Crear nuevo libro | ✅ |
| PUT | `/api/v1/books/:id/review` | Actualizar reseña | ✅ |
| DELETE | `/api/v1/books/:id` | Eliminar libro | ✅ |

### Búsqueda

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/v1/books/search?q=query` | Buscar libros en OpenLibrary | ❌ |
| GET | `/api/v1/books/last-search` | Obtener historial de búsquedas | ❌ |
| DELETE | `/api/v1/books/search?q=query` | Eliminar búsqueda del historial | ❌ |

## 📝 Ejemplos de Uso

### Obtener Libros con Filtros

```http
GET /api/v1/books?title=harry&author=rowling&sortByRating=desc
Authorization: Bearer <token>
```

### Crear un Libro

```http
POST /api/v1/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Harry Potter y la Piedra Filosofal",
  "author": "J.K. Rowling",
  "isbn": "9788478884452",
  "description": "El primer libro de la saga de Harry Potter"
}
```

### Actualizar Reseña

```http
PUT /api/v1/books/:id/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "review": "Excelente libro, muy recomendado para todas las edades."
}
```

### Buscar Libros

```http
GET /api/v1/books/search?q=harry potter
Content-Type: application/json
```

**Nota**: Este endpoint NO requiere autenticación

### Obtener Historial de Búsquedas

```http
GET /api/v1/books/last-search
Content-Type: application/json
```

**Nota**: Este endpoint NO requiere autenticación

### Eliminar del Historial de Búsquedas

```http
DELETE /api/v1/books/search?q=harry potter
Content-Type: application/json
```

**Nota**: Este endpoint NO requiere autenticación

## 🔍 Filtros Disponibles

- `title`: Filtrar por título
- `author`: Filtrar por autor
- `excludeNoReview`: Excluir libros sin reseñas (`true`/`false`)
- `sortByRating`: Ordenar por rating (`asc`/`desc`)

## 📊 Modelos de Datos

### Usuario (User)
```javascript
{
  username: String,
  email: String,
  password: String (hasheada),
  createdAt: Date
}
```

### Libro (Book)
```javascript
{
  title: String,
  author: String,
  isbn: String,
  description: String,
  userId: ObjectId,
  rating: Number,
  review: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Historial de Búsqueda (SearchHistory)
```javascript
{
  query: String,
  results: Number,
  timestamp: Date
}
```

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en modo producción
npm start

# Construir aplicación para producción
npm run build

# Ejecutar en modo producción con variables de entorno
npm run prod

# Scripts PM2 para gestión de procesos
npm run pm2:dev          # Iniciar en modo desarrollo con PM2
npm run pm2:prod         # Iniciar en modo producción con PM2
npm run pm2:stop         # Detener todos los procesos PM2
npm run pm2:restart      # Reiniciar todos los procesos PM2
npm run pm2:delete       # Eliminar todos los procesos PM2
npm run pm2:logs         # Ver logs de PM2
npm run pm2:monit        # Monitor en tiempo real de PM2
npm run pm2:status       # Estado de los procesos PM2

# Ejecutar tests (pendiente de implementar)
npm test
```

#### Descripción de Scripts:

- **`npm run dev`**: Ejecuta la aplicación en modo desarrollo con nodemon (reinicio automático)
- **`npm start`**: Ejecuta la aplicación en modo producción
- **`npm run build`**: Instala solo las dependencias de producción (excluye devDependencies)
- **`npm run prod`**: Ejecuta la aplicación con `NODE_ENV=production` para optimizaciones

#### Scripts PM2:

- **`npm run pm2:dev`**: Inicia la aplicación en modo desarrollo con PM2 (watch activado)
- **`npm run pm2:prod`**: Inicia la aplicación en modo producción con PM2 (modo cluster)
- **`npm run pm2:stop`**: Detiene todos los procesos PM2
- **`npm run pm2:restart`**: Reinicia todos los procesos PM2
- **`npm run pm2:delete`**: Elimina todos los procesos PM2
- **`npm run pm2:logs`**: Muestra los logs en tiempo real
- **`npm run pm2:monit`**: Abre el monitor de PM2 en tiempo real
- **`npm run pm2:status`**: Muestra el estado de todos los procesos

## 🚀 Gestión de Procesos con PM2

PM2 es un gestor de procesos avanzado para aplicaciones Node.js que proporciona:

### Características PM2:
- **Modo Cluster**: Utiliza todos los cores del CPU
- **Auto-restart**: Reinicio automático en caso de fallos
- **Watch Mode**: Reinicio automático al detectar cambios (desarrollo)
- **Gestión de Logs**: Logs centralizados y rotación automática
- **Monitoreo**: Monitor en tiempo real de CPU y memoria

### Configuración PM2:

El archivo `ecosystem.config.js` define dos configuraciones:

#### Desarrollo (`book-reviews-api-dev`):
- **1 instancia**
- **Watch mode activado**
- **Logs detallados**
- **Auto-restart en cambios**

#### Producción (`book-reviews-api-prod`):
- **Modo cluster (todas las CPUs)**
- **Watch mode desactivado**
- **Optimizado para rendimiento**
- **Gestión avanzada de memoria**

### Comandos PM2 Útiles:

```bash
# Desarrollo
npm run pm2:dev

# Producción  
npm run pm2:prod

# Monitoreo
npm run pm2:status
npm run pm2:monit
npm run pm2:logs

# Control
npm run pm2:restart
npm run pm2:stop
npm run pm2:delete
```

### Logs

Los logs se guardan en el directorio `src/logs/` y `logs/`:
- `all.log`: Todos los logs de la aplicación
- `error.log`: Solo errores de la aplicación
- `pm2-combined.log`: Logs de PM2 combinados
- `pm2-error.log`: Errores de PM2
- `pm2-out.log`: Salida estándar de PM2

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | 3111 |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://admin:password123@localhost:27019/book-reviews?authSource=admin` |
| `CORS_ORIGIN` | Origen permitido para CORS | `*` |
| `JWT_SECRET` | Clave secreta para JWT | Requerida |
| `BASIC_AUTH_USER` | Usuario para autenticación básica | `admin` |
| `BASIC_AUTH_PASS` | Contraseña para autenticación básica | `admin123` |

## 🐛 Solución de Problemas

### MongoDB no se conecta

1. Verificar que Docker esté corriendo:
```bash
docker --version
docker-compose --version
```

2. Verificar que el contenedor de MongoDB esté activo:
```bash
docker-compose ps
```

3. Revisar logs de MongoDB:
```bash
docker-compose logs mongodb
```

### Error de autenticación

1. Verificar que las credenciales en `.env` coincidan con las de `docker-compose.yml`
2. Asegurarse de que el JWT_SECRET esté configurado

### Puerto ocupado

Si el puerto 4000 está ocupado, cambiar la variable `PORT` en el archivo `.env`

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request