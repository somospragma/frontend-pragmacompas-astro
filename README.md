<div align="center">
  <div>
    <img src="./public/favicon.svg" alt="Logo" width="200" height="190">
  <h2 align="center">Arquetipo Astro</h2>
  </div>

  <p align="center"> 
    Arquetipo con estructura optimizada para crear proyectos medianos a grandes utilizando Astro. Incluye configuraciones y herramientas recomendadas que facilitan la escalabilidad, mantenibilidad y rendimiento.
    <br />
  </p>
</div>

<details>
  <summary>Tabla de contenidos</summary>
  <ol>
    <li>
      <a href="#sobre-el-proyecto">Sobre el proyecto</a>
    </li>
    <li>
      <a href="#cómo-empezar">Cómo empezar</a>
      <ul>
        <li><a href="#prerrequisitos">Prerrequisitos</a></li>
        <li><a href="#instalación">Instalación</a></li>
      </ul>
    </li>
    <li><a href="#estructura-de-carpetas">Estructura de carpetas</a></li>
    <li>
      <a href="#documentación">Documentación</a>
      <ul>
        <li><a href="#dependencias">Dependencias</a></li>
        <li><a href="#variables-de-entorno">Variables de entorno</a></li>
        <li><a href="#linters-y-git-hooks">Linters y Git hooks</a></li>
        <li><a href="#estilos">Estilos</a></li>
        <li><a href="#testing">Testing</a></li>
      </ul>
    </li>
    <li><a href="#comandos">Comandos</a></li>
  </ol>
</details>

<!-- SOBRE EL PROYECTO -->

## Sobre el proyecto

Este proyecto es un arquetipo de Astro diseñado para ser reutilizable en proyectos de tamaño mediano. Utiliza SSR (Server-Side Rendering) y static rendering, y está configurado para ser desplegado en Vercel. El proyecto está estructurado siguiendo principios de Clean Architecture, con una clara separación de responsabilidades y capas de abstracción.

## Cómo empezar

Para ejecutar este proyecto localmente, siga las instrucciones a continuación.

### Prerrequisitos

- **npm**: Asegúrate de tener npm instalado.
- **Node.js**: Si usas [nvm](https://github.com/nvm-sh/nvm), ejecuta `nvm use` para usar la versión correcta de Node.js. Si no usas nvm, instala la versión especificada en el archivo `.nvmrc`.

### Instalación

1. Clonar el repositorio:

   ```sh
   git clone https://github.com/Jhon-H/Arquetipo-Astro
   ```

2. Instalar las dependencias:

   ```sh
   cd Arquetipo-Astro && npm install
   ```

3. Crear archivo `.env` y agregar las variables de entorno:

   ```sh
   cp .env.example .env
   ```

4. Iniciar el servidor local:
   ```sh
   npm run dev
   ```

## Estructura de carpetas

La estructura de carpetas del proyecto es la siguiente:

```
src/
├── assets/           # Recursos estáticos como imágenes
├── components/       # Componentes (usando Atomic Design)
│ ├── atoms/
│ ├── molecules/
│ ├── organisms/
│ ├── templates/
│ └── ui/             # Componentes de UI de shadcn
├── infrastructure/   # Capa de infraestructura
│ ├── adapters/       # Adaptadores para librerías de terceros
│ ├── mappers/        # Mapeo de modelos a entidades
│ ├── models/         # Interfaces de respuesta del backend
│ └── services/       # Endpoints del backend
├── pages/            # Páginas y endpoints API
│ └── api/            # Endpoints API
├── shared/
│ ├── entities/       # Modelos de frontend
│ ├── types/          # Tipos comunes
│ └── utils/          # Utilidades
├── store/            # Stores (ej: Nanostore)
├── styles/           # Estilos globales y de Tailwind
└── tests/
│ ├── mocks/          # Mocks para pruebas
│ ├── e2e/            # Pruebas end-to-end
│ └── unit/           # Pruebas unitarias
```

## Documentación

### Dependencias

El proyecto utiliza React como framework dentro de Astro, y está configurado con herramientas como Husky, ESLint, Prettier, y Vitest para testing. Las dependencias se gestionan con npm.

### Variables de entorno

El proyecto utiliza un único archivo `.env` en la raíz del proyecto. Este archivo se debe llenar de acuerdo al ambiente en el que se esté trabajando.

### Linters y Git hooks

El proyecto está configurado con ESLint, Prettier, y Husky para garantizar la calidad del código. Los hooks de Git se configuran automáticamente al instalar las dependencias.

### Estilos

El proyecto utiliza CSS, Tailwind CSS, y shadcn para los estilos. Los estilos globales se encuentran en la carpeta `src/styles`.

### Testing

El proyecto utiliza Vitest para las pruebas unitarias y e2e. Las pruebas se encuentran en la carpeta `src/tests`.

## Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando            | Acción                                               |
| :----------------- | :--------------------------------------------------- |
| `npm install`      | Instala las dependencias                             |
| `npm run dev`      | Inicia el servidor de desarrollo en localhost:4321   |
| `npm run build`    | Construye el sitio para producción en `./dist/`      |
| `npm run preview`  | Previsualiza la construcción localmente              |
| `npm run astro`    | Ejecuta comandos de la CLI de Astro                  |
| `npm run coverage` | Ejecuta las pruebas y genera un reporte de cobertura |
| `npm run test`     | Ejecuta las pruebas unitarias                        |
| `npm run lint`     | Ejecuta ESLint para verificar el código              |
| `npm run lint:fix` | Ejecuta ESLint y corrige los errores                 |
| `npm run format`   | Formatea el código con Prettier                      |
| `npm run prepare`  | Configura Husky para los hooks de Git                |

### Enlaces útiles

- [Middleware en Astro](https://docs.astro.build/en/guides/middleware/)
- [Variables de entorno en Astro](https://docs.astro.build/en/guides/environment-variables/)
- [SSR en Astro](https://docs.astro.build/en/guides/server-side-rendering/)
