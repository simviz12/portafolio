# Portafolio · Carlos Julián Benavides Burbano

Portafolio personal hecho con Next.js (App Router), Tailwind CSS 4, Framer Motion y Three.js.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
```

## Proyectos y videos

Los proyectos viven en `data/projects.ts`. Un proyecto con el campo `video` aparece en el bloque
"Recorridos en video" y se abre en el reproductor (`components/ProjectViewer.tsx`).

Para agregar un video:

1. Copia el `.mp4` a `public/videos/` y una portada 16:9 a `public/videos/posters/`.
2. Añade `video: { src, poster, duration, chapters }` al proyecto. Cada capítulo es
   `{ t: segundoDeInicio, label: { en, es } }`.

## CV

`public/cv.html` es la fuente del CV de una hoja y `public/cv.pdf` es lo que descarga el sitio.
Después de editar el HTML, regenera el PDF con Chrome:

```bash
chrome --headless=new --no-pdf-header-footer --print-to-pdf=public/cv.pdf public/cv.html
```

`public/cv-largo.html` conserva la versión anterior de dos páginas.

## Despliegue

Cualquier push a `main` queda listo para desplegar en Vercel con la configuración por defecto de Next.js.
