import type { LineaCantidad, Producto } from '../types'

export function nombreProducto(productoId: string, productos: readonly Producto[]): string {
  return productos.find((producto) => producto.id === productoId)?.nombre ?? productoId
}

export function describirLineas(lineas: readonly LineaCantidad[], productos: readonly Producto[]): string {
  return lineas.map((linea) => `${nombreProducto(linea.productoId, productos)} × ${linea.cantidad}`).join(', ')
}

export function formatoNumero(valor: number): string {
  return new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 }).format(valor)
}
