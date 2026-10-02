import { productos } from '../data/inventario'
import type { LineaCantidad, LineaConPrecio } from '../types'

export function validarLineas(lineas: readonly LineaCantidad[]): void {
  if (lineas.length === 0) throw new Error('Agrega al menos un producto.')

  for (const linea of lineas) {
    if (!productos.some((producto) => producto.id === linea.productoId)) {
      throw new Error('Selecciona un producto válido.')
    }
    if (!Number.isFinite(linea.cantidad) || linea.cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor que cero.')
    }
  }
}

export function validarLineasConPrecio(lineas: readonly LineaConPrecio[]): void {
  validarLineas(lineas)

  if (lineas.some((linea) => !Number.isFinite(linea.precioUnitario) || linea.precioUnitario < 0)) {
    throw new Error('El precio unitario debe ser cero o mayor.')
  }
}
