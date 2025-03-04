# 01234 Concept Visualization Engine

## Descripción

Una aplicación web que analiza textos para generar visualizaciones interactivas de conceptos interconectados basados en el Modelo 01234, categorizando ideas en cinco niveles fundamentales (Potencialidad, Unidad, Dualidad, Conexión y Manifestación).

## Características Principales

- **Panel de Entrada de Texto**: Editor limpio para ingresar texto y botón de análisis que activa el procesamiento NLP.
- **Canvas de Visualización Interactivo**: Muestra nodos codificados por colores (uno para cada concepto) conectados por líneas de relación, con cada nodo asignado a uno de los cinco niveles 01234.
- **Controles de Visualización**: Herramientas para hacer zoom, mover el canvas y activar efectos visuales.
- **Barra Lateral de Detalles**: Muestra el razonamiento detrás de la categorización de cada concepto.
- **Funcionalidad de Exportación**: Permite a los usuarios guardar visualizaciones como imágenes o compartirlas.
- **Entrenamiento del Modelo**: Panel para personalizar cómo el modelo analiza los textos mediante ejemplos y prompts personalizados.
- **Configuración de Prompts**: Interfaz para modificar los prompts del sistema y análisis, así como los ajustes del modelo.
- **Interfaz Minimalista**: Diseño centrado en la visualización, con un esquema de colores que refleja los cinco niveles del Modelo 01234.

## Tecnologías

- React + TypeScript
- Vite
- OpenAI API
- Tailwind CSS
- Shadcn/UI
- Canvas API para visualizaciones

## Modelo 01234

El Modelo 01234 categoriza conceptos en cinco niveles fundamentales:

0. **Potencialidad**: El reino de la posibilidad pura, el potencial y lo no manifestado.
1. **Unidad**: El nivel de la unicidad, la totalidad y la no dualidad.
2. **Dualidad**: El nivel de los opuestos, las polaridades y los pares complementarios.
3. **Conexión**: El nivel de las relaciones, las redes y las interacciones.
4. **Manifestación**: El nivel de la expresión física, la realidad concreta y los resultados tangibles.

## Configuración

### Protección de la clave API

Para proteger tu clave API de OpenAI y evitar que se exponga en GitHub:

1. Copia el archivo `.env.example` a un nuevo archivo llamado `.env.local`:
   ```
   cp .env.example .env.local
   ```

2. Edita el archivo `.env.local` y añade tu clave API de OpenAI:
   ```
   VITE_OPENAI_API_KEY=sk-tu-clave-api-aqui
   ```

3. El archivo `.env.local` está incluido en `.gitignore` para asegurar que nunca se suba a GitHub.

4. Para despliegues en producción, configura la variable de entorno `VITE_OPENAI_API_KEY` en tu plataforma de hosting.

### Desarrollo local

Si no tienes una clave API configurada en las variables de entorno y estás en modo desarrollo, la aplicación mostrará un diálogo para introducirla manualmente, que se guardará en el almacenamiento local del navegador.

### Producción

En producción, la clave API solo se puede configurar mediante variables de entorno en el servidor. El diálogo para introducir la clave API no se mostrará en producción, y la aplicación no utilizará claves almacenadas en localStorage por razones de seguridad.

## Despliegue en Vercel

Este proyecto está configurado para ser desplegado fácilmente en Vercel:

1. Crea una cuenta en [Vercel](https://vercel.com) si aún no tienes una.

2. Conecta tu repositorio de GitHub a Vercel.

3. Configura la variable de entorno `VITE_OPENAI_API_KEY` en la configuración del proyecto en Vercel.

4. Despliega el proyecto. Vercel detectará automáticamente que es un proyecto Vite y utilizará la configuración del archivo `vercel.json`.

5. La aplicación estará disponible en la URL proporcionada por Vercel una vez completado el despliegue.
