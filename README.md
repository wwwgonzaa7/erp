# ERP EnterpriseCloud

Base del frontend con React, TypeScript y Vite.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Despliegue

Ejecuta `npm run lint` y `npm run build`, y publica el contenido de `dist/` en la raíz del sitio. Como las rutas se resuelven en el navegador, configura el servidor de archivos estáticos para devolver `index.html` al abrir directamente cualquiera de las ocho rutas del ERP. Si FastAPI usa otro origen, define `VITE_API_BASE_URL` antes de compilar; por ahora las pantallas siguen utilizando los datos mock locales.

## Estructura

`src/layouts` contiene el layout del ERP y la base de autenticación para uso futuro. `src/pages` contiene el Panel. `src/modules` agrupa las pantallas de compras, ventas, finanzas e inventario según su dominio. `src/types` define las entidades base y las exporta desde `src/types/index.ts`. `src/data` contiene registros mock tipados y los exporta desde `src/data/index.ts`. `src/services` consulta y modifica esos registros en memoria y contiene la preparación para FastAPI; `src/hooks` los carga en React y permite recargarlos tras un cambio.

## Acceso a datos

Los services consultan los mocks y devuelven `Promise<readonly T[]>`. Los hooks exponen `{ data, loading, error, reload }` para clientes, proveedores, órdenes de compra, recepciones, ventas, facturas, cuentas por cobrar, productos y almacenes. Las pantallas permiten crear, editar y eliminar órdenes, ventas, facturas, cuentas por cobrar y recepciones locales. Los registros relacionados impiden eliminar o editar su origen cuando se perdería la coherencia entre entidades. La cantidad recibida no puede superar la ordenada; el importe de una factura coincide con su venta y el de una cuenta por cobrar con su factura. Los cambios viven solo en memoria y se reinician al recargar la página.

Movimiento de Kardex se calcula con recepciones y ventas y muestra el saldo global por producto después de cada movimiento; Stock de Productos muestra el saldo global actual. Las ventas actuales no incluyen `almacenId`, por lo que no se calcula stock por almacén. No hay llamadas reales a la API, autenticación ni pagos implementados.

## Preparación para FastAPI

`src/services/api/endpoints.ts` registra únicamente los 11 endpoints proporcionados. `src/services/api/client.ts` construye la URL desde `VITE_API_BASE_URL` y ofrece una petición HTTP que exige indicar el método y devuelve la respuesta sin interpretarla. Copia `.env.example` a `.env.local` y configura solo el origen de FastAPI cuando exista. El proveedor opcional de encabezados permite incorporar después la sesión o el token sin asumir su formato; `AccessContext` usa los tipos existentes de usuario, rol y permiso sin aplicar reglas.

Los services actuales siguen usando mocks. `withMockFallback` permite mantenerlos como respaldo en desarrollo ante fallos de red cuando se añadan adaptadores reales. Los errores de otros tipos se propagan para no ocultar problemas de integración. Todavía no se invoca la API desde las pantallas porque faltan los contratos de métodos, parámetros y respuestas del backend.

## Rutas

`/` redirige a `/inicio/panel`. El logo textual enlaza también al Panel.

| Grupo de navegación | Opción | Ruta | Módulo y tipos relacionados |
| --- | --- | --- | --- |
| Inicio | Panel | `/inicio/panel` | Página general |
| Compras | Orden de Compras | `/compras/ordenes` | Compras · `OrdenCompra` |
| Ventas | Orden de Ventas | `/ventas/ordenes` | Ventas · `Venta` |
| Ventas | Facturación | `/ventas/facturacion` | Ventas · `Factura` |
| Ventas | Estado de Cuenta | `/ventas/estado-cuenta` | Finanzas · `CuentaPorCobrar` |
| Ventas | Ingreso al Kardex | `/ventas/ingreso-kardex` | Inventario · `Producto`, `Almacen`, `Recepcion` |
| Ventas | Movimiento de Kardex | `/ventas/movimiento-kardex` | Inventario · `Producto`, `Almacen` |
| Ventas | Stock de Productos | `/ventas/stock-productos` | Inventario · `Producto`, `Almacen` |
